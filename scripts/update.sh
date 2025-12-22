#!/bin/bash
# Script de actualización completa

set -e

PROJECT_DIR="/opt/Uniacc-dashboard-admision"

cd "$PROJECT_DIR"

echo "🔄 Proceso de Actualización - UNIACC Dashboard"
echo "=============================================="
echo ""

# Paso 1: Detener servicios
echo "🛑 Paso 1: Deteniendo servicios..."
pm2 stop all || true
sleep 2

# Paso 2: Actualizar dependencias
echo ""
echo "📦 Paso 2: Actualizando dependencias..."
cd "$PROJECT_DIR/backend"
npm install
cd "$PROJECT_DIR"
npm install

# Paso 3: Compilar
echo ""
echo "🔨 Paso 3: Compilando proyecto..."
cd "$PROJECT_DIR"
./scripts/build.sh

# Paso 4: Reiniciar servicios
echo ""
echo "🚀 Paso 4: Reiniciando servicios..."
pm2 restart all || pm2 start ecosystem.config.cjs

# Verificar si frontend está corriendo
if ! pm2 list | grep -q "uniacc-frontend"; then
    echo "   Iniciando frontend..."
    pm2 serve dist 4173 --name uniacc-frontend --spa
fi

# Paso 5: Verificar
echo ""
echo "✅ Paso 5: Verificando estado..."
sleep 3
pm2 list

echo ""
echo "🎉 Actualización completada!"
echo ""
echo "📊 Ver logs: pm2 logs"
echo "📈 Monitor: pm2 monit"
echo "🌐 Backend: http://172.16.0.206:3001/api/health"
echo "🌐 Frontend: http://localhost:4173"
