#!/bin/bash
# Script para instalar interfaz web de PM2

echo "🌐 Instalando interfaz web para PM2..."
echo ""

# Opción 1: PM2 Web (local)
echo "📦 Instalando pm2-web..."
npm install -g pm2-web

echo ""
echo "✅ PM2 Web instalado"
echo ""
echo "Para iniciar la interfaz web:"
echo "  pm2-web"
echo ""
echo "Luego accede a: http://localhost:9615"
echo ""
echo "Para iniciar en background:"
echo "  pm2-web &"
