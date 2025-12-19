#!/bin/bash
# Script para iniciar frontend con PM2

PROJECT_DIR="/opt/Uniacc-dashboard-admision"

cd "$PROJECT_DIR"

# Verificar que está compilado
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo "❌ Error: El frontend no está compilado. Ejecuta: ./scripts/build.sh"
    exit 1
fi

echo "🚀 Iniciando frontend con PM2..."
pm2 serve dist 4173 --name uniacc-frontend --spa

echo ""
echo "✅ Frontend iniciado con PM2"
echo "   URL: http://localhost:4173"
echo ""
echo "Comandos útiles:"
echo "  pm2 list                    → Ver procesos"
echo "  pm2 logs uniacc-frontend     → Ver logs"
echo "  pm2 stop uniacc-frontend     → Detener"
echo "  pm2 restart uniacc-frontend  → Reiniciar"
