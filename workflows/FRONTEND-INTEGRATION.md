# Integración Frontend - VocTest IA

## 📋 Resumen de Integración

### URLs que tu Frontend debe usar:

| Operación | URL | Método | Body |
|-----------|-----|--------|------|
| Enviar mensaje | `https://gmn8nwebhook.goodapps.space/webhook/voctest/chat` | POST | `{ checkStatus: false, ... }` |
| Consultar status | `https://gmn8nwebhook.goodapps.space/webhook/voctest/chat` | POST | `{ checkStatus: true, ... }` |

### Respuestas que recibirás:

| Estado | Response Type | Propiedades clave |
|--------|---------------|-------------------|
| Chat en progreso | `ChatResponse` | `testCompleto: false`, `processing: false` |
| Pidiendo email | `ChatResponse` | `phase: "COMPLETE"`, `testCompleto: false` |
| Email enviado | `ChatResponse` | `testCompleto: true`, `processing: false` |
| Resultado listo | `VocTestResult` | `ready: true`, todos los datos del informe |
| Resultado pendiente | `VocTestPending` | `ready: false`, `message: "Analizando..."` |

## 🎯 Tipos TypeScript Exactos

### Request para Chat (`checkStatus: false`):
```typescript
interface N8nChatRequest {
  sessionId: string;      // UUID v4, persistido en localStorage
  message: string;        // Texto del usuario
  checkStatus: false;     // Siempre false para chat
  plan: 'b2c' | 'b2b' | 'b2b2c';
  userId: string | null;
  tenantId: string | null;
  email: string | null;
  userName: string | null;
}
```

### Request para Status (`checkStatus: true`):
```typescript
interface N8nStatusRequest {
  sessionId: string;      // UUID v4
  checkStatus: true;      // Siempre true para status
}
```

### Response - Chat en Progreso:
```typescript
interface ChatResponse {
  message: string;        // Mensaje del agente
  phase: 'WELCOME' | 'EXPLORING' | 'COMPLETE';
  questionCount: number;  // Preguntas respondidas (0-25)
  sessionId: string;      // UUID de la sesión
  testCompleto: boolean;  // true cuando el test está completo
  processing?: boolean;   // true si el informe se está generando
}
```

### Response - Resultado Completo (VocTestResult):
```typescript
interface VocTestResult {
  ready: true;
  sessionId: string;
  hollandCode: string;           // Ej: "ASI", "RIC", "ESA"
  perfilTitulo: string;          // Ej: "Perfil Artístico-Social-Investigador"
  perfilDescripcion: string;     // Descripción del perfil
  fortalezas: string[];          // Ej: ["Creatividad", "Empatía", "Pensamiento analítico"]
  areasDesarrollo?: string[];    // Ej: ["Gestión de proyectos", "Habilidades técnicas"]
  carreras: Array<{
    nombre: string;              // Ej: "Diseño UX/UI"
    match: number;               // 0-100
    descripcion: string;         // Descripción de la carrera
    area: string;                // Ej: "Tecnología y Diseño"
    duracion: string;            // Ej: "4 años"
    salida: string;              // Ej: "Alta demanda laboral"
  }>;
  riasecScores: {
    R: number;  // Realista
    I: number;  // Investigador
    A: number;  // Artístico
    S: number;  // Social
    E: number;  // Emprendedor
    C: number;  // Convencional
  };
  consejosEstudio?: string[];    // Ej: ["Buscá programas con componentes prácticos"]
  fraseMotivadora: string;       // Frase motivadora personalizada
  generadoEn: string;            // ISO 8601: "2026-03-30T12:00:00Z"
}
```

### Response - Resultado Pendiente (VocTestPending):
```typescript
interface VocTestPending {
  ready: false;
  sessionId: string;
  message: string;               // Ej: "Analizando tu perfil vocacional..."
}
```

## 🔄 Flujo Completo de Integración

### 1. Cuando el Usuario Envía un Mensaje:

```typescript
// En tu servicio de chat (NestJS)
async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
  const response = await axios.post<ChatResponse>(
    'https://gmn8nwebhook.goodapps.space/webhook/voctest/chat',
    {
      sessionId,
      message,
      checkStatus: false,
      plan: 'b2c',
      userId: this.userStore.userId,
      tenantId: this.userStore.tenantId,
      email: this.userStore.email,
      userName: this.userStore.userName,
    }
  );
  
  return response.data;
}
```

### 2. Cuando el Frontend Hace Polling (Status):

