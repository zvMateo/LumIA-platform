# ✅ Checklist de Importación en n8n

## 📋 Pre-Importación

### Requisitos Previos:
- [ ] n8n instalado y funcionando
- [ ] Redis disponible y accesible
- [ ] OpenAI API key válida
- [ ] Gmail OAuth2 configurado

### Archivos Necesarios:
- [ ] `01-orquestador-principal.json`
- [ ] `02-chat-conversacional.json`
- [ ] `03-analisis-informe.json`
- [ ] `credentials-template.json` (referencia)

### Validación:
```bash
# Ejecutar antes de importar
python3 validate-workflows.py
```

## 🔄 Paso 1: Importar Workflow Orquestador

### Instrucciones:
1. **Abrir n8n** en tu navegador
2. **Ir a Workflows** → **Importar**
3. **Seleccionar archivo**: `01-orquestador-principal.json`
4. **Verificar nombre**: "VocTest — Orquestador Principal"
5. **NO activar todavía**

### Verificar:
- [ ] El workflow se importó sin errores
- [ ] Tiene 5 nodos visibles
- [ ] El webhook está configurado
- [ ] Las credenciales muestran "Missing"

### Configurar:
- [ ] Actualizar URL en nodo `[HTTP] Llamar Workflow Chat`:
  ```
  https://gmn8nwebhook.goodapps.space/webhook/voctest/chat-handler
  ```

## 🔄 Paso 2: Importar Workflow Chat

### Instrucciones:
1. **Ir a Workflows** → **Importar**
2. **Seleccionar archivo**: `02-chat-conversacional.json`
3. **Verificar nombre**: "VocTest — Chat Conversacional"
4. **NO activar todavía**

### Verificar:
- [ ] El workflow se importó sin errores
- [ ] Tiene 12 nodos visibles
- [ ] El webhook está configurado
- [ ] Las credenciales muestran "Missing"

### Configurar:
- [ ] Actualizar URL en nodo `[HTTP] Llamar análisis`:
  ```
  https://gmn8nwebhook.goodapps.space/webhook/voctest/analysis
  ```

## 🔄 Paso 3: Importar Workflow Análisis

### Instrucciones:
1. **Ir a Workflows** → **Importar**
2. **Seleccionar archivo**: `03-analisis-informe.json`
3. **Verificar nombre**: "VocTest — Análisis e Informe"
4. **NO activar todavía**

### Verificar:
- [ ] El workflow se importó sin errores
- [ ] Tiene 8 nodos visibles
- [ ] El webhook está configurado
- [ ] Las credenciales muestran "Missing"

## 🔧 Paso 4: Configurar Credenciales

### Redis (kC0Bfi0yQOAqlL1I):
1. **Ir a Credentials** → **Add Credential**
2. **Buscar**: "Redis"
3. **Nombre**: `Redis_GoodApps` (exacto)
4. **Configurar**:
   - Host: `redis://localhost:6379` (o tu instancia)
   - Port: `6379`
   - Database: `0`
   - Password: (si tiene)
5. **Probar conexión**: "Test connection"
6. **Guardar**

### OpenAI (LVIDq0T0z4cISnRM):
1. **Ir a Credentials** → **Add Credential**
2. **Buscar**: "OpenAI"
3. **Nombre**: `OpenAi GoodApps` (exacto)
4. **Configurar**:
   - API Key: `sk-tu-api-key-aquí`
   - Organization: (opcional)
5. **Probar conexión**: "Test connection"
6. **Guardar**

### Gmail OAuth2 (OiZEeFUODmvbFi12):
1. **Ir a Credentials** → **Add Credential**
2. **Buscar**: "Gmail OAuth2"
3. **Nombre**: `Gmail account` (exacto)
4. **Configurar**:
   - Client ID: desde Google Cloud Console
   - Client Secret: desde Google Cloud Console
   - Scope: `https://www.googleapis.com/auth/gmail.send`
5. **Autorizar**: "Sign in with Google"
6. **Guardar**

## 🔗 Paso 5: Conectar Credenciales

### En Workflow Orquestador:
- [ ] Seleccionar cada nodo que requiere credenciales
- [ ] En "Credential to connect with", seleccionar la credencial correcta
- [ ] Verificar que no muestra "Missing"

