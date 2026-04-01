# Configuración de Workflows n8n para VocTest IA

## 📍 URLs de Webhook para el Frontend

### URL Principal (Usar desde NestJS):
```
https://gmn8nwebhook.goodapps.space/webhook/voctest/chat
```

### Flujo de Comunicación:

1. **Envío de mensaje de chat:**
   ```json
   POST https://gmn8nwebhook.goodapps.space/webhook/voctest/chat
   {
     "sessionId": "uuid-v4",
     "message": "texto del usuario",
     "checkStatus": false,
     "plan": "b2c",
     "userId": null,
     "tenantId": null,
     "email": null,
     "userName": null
   }
   ```

2. **Consulta de estado (polling):**
   ```json
   POST https://gmn8nwebhook.goodapps.space/webhook/voctest/chat
   {
     "sessionId": "uuid-v4",
     "checkStatus": true
   }
   ```

## 🔧 Configuración de Workflows en n8n

### Orden de Importación:
1. **Importar Workflow de Análisis** (`03-analisis-informe.json`)
   - Activar este workflow primero
   - Anotar la URL del webhook de análisis (ej: `/webhook/voctest/analysis`)

2. **Importar Workflow de Chat** (`02-chat-conversacional.json`)
   - Activar este workflow
   - Anotar la URL del webhook de chat (ej: `/webhook/voctest/chat-handler`)

3. **Importar Workflow Principal** (`01-orquestador-principal.json`)
   - Actualizar la URL en el nodo `[HTTP] Llamar Workflow Chat` para que apunte al webhook del workflow de chat
   - Actualizar la URL en el nodo `[HTTP] Llamar análisis` del workflow de chat para que apunte al webhook del workflow de análisis

### Credenciales Necesarias:

1. **Redis:**
   - Nombre: `Redis_GoodApps`
   - ID: `kC0Bfi0yQOAqlL1I`
   - Configurar con los datos de tu instancia Redis

2. **OpenAI:**
   - Nombre: `OpenAi GoodApps`
   - ID: `LVIDq0T0z4cISnRM`
   - Configurar con tu API key de OpenAI

3. **Gmail (para envío de emails):**
   - Nombre: `Gmail account`
   - ID: `OiZEeFUODmvbFi12`
   - Configurar con OAuth2 para envío de emails

## 🔄 Flujo de Trabajo

### Cuando el Usuario Envía un Mensaje (`checkStatus: false`):

1. **Workflow Principal recibe la petición**
   - Identifica que es un mensaje de chat (no status check)
   - Redirige al workflow de chat via HTTP Request

2. **Workflow de Chat procesa:**
   - Busca sesión existente en Redis
   - Si no existe: crea nueva sesión con estado "chatting"
   - Si existe y está en "awaiting_email": procesa el email
   - Prepara contexto para el agente de IA
   - Ejecuta el agente conversacional
   - Actualiza puntuaciones RIASEC
   - Retorna respuesta según el estado

3. **Cuando el test está completo:**
   - Cambia estado a "awaiting_email"
   - Pide email al usuario (phase: "COMPLETE", testCompleto: false)
   - Cuando recibe email válido:
     - Genera informe vía workflow de análisis
     - Envía email al usuario
     - Retorna testCompleto: true

### Cuando el Frontend Hace Polling (`checkStatus: true`):

1. **Workflow Principal busca resultado en Redis**
   - Si existe resultado completo: retorna VocTestResult
   - Si no existe: retorna { ready: false, message: "Analizando..." }

## 📊 Respuestas Esperadas

### Chat Response (mensajes intermedios):
```json
{
  "message": "Respuesta del agente",
  "phase": "EXPLORING",
  "questionCount": 12,
  "sessionId": "uuid-v4",
  "testCompleto": false,
  "processing": false
}
```

### Cuando Pide Email:
```json
{
  "message": "¡Excelente! Ya tengo toda la información...",
  "phase": "COMPLETE",
  "questionCount": 25,
  "sessionId": "uuid-v4",
  "testCompleto": false,
  "processing": false
}
```

