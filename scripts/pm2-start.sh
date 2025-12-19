#!/bin/bash
# Script para iniciar con PM2

PROJECT_DIR="/opt/Uniacc-dashboard-admision"

cd "$PROJECT_DIR"

# Verificar que PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 no está instalado. Ejecuta: ./scripts/pm2-install.sh"
    exit 1
fi

# Verificar que está compilado
if [ ! -f "backend/dist/index.js" ]; then
    echo "❌ Error: El backend no está compilado. Ejecuta: ./scripts/build.sh"
    exit 1
fi

echo "🚀 Iniciando backend con PM2..."
pm2 start ecosystem.config.cjs

echo ""
echo "✅ Backend iniciado con PM2"
echo ""
echo "Comandos útiles:"
echo "  pm2 list              → Ver procesos"
echo "  pm2 logs uniacc-backend → Ver logs"
echo "  pm2 stop uniacc-backend → Detener"
echo "  pm2 restart uniacc-backend → Reiniciar"
echo "  pm2 monit             → Monitor en tiempo real"
echo "  pm2 save              → Guardar configuración"
echo "  pm2 startup           → Configurar inicio automático"
