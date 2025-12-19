#!/bin/bash
# Script para detener con PM2

echo "🛑 Deteniendo backend con PM2..."
pm2 stop uniacc-backend
pm2 delete uniacc-backend 2>/dev/null || true
echo "✅ Backend detenido"
