# 🔍 Índice de Búsqueda Rápida

## 📑 Por Tipo de Contenido

### 🔧 Configuración
| Buscar | Archivo | Línea | Descripción |
|--------|---------|-------|-------------|
| `Redis` | `env.example` | 10-25 | Configuración Redis |
| `OpenAI` | `env.example` | 30-45 | Configuración OpenAI |
| `Gmail` | `env.example` | 50-65 | Configuración Gmail |
| `credenciales` | `credentials-template.json` | 1-50 | Plantilla de credenciales |

### 📊 Respuestas
| Buscar | Archivo | Línea | Descripción |
|--------|---------|-------|-------------|
| `ChatResponse` | `README.md` | 50-70 | Formato de respuesta de chat |
| `VocTestResult` | `README.md` | 80-120 | Formato de resultado completo |
| `VocTestPending` | `README.md` | 130-140 | Formato de resultado pendiente |

### 🔄 Flujos
| Buscar | Archivo | Línea | Descripción |
|--------|---------|-------|-------------|
| `flujo principal` | `DIAGRAM.md` | 10-50 | Diagrama de flujo principal |
| `flujo chat` | `DIAGRAM.md` | 60-100 | Flujo del workflow de chat |
| `flujo análisis` | `DIAGRAM.md` | 110-150 | Flujo del workflow de análisis |
| `estados` | `DIAGRAM.md` | 160-200 | Estados de sesión |

### 🧪 Pruebas
| Buscar | Archivo | Línea | Descripción |
|--------|---------|-------|-------------|
| `test` | `test-workflows.sh` | 1-50 | Script de prueba |
| `validar` | `validate-workflows.py` | 1-50 | Script de validación |
| `checklist` | `CHECKLIST.md` | 1-100 | Lista de verificación |

## 🎯 Preguntas Frecuentes

### ¿Cómo inicio el test?
```
Enviar POST a: https://gmn8nwebhook.goodapps.space/webhook/voctest/chat
Con body: { "message": "Hola", "checkStatus": false, ... }
```

### ¿Cómo sé si el test está completo?
```
testCompleto: true en la respuesta
```

### ¿Cómo obtengo el resultado?
```
Enviar POST con checkStatus: true
Cuando ready: true, tendrás todos los datos
```

### ¿Qué pasa si el email es inválido?
```
El agente pedirá de nuevo con mensaje amable
```

### ¿Cuántas preguntas hay?
```
25 preguntas máximo
```

## 📊 Formatos de Respuesta

### Chat en Progreso:
```json
{
  "message": "string",
  "phase": "WELCOME|EXPLORING|COMPLETE",
  "questionCount": 0-25,
  "sessionId": "uuid",
  "testCompleto": false,
  "processing": false
}
```

### Pidiendo Email:
```json
{
  "message": "¿A qué correo enviamos tu informe?",
  "phase": "COMPLETE",
  "questionCount": 25,
  "sessionId": "uuid",
  "testCompleto": false,
  "processing": false
}
```

### Resultado Listo:
```json
{
  "ready": true,
  "sessionId": "uuid",
  "hollandCode": "ASI",
  "perfilTitulo": "string",
  "carreras": [...]
}
```

## 🛠️ Comandos Útiles

### Probar workflows:
```bash
./test-workflows.sh [sessionId]
```

### Validar JSONs:
```bash
python3 validate-workflows.py
```

### Verificar Redis:
```bash
redis-cli ping
```

### Ver logs de n8n:
```bash
docker logs n8n
```

## 📁 Estructura de Archivos

```
workflows/
├── 01-orquestador-principal.json  ← Webhook principal
├── 02-chat-conversacional.json    ← Procesa conversación
├── 03-analisis-informe.json       ← Genera informe
├── README.md                      ← Guía principal
├── DIAGRAM.md                     ← Diagramas de flujo
├── CHECKLIST.md                   ← Lista de verificación
├── QUICKSTART.md                  ← Guía rápida
├── FRONTEND-INTEGRATION.md        ← Integración frontend
├── env.example                    ← Variables de entorno
├── credentials-template.json      ← Plantilla credenciales
├── test-workflows.sh              ← Script de pruebas
└── validate-workflows.py          ← Validador JSONs
```

## 🔗 URLs Importantes

### Webhooks:
- **Principal**: `https://gmn8nwebhook.goodapps.space/webhook/voctest/chat`
- **Chat Handler**: `https://gmn8nwebhook.goodapps.space/webhook/voctest/chat-handler`
- **Análisis**: `https://gmn8nwebhook.goodapps.space/webhook/voctest/analysis`

### Documentación:
- **README**: [./README.md](./README.md)
- **Diagramas**: [./DIAGRAM.md](./DIAGRAM.md)
- **Checklist**: [./CHECKLIST.md](./CHECKLIST.md)

## 🚨 Solución Rápida de Problemas

### Workflows no se importan:
```bash
python3 validate-workflows.py  # Revisa errores
```

### Redis no conecta:
```bash
redis-cli ping  # Debería responder PONG
```

### OpenAI no responde:
1. Verificar API key
2. Revisar límites de cuenta
3. Probar con curl simple

### Gmail no envía:
1. Verificar OAuth2
2. Revisar permisos Gmail API
3. Probar envío manual

## 📈 Métricas Clave

### Performance:
- **Redis TTL**: 2h activas, 24h completas
- **Timeout OpenAI**: 45 segundos
- **Timeout HTTP**: 30 segundos
- **Polling interval**: 3 segundos

### Límites:
- **Preguntas**: 25 máximo
- **Mensajes en historial**: 30 máximo
- **Tamaño de sesión**: 10KB máximo

## 🎨 Ejemplos de Uso

### Primer mensaje:
```json
{
  "sessionId": "uuid-123",
  "message": "Hola, quiero hacer el test",
  "checkStatus": false,
  "plan": "b2c",
  "userId": null,
  "tenantId": null,
  "email": null,
  "userName": "Usuario"
}
```

### Polling de resultado:
```json
{
  "sessionId": "uuid-123",
  "checkStatus": true
}
```

## ✅ Checklist Rápido

### Antes de Producción:
- [ ] Workflows importados y activados
- [ ] Credenciales configuradas
- [ ] URLs actualizadas
- [ ] Pruebas realizadas
- [ ] Documentación revisada

### Primeras 24 Horas:
- [ ] Monitorear logs
- [ ] Revisar métricas
- [ ] Verificar emails
- [ ] Confirmar resultados

## 🔄 Actualizaciones

### Versión Actual: 1.0.0
- [x] Arquitectura modular
- [x] Agente conversacional
- [x] Generación de informes
- [x] Envío de emails

### Próxima Versión: 1.1.0
- [ ] Soporte multiidioma
- [ ] Personalización por tenant
- [ ] Dashboard de métricas
- [ ] Webhook MercadoPago

---

**¿No encuentras lo que buscas?**  
Revisa `README.md` para información completa.

**¿Necesitas ayuda?**  
Contacta: soporte@voc-test-ia.com

**Versión**: 1.0.0  
**Actualizado**: 30 de marzo de 2026
