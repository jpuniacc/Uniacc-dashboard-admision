#!/bin/bash
# Script para levantar el sistema completo en modo desarrollo
# Backend en puerto 3002, Frontend en puerto 5174

PROJECT_DIR="/opt/Uniacc-dashboard-admision"
BACKEND_DIR="$PROJECT_DIR/backend"

cd "$PROJECT_DIR"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando sistema en modo DESARROLLO${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}Puertos configurados:${NC}"
echo "  Backend:  http://localhost:3002"
echo "  Frontend: http://localhost:5174"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo servidores...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    exit 0
}

# Capturar señales para limpiar procesos
trap cleanup SIGINT SIGTERM

# Iniciar Backend en puerto 3002 (en background)
echo -e "${GREEN}📦 Iniciando Backend (puerto 3002)...${NC}"
cd "$BACKEND_DIR"
PORT=3002 NODE_ENV=development npm run dev &
BACKEND_PID=$!
cd "$PROJECT_DIR"

# Esperar un momento para que el backend inicie
sleep 3

# Verificar que el backend esté corriendo
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ El backend no pudo iniciar correctamente${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
echo ""

# Iniciar Frontend en puerto 5174 (en foreground para ver logs)
echo -e "${GREEN}🌐 Iniciando Frontend (puerto 5174)...${NC}"
echo ""
echo -e "${BLUE}=========================================="
echo "✅ Sistema iniciado correctamente"
echo ""
echo "📊 Servicios:"
echo "   Backend:  http://localhost:3002/api/health"
echo "   Frontend: http://localhost:5174"
echo ""
echo "💡 El frontend mostrará logs en esta terminal"
echo "💡 Presiona Ctrl+C para detener ambos servidores"
echo "==========================================${NC}"
echo ""

# Ejecutar frontend en foreground (mostrará logs)
cd "$PROJECT_DIR"
VITE_API_URL=http://localhost:3002 npm run dev

# Si el frontend termina, limpiar backend también
cleanup