```typescript
// En tu servicio de status (NestJS)
async checkStatus(sessionId: string): Promise<VocTestResult | VocTestPending> {
  const response = await axios.post<VocTestResult | VocTestPending>(
    'https://gmn8nwebhook.goodapps.space/webhook/voctest/chat',
    {
      sessionId,
      checkStatus: true,
    }
  );
  
  return response.data;
}
```

### 3. En tu Zustand Store:

```typescript
import { create } from 'zustand';

interface ChatStore {
  sessionId: string;
  phase: 'WELCOME' | 'EXPLORING' | 'COMPLETE';
  questionCount: number;
  isPaid: boolean;
  showPaymentGate: boolean;
  result: VocTestResult | null;
  
  // Actions
  initSession: () => void;
  setPhase: (phase: ChatResponse['phase']) => void;
  setQuestionCount: (count: number) => void;
  markAsPaid: () => void;
  setShowPaymentGate: (show: boolean) => void;
  setResult: (result: VocTestResult) => void;
  resetSession: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessionId: '',
  phase: 'WELCOME',
  questionCount: 0,
  isPaid: false,
  showPaymentGate: false,
  result: null,
  
  initSession: () => {
    // Generar sessionId al iniciar
    const sessionId = crypto.randomUUID();
    set({ sessionId });
  },
  
  setPhase: (phase) => set({ phase }),
  setQuestionCount: (count) => set({ questionCount: count }),
  markAsPaid: () => set({ isPaid: true, showPaymentGate: false }),
  setShowPaymentGate: (show) => set({ showPaymentGate: show }),
  setResult: (result) => set({ result }),
  resetSession: () => set({
    sessionId: crypto.randomUUID(),
    phase: 'WELCOME',
    questionCount: 0,
    isPaid: false,
    showPaymentGate: false,
    result: null,
  }),
}));
```

### 4. En tu Hook useVocTest:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatStore } from '../store/chat.store';

export function useVocTest() {
  const { sessionId, setPhase, setQuestionCount, markAsPaid, setShowPaymentGate } = useChatStore();
  const queryClient = useQueryClient();
  
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('https://gmn8nwebhook.goodapps.space/webhook/voctest/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message,
          checkStatus: false,
          plan: 'b2c',
          userId: null,
          tenantId: null,
          email: null,
          userName: null,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (error.code === 'PAYMENT_REQUIRED') {
          setShowPaymentGate(true);
          throw new Error('PAYMENT_REQUIRED');
        }
        throw new Error('Error al enviar mensaje');
      }
      
      return response.json() as Promise<ChatResponse>;
    },
    onSuccess: (data) => {
      // Actualizar estado
      setPhase(data.phase);
      setQuestionCount(data.questionCount);
      
      // Si el test está completo, empezar polling
      if (data.testCompleto) {
        queryClient.invalidateQueries({ queryKey: ['status', sessionId] });
      }
    },
  });
  
  return {
    sendMessage: sendMessageMutation.mutate,
    isLoading: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
  };
}
```

### 5. En tu Hook usePolling:

```typescript
import { useQuery } from '@tanstack/react-query';
import { useChatStore } from '../store/chat.store';

export function usePolling() {
  const { sessionId, result, setResult } = useChatStore();
  
  const statusQuery = useQuery({
    queryKey: ['status', sessionId],
    queryFn: async () => {
      const response = await fetch('https://gmn8nwebhook.goodapps.space/webhook/voctest/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          checkStatus: true,
        }),
      });
      
      return response.json() as Promise<VocTestResult | VocTestPending>;
    },
    refetchInterval: 3000, // Polling cada 3 segundos
    enabled: !!sessionId && !result, // Solo hacer polling si no hay resultado
  });
  
  // Actualizar store cuando el resultado esté listo
  if (statusQuery.data?.ready && !result) {
    setResult(statusQuery.data);
  }
  
  return {
    isReady: statusQuery.data?.ready ?? false,
    result: statusQuery.data,
    isPolling: statusQuery.isFetching,
    error: statusQuery.error,
  };
}
```

## 🎨 Componentes de Chat

### Ejemplo de MessageBubble:
```typescript
interface MessageBubbleProps {
  message: string;
  role: 'user' | 'agent';
  timestamp?: string;
}

