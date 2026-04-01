# 🚀 Resumen Ejecutivo - VocTest IA Workflows n8n

## 📦 ¿Qué tienes?

**3 Workflows Completos** para un test vocacional con IA:
1. **Orquestador Principal** - Punto de entrada
2. **Chat Conversacional** - Procesa conversaciones
3. **Análisis e Informe** - Genera informes y envía emails

## 🎯 ¿Qué hace?

- **Conversación inteligente**: Agente de IA que hace 25 preguntas
- **Análisis RIASEC**: Genera perfil vocacional completo
- **Envío de emails**: Informe profesional en HTML
- **Integración fácil**: Una sola URL para todo

## 📊 URL Principal para tu Frontend

```
POST https://gmn8nwebhook.goodapps.space/webhook/voctest/chat
```

## 🔄 Flujo Simplificado

```
1. Usuario envía mensaje → checkStatus: false
2. Agente responde → testCompleto: false
3. ... (25 preguntas)
4. Agente pide email → phase: "COMPLETE"
5. Usuario envía email → testCompleto: true
6. Frontend hace polling → checkStatus: true
7. Cuando listo → ready: true con datos completos
```

## ⚡ Configuración Rápida (5 minutos)

### Paso 1: Importar Workflows
1. Abrir n8n
2. Workflows → Importar
3. Importar en orden: `01`, `02`, `03`

### Paso 2: Configurar Credenciales
1. **Redis**: Host, puerto, contraseña
2. **OpenAI**: API key (sk-...)
3. **Gmail**: OAuth2 configurado

### Paso 3: Activar
1. Activar cada workflow (switch azul)
2. Copiar URL del webhook principal
3. Configurar en tu backend NestJS

## 📋 Respuestas que Recibirás

### Durante el Chat:
```json
{
  "message": "Respuesta del agente",
  "phase": "EXPLORING",
  "questionCount": 12,
  "sessionId": "uuid",
  "testCompleto": false,
  "processing": false
}
```

### Cuando Pide Email:
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

### Cuando el Informe Está Listo:
```json
{
  "ready": true,
  "sessionId": "uuid",
  "hollandCode": "ASI",
  "perfilTitulo": "Perfil Artístico-Social-Investigador",
  "carreras": [...],
  "riasecScores": {...}
}
```

## 🛠️ Archivos Incluidos

| Archivo | Propósito |
|---------|-----------|
| `01-orquestador-principal.json` | Workflow principal |
| `02-chat-conversacional.json` | Procesa conversación |
| `03-analisis-informe.json` | Genera informe |
| `README.md` | Guía completa |
| `DIAGRAM.md` | Diagramas de flujo |
| `CHECKLIST.md` | Lista de verificación |
| `FRONTEND-INTEGRATION.md` | Integración con Next.js |
| `env.example` | Variables de entorno |
| `test-workflows.sh` | Script de pruebas |

## 🧪 Probar Rápido

```bash
# Ejecutar script de prueba
./test-workflows.sh

# O probar manualmente
curl -X POST "https://gmn8nwebhook.goodapps.space/webhook/voctest/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "message": "Hola",
    "checkStatus": false,
    "plan": "b2c",
    "userId": null,
    "tenantId": null,
    "email": null,
    "userName": "Usuario Test"
  }'
```

## 🔧 Solución Rápida de Problemas

### Workflows no se importan:
```bash
python3 validate-workflows.py
```

### Redis no conecta:
```bash
redis-cli ping  # Debería responder PONG
```

### OpenAI no responde:
- Verificar API key en credenciales
- Revisar límites de cuenta

### Gmail no envía:
- Verificar OAuth2 en Google Cloud Console
- Revisar permisos de Gmail API

## 📈 Beneficios

1. **Arquitectura modular**: Fácil de mantener y escalar
2. **Agente inteligente**: Conversación natural y personalizada
3. **Informes profesionales**: HTML responsive y atractivo
4. **Integración simple**: Una URL para todo
5. **Documentación completa**: Guías y diagramas incluidos

## 🚨 Precauciones

1. **Costos OpenAI**: Monitorear uso de API
2. **Límites Redis**: Configurar límites de memoria
3. **Rate limiting**: Controlar peticiones por usuario
4. **Backup regular**: Guardar workflows y datos

## 📞 Soporte

### Recursos:
- **Documentación**: `README.md`
- **Diagramas**: `DIAGRAM.md`
- **Checklist**: `CHECKLIST.md`
- **Frontend**: `FRONTEND-INTEGRATION.md`

### Contacto:
- **Email**: soporte@voc-test-ia.com
- **Respuesta**: 24 horas hábiles

## ✅ Próximos Pasos

1. **Importar workflows** en n8n
2. **Configurar credenciales** (Redis, OpenAI, Gmail)
3. **Activar workflows**
4. **Probar flujo completo**
5. **Integrar con frontend**
6. **Monitorear producción**

---

**¡Listo para usar!** 🎉

**Versión**: 1.0.0  
**Fecha**: 30 de marzo de 2026  
**Creado por**: VocTest IA Team