### En Workflow Chat:
- [ ] `[Redis] GET Sesión` → `Redis_GoodApps`
- [ ] `[Redis] SET Sesión continua` → `Redis_GoodApps`
- [ ] `[Redis] SET Sesión completa` → `Redis_GoodApps`
- [ ] `[AI Agent] Entrevistador RIASEC` → `OpenAi GoodApps`
- [ ] `Redis Chat Memory` → `Redis_GoodApps`

### En Workflow Análisis:
- [ ] `[Redis] SET Resultado` → `Redis_GoodApps`
- [ ] `[HTTP] OpenAI analizador` → `OpenAi GoodApps`
- [ ] `[Gmail] Enviar informe` → `Gmail account`

## 🚀 Paso 6: Activar Workflows

### Orden de Activación:
1. **Primero**: Workflow Análisis (03)
2. **Segundo**: Workflow Chat (02)
3. **Tercero**: Workflow Orquestador (01)

### Verificar:
- [ ] Cada workflow tiene el switch azul activado
- [ ] No hay errores de validación
- [ ] Los webhooks muestran URLs públicas

## 🧪 Paso 7: Probar

### Test Básico:
```bash
# Ejecutar script de prueba
./test-workflows.sh

# O probar manualmente
curl -X POST "https://gmn8nwebhook.goodapps.space/webhook/voctest/chat" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","message":"Hola","checkStatus":false,"plan":"b2c"}'
```

### Verificar Respuestas:
- [ ] Primer mensaje retorna bienvenida
- [ ] Contador de preguntas incrementa
- [ ] Al completar 25 preguntas, pide email
- [ ] Email válido genera testCompleto: true
- [ ] Polling retorna ready: true cuando listo

## 📊 Paso 8: Monitorear

### Logs:
- [ ] Ir a **Settings** → **Logs** en n8n
- [ ] Filtrar por workflows VocTest
- [ ] Verificar que no hay errores

### Métricas:
- [ ] Redis: `redis-cli info memory`
- [ ] n8n: Ver métricas en dashboard
- [ ] OpenAI: Revisar usage en platform.openai.com

## 🔧 Solución de Problemas

### Workflows no se activan:
1. Verificar credenciales configuradas
2. Revisar URLs de webhooks
3. Comprobar logs de n8n

### Redis no conecta:
1. Verificar que Redis esté corriendo
2. Probar conexión: `redis-cli ping`
3. Revisar credenciales en n8n

### OpenAI no responde:
1. Verificar API key
2. Revisar límites de cuenta
3. Probar con modelo más simple

### Gmail no envía:
1. Verificar OAuth2 configurado
2. Revisar permisos de Gmail API
3. Probar envío manual desde n8n

## ✅ Checklist Final

### Importación Completa:
- [ ] 3 workflows importados
- [ ] 3 credenciales configuradas
- [ ] URLs actualizadas en nodos HTTP
- [ ] Credenciales conectadas a nodos
- [ ] Workflows activados en orden

### Pruebas Completas:
- [ ] Flujo básico funciona
- [ ] Contador de preguntas correcto
- [ ] Validación de email funciona
- [ ] Generación de informes funciona
- [ ] Envío de emails funciona
- [ ] Polling de status funciona

### Monitoreo Configurado:
- [ ] Logs habilitados
- [ ] Alertas configuradas
- [ ] Backup de workflows
- [ ] Documentación accesible

### Producción Lista:
- [ ] URLs de producción configuradas
- [ ] SSL/TLS configurado
- [ ] Rate limiting considerado
- [ ] Backup regular programado

---

## 🚨 Errores Comunes

### Error: "Credential not found"
**Solución**: Configurar credenciales con los nombres exactos

### Error: "Webhook not found"
**Solución**: Verificar que workflows están activados

### Error: "Redis connection failed"
**Solución**: Verificar Redis corriendo y credenciales correctas

### Error: "OpenAI rate limit"
**Solución**: Revisar límites de cuenta y espaciar requests

---

## 📞 Soporte

### Recursos:
- **Documentación completa**: `README.md`
- **Diagramas de flujo**: `DIAGRAM.md`
- **Guía rápida**: `QUICKSTART.md`

### Contacto:
- **Email**: soporte@voc-test-ia.com
- **Respuesta**: 24 horas hábiles

---

**¡Importación completada!** 🎉

**Siguiente**: Integrar con tu frontend usando `FRONTEND-INTEGRATION.md`

**Versión**: 1.0.0  
**Última actualización**: 30 de marzo de 2026