### Cuando Email es Inválido:
```json
{
  "message": "¡Ups! Ese no parece un email válido...",
  "phase": "COMPLETE",
  "questionCount": 25,
  "sessionId": "uuid-v4",
  "testCompleto": false,
  "processing": false
}
```

### Cuando Email es Válido (y se genera el informe):
```json
{
  "message": "¡Perfecto! Tu informe vocacional va a ser enviado a usuario@correo.com...",
  "phase": "COMPLETE",
  "questionCount": 25,
  "sessionId": "uuid-v4",
  "testCompleto": true,
  "processing": false
}
```

### Status Response (cuando está listo):
```json
{
  "ready": true,
  "sessionId": "uuid-v4",
  "hollandCode": "ASI",
  "perfilTitulo": "Perfil Artístico-Social-Investigador",
  "perfilDescripcion": "Descripción del perfil...",
  "fortalezas": ["Creatividad", "Empatía", "Pensamiento analítico"],
  "areasDesarrollo": ["Gestión de proyectos", "Habilidades técnicas"],
  "carreras": [
    {
      "nombre": "Diseño UX/UI",
      "match": 94,
      "descripcion": "Diseño de experiencias digitales...",
      "area": "Tecnología y Diseño",
      "duracion": "4 años",
      "salida": "Alta demanda laboral"
    }
  ],
  "riasecScores": { "R": 40, "I": 85, "A": 92, "S": 78, "E": 55, "C": 30 },
  "consejosEstudio": ["Buscá programas con componentes prácticos"],
  "fraseMotivadora": "Tu perfil combina creatividad con empatía...",
  "generadoEn": "2026-03-30T12:00:00Z"
}
```

### Status Response (cuando no está listo):
```json
{
  "ready": false,
  "sessionId": "uuid-v4",
  "message": "Analizando tu perfil vocacional..."
}
```

## ⚠️ Notas Importantes

1. **TTL de Redis:**
   - Sesiones activas: 2 horas (7200s)
   - Sesiones completas con email: 24 horas (86400s)
   - Resultados del análisis: 24 horas (86400s)

2. **Manejo de Errores:**
   - Cada nodo de Code tiene try/catch para manejar errores de parseo
   - Respuestas de fallback en caso de error

3. **Timeouts:**
   - HTTP Request al workflow de chat: 30 segundos
   - HTTP Request al workflow de análisis: 60 segundos
   - OpenAI: 45 segundos

4. **Validación de Email:**
   - Se valida formato de email antes de enviar el informe
   - Si el email es inválido, se pide de nuevo sin perder la sesión

5. **Estados de Sesión:**
   - `chatting`: Usuario en conversación activa
   - `awaiting_email`: Test completo, esperando email
   - `complete`: Informe generado y enviado

## 🚀 Pasos para Desplegar

1. **Importar workflows en n8n** en el orden indicado
2. **Configurar credenciales** (Redis, OpenAI, Gmail)
3. **Actualizar URLs** en los nodos HTTP Request
4. **Activar workflows**
5. **Probar con:**
   - POST a `/webhook/voctest/chat` con `checkStatus: false`
   - POST a `/webhook/voctest/chat` con `checkStatus: true`

## 🧪 Casos de Prueba

### Flujo Completo:
1. Enviar mensaje inicial: `Hola`
2. Responder a 25 preguntas del agente
3. Cuando pida email, enviar un email válido
4. Verificar que se recibe `testCompleto: true`
5. Hacer polling con `checkStatus: true` para obtener el informe completo

### Email Inválido:
1. Llegar al punto de pedir email
2. Enviar email inválido: `esto-no-es-email`
3. Verificar que se pide de nuevo con mensaje amable
4. Enviar email válido después

### Sesión Nueva vs Existente:
1. Enviar primer mensaje (crea sesión)
2. Enviar segundo mensaje (carga sesión existente)
3. Verificar que el contador de preguntas incrementa correctamente

## 📝 Estructura de Archivos

```
workflows/
├── 01-orquestador-principal.json    # Webhook principal, redirige según checkStatus
├── 02-chat-conversacional.json      # Manejo de conversación y lógica de email
├── 03-analisis-informe.json         # Generación de informe y envío de email
└── README.md                        # Esta documentación
```
