#!/bin/bash
# Script para compilar el proyecto completo

set -e

PROJECT_DIR="/opt/Uniacc-dashboard-admision"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "🔨 Compilando proyecto..."

# Compilar Backend
echo "📦 Compilando Backend..."
cd "$BACKEND_DIR"
npm install
npm run build
echo "✅ Backend compilado"

# Compilar Frontend
echo "📦 Compilando Frontend..."
cd "$PROJECT_DIR"
npm install
npm run build
echo "✅ Frontend compilado"

echo "🎉 Compilación completada"
