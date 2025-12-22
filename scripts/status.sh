#!/bin/bash
# Script para verificar el estado del proyecto

PROJECT_DIR="/opt/Uniacc-dashboard-admision"
PID_FILE="$PROJECT_DIR/backend.pid"

echo "📊 Estado del Proyecto UNIACC Dashboard"
echo "======================================"
echo ""

# Verificar Backend
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ Backend: Corriendo (PID: $PID)"
        # Verificar health endpoint
        if curl -s http://172.16.0.206:3001/api/health > /dev/null 2>&1; then
            echo "   Health check: ✅ OK"
        else
            echo "   Health check: ⚠️  No responde"
        fi
    else
        echo "❌ Backend: No está corriendo (PID file existe pero proceso no)"
    fi
else
    echo "❌ Backend: No está corriendo"
fi

echo ""
echo "📁 Archivos compilados:"
[ -f "$PROJECT_DIR/backend/dist/index.js" ] && echo "   ✅ Backend compilado" || echo "   ❌ Backend no compilado"
[ -d "$PROJECT_DIR/dist" ] && echo "   ✅ Frontend compilado" || echo "   ❌ Frontend no compilado"

echo ""
echo "💾 Recursos:"
ps aux | grep "[n]ode.*dist/index.js" | awk '{print "   CPU: "$3"% | RAM: "$4"% | PID: "$2}'

echo ""
echo "🌐 Puertos:"
netstat -tuln 2>/dev/null | grep :3001 && echo "   ✅ Puerto 3001 en uso" || echo "   ❌ Puerto 3001 no en uso"
