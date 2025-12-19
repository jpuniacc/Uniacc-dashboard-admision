#!/bin/bash
# Script para iniciar el frontend

PROJECT_DIR="/opt/Uniacc-dashboard-admision"
MODE="${1:-preview}"  # preview o dev

cd "$PROJECT_DIR"

if [ "$MODE" = "dev" ]; then
    echo "🔧 Iniciando frontend en modo DESARROLLO..."
    echo "   URL: http://localhost:5173"
    npm run dev
elif [ "$MODE" = "preview" ]; then
    # Verificar que está compilado
    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
        echo "❌ Error: El frontend no está compilado. Ejecuta: ./scripts/build.sh"
        exit 1
    fi
    
    echo "🚀 Iniciando frontend en modo PREVIEW (producción)..."
    echo "   URL: http://localhost:4173"
    npm run preview -- --host
else
    echo "Uso: $0 [preview|dev]"
    echo "  preview - Servidor de preview (producción compilada)"
    echo "  dev     - Modo desarrollo con hot reload"
    exit 1
fi
