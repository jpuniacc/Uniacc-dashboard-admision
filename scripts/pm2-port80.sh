#!/bin/bash
# Script para iniciar frontend en puerto 80 (requiere root)

echo "⚠️  ADVERTENCIA: Esto requiere permisos root"
echo "   El puerto 80 requiere privilegios de administrador"
echo ""

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Este script debe ejecutarse con sudo"
    echo "   Uso: sudo ./scripts/pm2-port80.sh"
    exit 1
fi

PROJECT_DIR="/opt/Uniacc-dashboard-admision"

cd "$PROJECT_DIR"

# Detener frontend actual
pm2 stop uniacc-frontend 2>/dev/null
pm2 delete uniacc-frontend 2>/dev/null

# Iniciar en puerto 80
echo "🚀 Iniciando frontend en puerto 80..."
pm2 serve dist 80 --name uniacc-frontend --spa

echo ""
echo "✅ Frontend iniciado en puerto 80"
echo "   URL: http://$(hostname -I | awk '{print $1}')"
echo "   O: http://localhost"

