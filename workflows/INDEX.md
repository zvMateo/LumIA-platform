# 📚 Índice de Archivos - VocTest IA Workflows n8n

## 🗂️ Estructura de la Carpeta `workflows/`

```
workflows/
├── 📄 ARCHIVOS DE WORKFLOW (para importar en n8n)
│   ├── 01-orquestador-principal.json
│   ├── 02-chat-conversacional.json
│   └── 03-analisis-informe.json
│
├── 📋 DOCUMENTACIÓN
│   ├── README.md                    ← Guía principal de configuración
│   ├── DIAGRAM.md                   ← Diagramas de flujo detallados
│   ├── CHECKLIST.md                 ← Checklist de implementación
│   └── CHANGELOG.md                 ← Notas de versión
│
├── ⚙️ CONFIGURACIÓN
│   ├── env.example                  ← Variables de entorno documentadas
│   ├── credentials-template.json    ← Plantilla de credenciales para n8n
│   └── package.json                 ← Dependencias y scripts
│
├── 🧪 SCRIPTS DE PRUEBA
│   ├── test-workflows.sh            ← Script para probar workflows
│   └── validate-workflows.py        ← Validador de JSONs
│
└── 📖 ESTE ARCHIVO
    └── INDEX.md                     ← Estás aquí
```

## 📄 Archivos de Workflow

### `01-orquestador-principal.json`
**Propósito**: Punto de entrada principal para todas las peticiones
**Cómo usar**:
1. Importar en n8n
2. Activar el workflow
3. La URL será: `https://tu-instancia.com/webhook/voctest/chat`
**Funcionalidades**:
- Diferencia entre `checkStatus: true/false`
- Redirige a workflows de chat o análisis
- Maneja consultas de estado

### `02-chat-conversacional.json`
**Propósito**: Procesa la conversación del test vocacional
**Cómo usar**:
1. Importar en n8n después del orquestador
2. Activar el workflow
3. Actualizar URL en el nodo `[HTTP] Llamar Workflow Chat` del orquestador
**Funcionalidades**:
- Manejo de sesiones nuevas/existentes
- Agente conversacional con memoria Redis
- Validación de email
- Generación de informes

### `03-analisis-informe.json`
**Propósito**: Genera el informe RIASEC completo
**Cómo usar**:
1. Importar en n8n
2. Activar el workflow
3. Actualizar URL en el nodo `[HTTP] Llamar análisis` del chat
**Funcionalidades**:
- Análisis RIASEC con OpenAI
- Generación de HTML para email
- Envío de email vía Gmail
- Almacenamiento en Redis

## 📋 Documentación

### `README.md`
**Propósito**: Guía principal de configuración y uso
**Qué encontrarás**:
- URLs de webhook para el frontend
- Configuración de workflows en n8n
- Credenciales necesarias
- Flujo de trabajo completo
- Respuestas esperadas
- Instrucciones de despliegue

### `DIAGRAM.md`
**Propósito**: Diagramas de flujo visuales
**Qué encontrarás**:
- Diagrama de flujo principal
- Flujo del workflow de chat
- Flujo del workflow de análisis
- Estados de sesión
- Formato de datos en Redis
- Flujo de pago integrado

### `CHECKLIST.md`
**Propósito**: Lista de verificación antes de producción
**Qué encontrarás**:
- Verificación de archivos y workflows
- Configuración de credenciales
- Pruebas de flujo
- Seguridad
- Monitoreo
- Post-implementación

### `CHANGELOG.md`
**Propósito**: Historial de cambios y versiones
**Qué encontrarás**:
- Nuevas características
- Mejoras técnicas
- Bugs corregidos
- Mejoras de performance
- Roadmap futuro

## ⚙️ Configuración

### `env.example`
**Propósito**: Variables de entorno documentadas
**Cómo usar**:
1. Copiar a `.env`: `cp env.example .env`
2. Completar con tus valores
3. Usar para configurar n8n

