#!/bin/bash
# Script para iniciar el backend

PROJECT_DIR="/opt/Uniacc-dashboard-admision"
BACKEND_DIR="$PROJECT_DIR/backend"
LOG_DIR="$PROJECT_DIR/logs"

cd "$BACKEND_DIR"

# Verificar que está compilado
if [ ! -f "dist/index.js" ]; then
    echo "❌ Error: El backend no está compilado. Ejecuta: ./scripts/build.sh"
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p "$LOG_DIR"

# Iniciar backend
echo "🚀 Iniciando backend..."
NODE_ENV=production node dist/index.js > "$LOG_DIR/backend.log" 2>&1 &
echo $! > "$PROJECT_DIR/backend.pid"
echo "✅ Backend iniciado (PID: $(cat $PROJECT_DIR/backend.pid))"
echo "📋 Logs: tail -f $LOG_DIR/backend.log"
