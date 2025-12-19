#!/bin/bash
# Script para instalar PM2

echo "📦 Instalando PM2 globalmente..."
npm install -g pm2

echo "✅ PM2 instalado"
echo ""
echo "Para usar PM2:"
echo "  pm2 start ecosystem.config.js"
echo "  pm2 save"
echo "  pm2 startup"
