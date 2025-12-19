#!/bin/bash
# Script para detener el backend

PROJECT_DIR="/opt/Uniacc-dashboard-admision"
PID_FILE="$PROJECT_DIR/backend.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "✅ Backend detenido (PID: $PID)"
        rm "$PID_FILE"
    else
        echo "⚠️  Proceso no encontrado, limpiando PID file"
        rm "$PID_FILE"
    fi
else
    echo "⚠️  No se encontró PID file. Buscando proceso manualmente..."
    pkill -f "node.*dist/index.js" && echo "✅ Proceso detenido" || echo "❌ No se encontró proceso corriendo"
fi
