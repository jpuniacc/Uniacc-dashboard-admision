#!/bin/bash
# Script para ver logs del backend

PROJECT_DIR="/opt/Uniacc-dashboard-admision"
LOG_FILE="$PROJECT_DIR/logs/backend.log"

if [ -f "$LOG_FILE" ]; then
    tail -f "$LOG_FILE"
else
    echo "❌ No se encontró archivo de logs: $LOG_FILE"
    echo "💡 El backend debe estar corriendo para generar logs"
fi