export function MessageBubble({ message, role, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold mb-2">
            V
          </div>
        )}
        <div
          className={`p-4 rounded-2xl ${
            isUser
              ? 'bg-indigo-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          {message}
        </div>
        {timestamp && (
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(timestamp).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Ejemplo de TypingIndicator:
```typescript
export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold mb-2">
        V
      </div>
      <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
```

## 🔐 Manejo de Errores

### Error de Pago Requerido:
```typescript
// En tu servicio
if (response.status === 403 && response.data?.code === 'PAYMENT_REQUIRED') {
  // Mostrar modal de pago
  setShowPaymentGate(true);
  return;
}
```

### Error de Red:
```typescript
// Con retry automático
const sendMessageWithRetry = async (message: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await sendMessage(message);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
};
```

### Timeout Handling:
```typescript
// En tu axios instance
const apiClient = axios.create({
  timeout: 30000, // 30 segundos
  headers: { 'Content-Type': 'application/json' },
});
```

## 📊 Estados del Chat

### Estados Posibles:
1. **WELCOME**: Primer mensaje, agente se presenta
2. **EXPLORING**: Agente hace preguntas (1-25)
3. **COMPLETE**: Test completo, pidiendo email o enviado

### Transiciones:
- `WELCOME` → `EXPLORING`: Después del primer intercambio
- `EXPLORING` → `COMPLETE`: Cuando se completan 25 preguntas
- `COMPLETE`: El usuario debe enviar email para continuar

### Flujo de Email:
1. Agente pide email (phase: 'COMPLETE', testCompleto: false)
2. Usuario envía email en el chat
3. Si válido: testCompleto → true, processing → false
4. Si inválido: Se pide de nuevo con mensaje amable

## 🧪 Pruebas

### Casos de Prueba:
1. **Primer mensaje**: Debe responder con bienvenida
2. **Continuar conversación**: Debe incrementar questionCount
3. **Alcanzar 25 preguntas**: Debe pedir email
4. **Email inválido**: Debe pedir de nuevo
5. **Email válido**: Debe retornar testCompleto: true
6. **Polling**: Debe retornar ready: true cuando el informe esté listo

### Ejemplo de Prueba:
```typescript
describe('VocTest Integration', () => {
  it('debe manejar el flujo completo', async () => {
    // 1. Iniciar sesión
    const sessionId = crypto.randomUUID();
    
    // 2. Enviar primer mensaje
    const response1 = await sendMessage(sessionId, 'Hola');
    expect(response1.phase).toBe('WELCOME');
    
    // 3. Continuar hasta completar
    // ... (enviar 25 mensajes)
    
    // 4. Cuando pida email
    expect(response25.phase).toBe('COMPLETE');
    expect(response25.testCompleto).toBe(false);
    
    // 5. Enviar email válido
    const responseEmail = await sendMessage(sessionId, 'usuario@ejemplo.com');
    expect(responseEmail.testCompleto).toBe(true);
    
    // 6. Hacer polling
    const status = await checkStatus(sessionId);
    expect(status.ready).toBe(true);
  });
});
```

## 🚀 Optimizaciones

### Caché de Respuestas:
```typescript
// Cache de respuestas similares
const responseCache = new Map<string, ChatResponse>();

async function getCachedResponse(sessionId: string, message: string): Promise<ChatResponse | null> {
  const key = `${sessionId}:${message}`;
  return responseCache.get(key) || null;
}
```

### Debounce de Mensajes:
```typescript
// Evitar envíos muy rápidos
import { debounce } from 'lodash';

const debouncedSendMessage = debounce(sendMessage, 300);
```

### Lazy Loading de Resultados:
```typescript
// Solo cargar cuando sea necesario
const shouldPoll = phase === 'COMPLETE' && !result;
```

## 📱 Responsive Design

### Breakpoints:
- Mobile: 0-640px
- Tablet: 641-1024px
- Desktop: 1025px+

### Componentes:
- Chat en pantalla completa en mobile
- Sidebar en desktop
- Modal de pago responsive

## 🔗 Enlaces Útiles

### Documentación:
- [README.md](./README.md) - Guía principal
- [DIAGRAM.md](./DIAGRAM.md) - Diagramas de flujo
- [CHECKLIST.md](./CHECKLIST.md) - Checklist de implementación

### Scripts:
- `./test-workflows.sh` - Probar workflows
- `python3 validate-workflows.py` - Validar JSONs

### URLs:
- Producción: `https://gmn8nwebhook.goodapps.space`
- Desarrollo: `http://localhost:5678`

---

**Creado por**: VocTest IA Team  
**Última actualización**: 30 de marzo de 2026  
**Versión**: 1.0.0
