#!/bin/bash
# Script de prueba para VocTest IA - Workflows n8n
# Uso: ./test-workflows.sh [sessionId]

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
BASE_URL="https://gmn8nwebhook.goodapps.space/webhook/voctest/chat"
SESSION_ID=${1:-$(uuidgen | tr '[:upper:]' '[:lower:]')}

echo -e "${YELLOW}🧪 Probando Workflows de VocTest IA${NC}"
echo -e "${YELLOW}===================================${NC}"
echo -e "Session ID: ${SESSION_ID}"
echo -e "URL: ${BASE_URL}"
echo ""

# Función para hacer requests
make_request() {
  local endpoint=$1
  local payload=$2
  local description=$3
  
  echo -e "${YELLOW}📋 $description${NC}"
  echo -e "${YELLOW}Payload:${NC}"
  echo "$payload" | jq .
  
  response=$(curl -s -X POST "$endpoint" \
    -H "Content-Type: application/json" \
    -d "$payload")
  
  echo -e "${YELLOW}Response:${NC}"
  echo "$response" | jq .
  echo -e "${GREEN}✓ Completado${NC}"
  echo ""
}

# 1. Primer mensaje - Inicia sesión
echo -e "${GREEN}🚀 1. INICIANDO SESIÓN${NC}"
make_request "$BASE_URL" "{
  \"sessionId\": \"$SESSION_ID\",
  \"message\": \"Hola, quiero hacer el test vocacional\",
  \"checkStatus\": false,
  \"plan\": \"b2c\",
  \"userId\": null,
  \"tenantId\": null,
  \"email\": null,
  \"userName\": \"Usuario Test\"
}" "Primer mensaje - Crear sesión"

# 2. Segundo mensaje - Continúa conversación
echo -e "${GREEN}🗣 2. CONTINUANDO CONVERSACIÓN${NC}"
make_request "$BASE_URL" "{
  \"sessionId\": \"$SESSION_ID\",
  \"message\": \"Me gusta mucho la tecnología y programar\",
  \"checkStatus\": false,
  \"plan\": \"b2c\",
  \"userId\": null,
  \"tenantId\": null,
  \"email\": null,
  \"userName\": \"Usuario Test\"
}" "Segundo mensaje - Respuesta a agente"

# 3. Tercer mensaje - Continúa
echo -e "${GREEN}🗣 3. CONTINUANDO CONVERSACIÓN${NC}"
make_request "$BASE_URL" "{
  \"sessionId\": \"$SESSION_ID\",
  \"message\": \"También me gusta ayudar a las personas\",
  \"checkStatus\": false,
  \"plan\": \"b2c\",
  \"userId\": null,
  \"tenantId\": null,
  \"email\": null,
  \"userName\": \"Usuario Test\"
}" "Tercer mensaje - Respuesta a agente"

# 4. Verificar status (debería no estar listo)
echo -e "${BLUE}📊 4. VERIFICANDO STATUS (debería no estar listo)${NC}"
make_request "$BASE_URL" "{
  \"sessionId\": \"$SESSION_ID\",
  \"checkStatus\": true
}" "Check status - Debería retornar ready: false"

# 5. Continuar hasta llegar a email (simulamos enviando varios mensajes)
echo -e "${YELLOW}⏳ 5. SIMULANDO COMPLETAR TEST...${NC}"
echo "Para completar el test, necesitas responder 25 preguntas."
echo "En un test real, el agente irá haciendo preguntas hasta llegar a 25."
echo "Luego pedirá tu email para enviar el informe."
echo ""
echo -e "${GREEN}✓ Sesión creada exitosamente!${NC}"
echo -e "${GREEN}✓ Session ID: $SESSION_ID${NC}"
echo ""
echo -e "${YELLOW}📌 Para probar el flujo completo:${NC}"
echo "1. Usa este Session ID en tu frontend: $SESSION_ID"
echo "2. Conecta tu frontend a la URL: $BASE_URL"
echo "3. Continúa la conversación hasta completar las 25 preguntas"
echo "4. Cuando pida email, envía uno válido"
echo "5. Haz polling con checkStatus: true para obtener el informe"
echo ""
echo -e "${BLUE}🔧 Para testing manual:${NC}"
echo "curl -X POST \"$BASE_URL\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"sessionId\": \"$SESSION_ID\","
echo "    \"message\": \"Tu mensaje aquí\","
echo "    \"checkStatus\": false,"
echo "    \"plan\": \"b2c\","
echo "    \"userId\": null,"
echo "    \"tenantId\": null,"
echo "    \"email\": null,"
echo "    \"userName\": \"Usuario Test\""
echo "  }'"
