#!/bin/bash
# Script para detener los procesos de desarrollo
# Detiene backend (puerto 3002) y frontend (puerto 5174)

PROJECT_DIR="/opt/Uniacc-dashboard-admision"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Deteniendo servidores de desarrollo...${NC}"
echo ""

# Contador de procesos detenidos
STOPPED=0

# Detener Backend (puerto 3002)
echo -e "${YELLOW}📦 Deteniendo Backend (puerto 3002)...${NC}"
if command -v lsof &> /dev/null; then
    # Usar lsof si está disponible (más preciso)
    BACKEND_PIDS=$(lsof -ti:3002 2>/dev/null)
    if [ ! -z "$BACKEND_PIDS" ]; then
        echo "$BACKEND_PIDS" | xargs kill 2>/dev/null
        echo -e "${GREEN}✅ Backend detenido${NC}"
        STOPPED=$((STOPPED + 1))
    else
        echo "   ⚠️  No hay proceso corriendo en puerto 3002"
    fi
else
    # Fallback: buscar procesos tsx/npm relacionados con backend
    pkill -f "tsx.*backend.*src/index.ts" 2>/dev/null && {
        echo -e "${GREEN}✅ Backend detenido${NC}"
        STOPPED=$((STOPPED + 1))
    } || echo "   ⚠️  No se encontró proceso de backend"
fi

echo ""

# Detener Frontend (puerto 5174)
echo -e "${YELLOW}🌐 Deteniendo Frontend (puerto 5174)...${NC}"
if command -v lsof &> /dev/null; then
    # Usar lsof si está disponible (más preciso)
    FRONTEND_PIDS=$(lsof -ti:5174 2>/dev/null)
    if [ ! -z "$FRONTEND_PIDS" ]; then
        echo "$FRONTEND_PIDS" | xargs kill 2>/dev/null
        echo -e "${GREEN}✅ Frontend detenido${NC}"
        STOPPED=$((STOPPED + 1))
    else
        echo "   ⚠️  No hay proceso corriendo en puerto 5174"
    fi
else
    # Fallback: buscar procesos vite
    pkill -f "vite.*5174" 2>/dev/null && {
        echo -e "${GREEN}✅ Frontend detenido${NC}"
        STOPPED=$((STOPPED + 1))
    } || echo "   ⚠️  No se encontró proceso de frontend"
fi

echo ""

# Verificar si quedan procesos
sleep 1
REMAINING_BACKEND=$(lsof -ti:3002 2>/dev/null | wc -l)
REMAINING_FRONTEND=$(lsof -ti:5174 2>/dev/null | wc -l)

if [ "$REMAINING_BACKEND" -gt 0 ] || [ "$REMAINING_FRONTEND" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Algunos procesos no se detuvieron. Intentando forzar detención...${NC}"
    
    if [ "$REMAINING_BACKEND" -gt 0 ]; then
        lsof -ti:3002 2>/dev/null | xargs kill -9 2>/dev/null && echo -e "${GREEN}✅ Backend forzado a detenerse${NC}"
    fi
    
    if [ "$REMAINING_FRONTEND" -gt 0 ]; then
        lsof -ti:5174 2>/dev/null | xargs kill -9 2>/dev/null && echo -e "${GREEN}✅ Frontend forzado a detenerse${NC}"
    fi
fi

echo ""
if [ $STOPPED -gt 0 ]; then
    echo -e "${GREEN}✅ Servidores de desarrollo detenidos${NC}"
else
    echo -e "${YELLOW}ℹ️  No se encontraron servidores de desarrollo corriendo${NC}"
fi


