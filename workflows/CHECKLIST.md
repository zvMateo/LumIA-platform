# ✅ Checklist de Implementación - VocTest IA

Antes de pasar a producción, verifica cada punto de esta lista.

## 📁 Archivos y Workflows

### Workflows n8n:
- [ ] `01-orquestador-principal.json` importado
- [ ] `02-chat-conversacional.json` importado
- [ ] `03-analisis-informe.json` importado
- [ ] Workflows activados en n8n (switch azul en cada workflow)
- [ ] URLs de webhook actualizadas según tu instancia

### Documentación:
- [ ] `README.md` leído y comprendido
- [ ] `DIAGRAM.md` revisado para entender el flujo
- [ ] `env.example` copiado a `.env` y configurado
- [ ] `credentials-template.json` usado como referencia

## 🔧 Configuración de Credenciales

### Redis:
- [ ] Credencial `Redis_GoodApps` creada
- [ ] Host configurado correctamente
- [ ] Puerto configurado (default: 6379)
- [ ] Base de datos configurada (default: 0)
- [ ] Contraseña configurada (si es necesario)
- [ ] Conexión a Redis probada desde n8n

### OpenAI:
- [ ] Credencial `OpenAi GoodApps` creada
- [ ] API Key de OpenAI configurada (empieza con sk-)
- [ ] Límites de API verificados en tu cuenta OpenAI
- [ ] Modelo gpt-4o disponible en tu plan

### Gmail:
- [ ] Credencial `Gmail account` creada
- [ ] Gmail API habilitada en Google Cloud Console
- [ ] Credenciales OAuth 2.0 configuradas
- [ ] Dominio de n8n agregado en 'Authorized redirect URIs'
- [ ] Autorización OAuth completada con éxito
- [ ] Email de prueba enviado correctamente

## 🔗 URLs y Webhooks

### URLs configuradas:
- [ ] Webhook principal: `https://tu-instancia.com/webhook/voctest/chat`
- [ ] Webhook chat handler: `https://tu-instancia.com/webhook/voctest/chat-handler`
- [ ] Webhook análisis: `https://tu-instancia.com/webhook/voctest/analysis`
- [ ] Nodos HTTP Request actualizados con las URLs correctas

### URLs para el Frontend NestJS:
- [ ] Backend configurado para usar webhook principal
- [ ] Variable de entorno `N8N_WEBHOOK_URL` configurada
- [ ] Timeout configurado a 30 segundos
- [ ] Retry logic implementado en el backend

## 🧪 Pruebas de Flujo

### Flujo Básico:
- [ ] Primer mensaje crea sesión correctamente
- [ ] Respuestas del agente son coherentes y en español
- [ ] Contador de preguntas incrementa correctamente
- [ ] Puntuaciones RIASEC se acumulan bien
- [ ] Historial se guarda en Redis

### Flujo de Email:
- [ ] Cuando se completan 25 preguntas, pide email
- [ ] Email inválido: pide de nuevo con mensaje amable
- [ ] Email válido: procesa y genera informe
- [ ] Email se envía correctamente a la dirección indicada
- [ ] HTML del informe se ve bien en clientes de email

### Flujo de Polling:
- [ ] `checkStatus: true` retorna resultado cuando está listo
- [ ] `checkStatus: true` retorna `ready: false` mientras procesa
- [ ] VocTestResult tiene todos los campos requeridos
- [ ] Resultado coincide con lo enviado por email

### Pruebas de Estrés:
- [ ] 5 sesiones simultáneas funcionan correctamente
- [ ] Redis maneja múltiples sesiones sin problemas
- [ ] OpenAI no excede límites de rate
- [ ] Gmail no excede límites de envío

## 🛡️ Seguridad

### Datos Sensibles:
- [ ] API keys no están hardcodeadas en los workflows
- [ ] Credenciales configuradas en n8n, no en código
- [ ] Redis protegido con contraseña
- [ ] Gmail OAuth2 configurado correctamente

### Validaciones:
- [ ] Email se valida con regex antes de procesar
- [ ] SessionId se valida que sea UUID válido
- [ ] Respuestas de OpenAI se parsean con try/catch
- [ ] Datos de sesión se validan antes de guardar

### Límites:
- [ ] TTL de sesiones configurado (2h activas, 24h completas)
- [ ] TTL de resultados configurado (24h)
- [ ] Límite de 25 preguntas por test
- [ ] Timeout de OpenAI configurado (45s)

## 📊 Monitoreo

### Logs:
- [ ] Logs de n8n habilitados
- [ ] Nivel de log configurado (error, warn, info, debug)
- [ ] Errores se registran correctamente
- [ ] Performance de OpenAI se puede monitorear

### Alertas:
- [ ] Alertas configuradas para errores de Redis
- [ ] Alertas configuradas para errores de OpenAI
- [ ] Alertas configuradas para errores de Gmail
- [ ] Dashboard de n8n monitoreado regularmente

## 🚀 Pre-Producción

### Últimas Verificaciones:
- [ ] Todos los workflows están activos
- [ ] URLs de webhook son accesibles públicamente
- [ ] SSL/TLS configurado correctamente
- [ ] DNS configurado si usas dominio personalizado
- [ ] Backup de workflows realizado
- [ ] Backup de Redis configurado

### Documentación:
- [ ] README actualizado con URLs de producción
- [ ] Variables de entorno documentadas
- [ ] Instrucciones de despliegue actualizadas
- [ ] Contacto de soporte disponible

### Comunicación:
- [ ] Equipo de desarrollo notificado
- [ ] Equipo de soporte capacitado
- [ ] Usuarios beta identificados para pruebas
- [ ] Plan de rollback documentado

## 🔄 Post-Implementación

### Primeras 24 Horas:
- [ ] Monitorear logs de errores
- [ ] Revisar métricas de uso
- [ ] Verificar que los emails se envían
- [ ] Confirmar que los resultados son correctos
- [ ] Recopilar feedback de usuarios beta

### Primera Semana:
- [ ] Analizar patrones de uso
- [ ] Optimizar prompts si es necesario
- [ ] Ajustar TTLs si hay problemas de memoria
- [ ] Revisar costos de OpenAI
- [ ] Planificar mejoras basadas en feedback

### Mantenimiento:
- [ ] Backup semanal de workflows
- [ ] Revisión mensual de credenciales
- [ ] Actualización de modelos OpenAI cuando haya nuevos
- [ ] Limpieza periódica de sesiones antiguas
- [ ] Documentación de cambios realizados

---

## 📞 Soporte Técnico

En caso de problemas:
1. Revisa los logs de n8n en `/settings/logs`
2. Verifica las credenciales en `/credentials`
3. Revisa el estado de Redis: `redis-cli ping`
4. Prueba los webhooks con curl o Postman
5. Consulta la documentación: `README.md` y `DIAGRAM.md`

---

**Última actualización:** 30 de marzo de 2026
**Versión:** 1.0.0
**Responsable:** VocTest IA Team
