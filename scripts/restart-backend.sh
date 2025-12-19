#!/bin/bash
# Script para reiniciar el backend

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🔄 Reiniciando backend..."
"$PROJECT_DIR/scripts/stop-backend.sh"
sleep 2
"$PROJECT_DIR/scripts/start-backend.sh"