### `credentials-template.json`
**Propósito**: Plantilla de credenciales para n8n
**Cómo usar**:
1. Usar como referencia para configurar credenciales
2. Los IDs están predefinidos en los workflows
3. Configurar en n8n UI con estos IDs

### `package.json`
**Propósito**: Configuración de dependencias y scripts
**Cómo usar**:
1. `npm install` para instalar dependencias
2. `npm test` para ejecutar pruebas
3. `npm run validate` para validar JSONs

## 🧪 Scripts de Prueba

### `test-workflows.sh`
**Propósito**: Probar workflows desde línea de comandos
**Cómo usar**:
```bash
./test-workflows.sh [sessionId]
```
**Qué hace**:
1. Crea una sesión de prueba
2. Envía mensajes de ejemplo
3. Muestra respuestas del agente
4. Verifica estado del test

### `validate-workflows.py`
**Propósito**: Validar que los JSONs sean correctos
**Cómo usar**:
```bash
python3 validate-workflows.py
```
**Qué hace**:
1. Verifica JSON válido
2. Revisa estructura de workflows
3. Valida conexiones entre nodos
4. Muestra estadísticas

## 🚀 Guía Rápida de Inicio

### Paso 1: Importar Workflows
1. Abrir n8n en tu navegador
2. Ir a Workflows → Importar
3. Importar en orden: `01`, `02`, `03`
4. Activar cada workflow

### Paso 2: Configurar Credenciales
1. Ir a Credentials en n8n
2. Crear credencial Redis: `Redis_GoodApps`
3. Crear credencial OpenAI: `OpenAi GoodApps`
4. Crear credencial Gmail: `Gmail account`

### Paso 3: Configurar URLs
1. Copiar URL del webhook principal
2. Actualizar variable en tu backend NestJS
3. Probar con curl o Postman

### Paso 4: Probar
1. Ejecutar: `./test-workflows.sh`
2. Revisar respuestas
3. Verificar emails enviados
4. Confirmar resultados en Redis

## 🔧 Solución de Problemas

### Problema: Workflows no se importan
**Solución**:
```bash
python3 validate-workflows.py
```
Si hay errores, corregirlos antes de importar.

### Problema: Redis no conecta
**Solución**:
1. Verificar que Redis esté corriendo: `redis-cli ping`
2. Revisar credenciales en n8n
3. Probar conexión desde n8n UI

### Problema: OpenAI no responde
**Solución**:
1. Verificar API key en credenciales OpenAI
2. Revisar límites de cuenta en OpenAI
3. Probar con modelo más simple (gpt-3.5-turbo)

### Problema: Gmail no envía emails
**Solución**:
1. Verificar OAuth2 en Google Cloud Console
2. Revisar permisos de Gmail API
3. Probar envío manual desde n8n

## 📞 Soporte

### Recursos Adicionales
- **Documentación n8n**: https://docs.n8n.io
- **Foro n8n**: https://community.n8n.io
- **Ejemplos de workflows**: https://n8n.io/workflows

### Contacto
- **Email**: soporte@voc-test-ia.com
- **Horario**: Lunes a Viernes, 9-18h (GMT-3)

---

## 🎯 Resumen Ejecutivo

**¿Qué es esto?**  
Un conjunto completo de workflows n8n para un test vocacional con IA.

**¿Qué incluye?**
- 3 workflows modulares
- Documentación completa
- Scripts de prueba
- Plantillas de configuración

**¿Cómo se usa?**
1. Importar en n8n
2. Configurar credenciales
3. Activar workflows
4. Conectar con tu frontend

**¿Qué hace único?**
- Arquitectura modular escalable
- Agente conversacional con memoria
- Generación automática de informes
- Envío de emails profesionales
- Sistema de estados robusto

---

**Creado por**: VocTest IA Team  
**Fecha**: 30 de marzo de 2026  
**Versión**: 1.0.0  
**Licencia**: MIT
