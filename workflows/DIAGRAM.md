# Diagrama de Flujo - VocTest IA Workflows

## 🔄 Flujo Principal de Comunicación

```
┌─────────────────────────────────────────────────────────┐
│                FRONTEND (Next.js)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  NestJS Backend                                 │   │
│  │  POST /webhook/voctest/chat                     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                N8N INSTANCIA                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  WEBHOOK PRINCIPAL (/voctest/chat)              │   │
│  │  checkStatus: true/false                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  CHECK STATUS           │   │  CHAT MESSAGE           │
│  checkStatus: true      │   │  checkStatus: false     │
└─────────────────────────┘   └─────────────────────────┘
          │                                 │
          ▼                                 ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  REDIS: GET RESULT      │   │  WORKFLOW CHAT          │
│  voc:result:{sessionId} │   │  Procesar conversación  │
└─────────────────────────┘   └─────────────────────────┘
          │                                 │
          ▼                                 │
┌─────────────────────────┐                 │
│  ¿RESULTADO EXISTE?     │                 │
│  ┌───────┬───────────┐  │                 │
│  │  SÍ   │    NO     │  │                 │
│  └───────┴───────────┘  │                 │
└─────────────────────────┘                 │
          │                                 │
          ▼                                 │
┌─────────────────────────┐                 │
│  RETORNAR               │                 │
│  VocTestResult completo │                 │
│  { ready: true, ... }   │                 │
└─────────────────────────┘                 │
                                            │
                                            ▼
                              ┌─────────────────────────┐
                              │  BUSCAR SESIÓN EN REDIS │
                              │  voc:session:{sessionId}│
                              └─────────────────────────┘
                                            │
                                            ▼
                              ┌─────────────────────────┐
                              │  ¿SESIÓN EXISTE?        │
                              │  ┌───────┬───────────┐  │
                              │  │  SÍ   │    NO     │  │
                              │  └───────┴───────────┘  │
                              └─────────────────────────┘
                                            │
                                ┌───────────┴───────────┐
                                │                       │
                                ▼                       ▼
                    ┌────────────────────┐  ┌────────────────────┐
                    │  PARSEAR SESIÓN    │  │  CREAR NUEVA       │
                    │  EXISTENTE         │  │  SESIÓN            │
                    └────────────────────┘  └────────────────────┘
                                │                       │
                                └───────────┬───────────┘
                                            │
                                            ▼
                              ┌─────────────────────────┐
                              │  ¿ESTADO DE SESIÓN?     │
                              │  ┌───────┬───────────┐  │
                              │  │ chatting │ await_email│ │
                              │  └───────┴───────────┘  │
                              └─────────────────────────┘
                                            │
                                ┌───────────┴───────────┐
                                │                       │
                                ▼                       ▼
                    ┌────────────────────┐  ┌────────────────────┐
                    │  PREPARAR          │  │  PROCESAR EMAIL    │
                    │  CONTEXTO AGENTE   │  │  RECIBIDO          │
                    └────────────────────┘  └────────────────────┘
                                │                       │
                                ▼                       │
                    ┌────────────────────┐              │
                    │  EJECUTAR AGENTE   │              │
                    │  DE IA CON MEMORY  │              │
                    └────────────────────┘              │
                                │                       │
                                ▼                       ▼
                    ┌────────────────────┐  ┌────────────────────┐
                    │  PARSEAR RESPUESTA │  │  ¿EMAIL VÁLIDO?    │
                    │  DEL AGENTE        │  │  ┌─────┬────────┐  │
                    └────────────────────┘  │  │ SÍ  │   NO   │  │
                                │           │  └─────┴────────┘  │
                                │           └────────────────────┘
                                │                       │
                                │                       │
              ┌─────────────────┴─────────────────┐    │
              │                                   │    │
              ▼                                   │    │
┌─────────────────────────┐                       │    │
│  ¿AGENTE PIDIÓ EMAIL?   │                       │    │
│  ┌───────┬───────────┐  │                       │    │
│  │  SÍ   │    NO     │  │                       │    │
│  └───────┴───────────┘  │                       │    │
└─────────────────────────┘                       │    │
          │                                       │    │
          │                       ┌───────────────┘    │
          │                       │                    │
          ▼                       ▼                    ▼
┌─────────────────────────┐  ┌─────────────────────────────────┐
│  CAMBIAR ESTADO A:      │  │  GUARDAR EMAIL EN SESIÓN        │
│  status: awaiting_email │  │  CAMBIAR ESTADO A: complete     │
│  phase: COMPLETE        │  │                                 │
└─────────────────────────┘  └─────────────────────────────────┘
          │                                                   │
          │                                                   ▼
          │                                   ┌─────────────────────────┐
          │                                   │  GENERAR INFORME        │
          │                                   │  VIA WORKFLOW ANÁLISIS  │
          │                                   │  (HTTP Request)         │
          │                                   └─────────────────────────┘
          │                                                   │
          │                                                   ▼
          │                                   ┌─────────────────────────┐
          │                                   │  RETORNAR:              │
          │                                   │  testCompleto: true     │
          │                                   │  processing: false      │
          │                                   └─────────────────────────┘
          │
          │
          ▼
┌─────────────────────────┐
│  RETORNAR:              │
│  testCompleto: false    │
│  processing: false      │
│  (con mensaje del       │
│   agente pidiendo email)│
└─────────────────────────┘


## 📧 Flujo del Workflow de Análisis

┌─────────────────────────────────────────────────────────┐
│  RECIBIR DATOS DESDE WORKFLOW CHAT                      │
│  Via HTTP Request                                       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  PREPARAR ANÁLISIS RIASEC                               │
│  • Calcular código Holland                             │
│  • Formatear scores para OpenAI                        │
│  • Construir prompt de análisis                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  LLAMAR A OPENAI                                        │
│  Modelo: gpt-4o                                         │
│  Temperatura: 0.65                                      │
│  Max tokens: 1800                                       │
│  response_format: json_object                           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  PARSEAR RESPUESTA DE OPENAI                            │
│  • Extraer JSON de la respuesta                        │
│  • Validar estructura del informe                      │
│  • Preparar datos para guardar                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  GUARDAR RESULTADO EN REDIS                             │
│  Clave: voc:result:{sessionId}                         │
│  TTL: 86400s (24 horas)                                │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  CONSTRUIR HTML DEL INFORME                             │
│  • Código Holland con barras RIASEC                    │
│  • Perfil con descripción                              │
│  • Top 5 carreras recomendadas                         │
│  • Fortalezas y consejos                               │
│  • Frase motivadora                                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  ¿TIENE EMAIL?                                          │
│  ┌───────┬───────────┐                                 │
│  │  SÍ   │    NO     │                                 │
│  └───────┴───────────┘                                 │
└─────────────────────────────────────────────────────────┘
          │                       │
          ▼                       ▼
┌─────────────────────┐  ┌─────────────────────┐
│  ENVIAR EMAIL       │  │  NO ENVIAR EMAIL    │
│  Via Gmail          │  │  Solo guardar en    │
│  Asunto: "Tu        │  │  Redis              │
│  informe vocacional │  │                     │
│  está listo"        │  │                     │
└─────────────────────┘  └─────────────────────┘
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
          ┌─────────────────────────┐
          │  RESPONDER ÉXITO        │
          │  { success: true }      │
          └─────────────────────────┘


## 🎯 Estados de Sesión

┌─────────────────────────────────────────────────────────┐
│  ESTADOS POSIBLES:                                      │
│                                                         │
│  1. chatting: Usuario en conversación activa           │
│     • Recibe preguntas del agente                      │
│     • Responde a cada pregunta                         │
│     • Se acumulan puntuaciones RIASEC                  │
│                                                         │
│  2. awaiting_email: Test completo, esperando email     │
│     • Se activa cuando questionCount >= 25             │
│     • El usuario debe enviar su email                  │
│     • No se aceptan más preguntas                      │
│                                                         │
│  3. complete: Informe generado y enviado               │
│     • Email validado y guardado                        │
│     • Informe generado via workflow de análisis        │
│     • Resultado disponible en Redis                    │
│     • El frontend puede hacer polling                  │
└─────────────────────────────────────────────────────────┘


## 📊 Formato de Datos en Redis

┌─────────────────────────────────────────────────────────┐
│  CLAVES EN REDIS:                                       │
│                                                         │
│  voc:session:{sessionId}                                │
│  • Almacena estado completo de la sesión               │
│  • Estructura JSON con todos los datos                 │
│  • TTL: 7200s (2h) para chatting                       │
│  • TTL: 86400s (24h) para awaiting_email/complete      │
│                                                         │
│  voc:agent:{sessionId}                                  │
│  • Memoria del agente de IA                            │
│  • Manejada por el nodo Redis Chat Memory              │
│  • TTL: automático según configuración                 │
│                                                         │
│  voc:result:{sessionId}                                 │
│  • Resultado final del análisis RIASEC                 │
│  • VocTestResult completo                              │
│  • TTL: 86400s (24 horas)                              │
│  • Usado por polling de status                         │
└─────────────────────────────────────────────────────────┘


## 🔐 Flujo de Pago (Integración con NestJS)

┌─────────────────────────────────────────────────────────┐
│  FLUJO DE PAGO EN EL FRONTEND:                          │
│                                                         │
│  1. Usuario envía 3 mensajes (gratis)                  │
│  2. Backend NestJS cuenta questionCount                │
│  3. Al 4to mensaje:                                    │
│     • Backend verifica si hay pago aprobado            │
│     • Si no hay pago: retorna 403 PAYMENT_REQUIRED    │
│     • Frontend abre modal de pago (MercadoPago)       │
│  4. Usuario paga:                                      │
│     • Webhook de MP actualiza DB                       │
│     • Frontend hace polling hasta confirmar pago      │
│  5. Usuario continúa chateando (sin límite)           │
│  6. Cuando testCompleto: true → polling de status     │
│                                                         │
│  NOTA: El workflow de n8n NO maneja pagos,            │
│  eso lo hace NestJS. n8n solo procesa la conversación│
└─────────────────────────────────────────────────────────┘
