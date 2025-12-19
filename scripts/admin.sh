#!/bin/bash
# Script maestro de administración

PROJECT_DIR="/opt/Uniacc-dashboard-admision"
SCRIPTS_DIR="$PROJECT_DIR/scripts"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

show_menu() {
    clear
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Administración UNIACC Dashboard          ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}1.${NC} Compilar proyecto completo"
    echo -e "${GREEN}2.${NC} Compilar solo Backend"
    echo -e "${GREEN}3.${NC} Compilar solo Frontend"
    echo ""
    echo -e "${YELLOW}4.${NC} Iniciar Backend"
    echo -e "${YELLOW}5.${NC} Detener Backend"
    echo -e "${YELLOW}6.${NC} Reiniciar Backend"
    echo ""
    echo -e "${BLUE}7.${NC} Ver estado del sistema"
    echo -e "${BLUE}8.${NC} Ver logs del Backend"
    echo -e "${BLUE}9.${NC} Verificar salud del Backend"
    echo ""
    echo -e "${RED}10.${NC} Instalar servicio systemd"
    echo -e "${RED}11.${NC} Gestionar servicio systemd"
    echo ""
    echo -e "${GREEN}0.${NC} Salir"
    echo ""
    echo -n "Selecciona una opción: "
}

build_all() {
    echo -e "${YELLOW}Compilando proyecto completo...${NC}"
    "$SCRIPTS_DIR/build.sh"
    read -p "Presiona Enter para continuar..."
}

build_backend() {
    echo -e "${YELLOW}Compilando Backend...${NC}"
    cd "$PROJECT_DIR/backend"
    npm install
    npm run build
    echo -e "${GREEN}✅ Backend compilado${NC}"
    read -p "Presiona Enter para continuar..."
}

build_frontend() {
    echo -e "${YELLOW}Compilando Frontend...${NC}"
    cd "$PROJECT_DIR"
    npm install
    npm run build
    echo -e "${GREEN}✅ Frontend compilado${NC}"
    read -p "Presiona Enter para continuar..."
}

start_backend() {
    "$SCRIPTS_DIR/start-backend.sh"
    read -p "Presiona Enter para continuar..."
}

stop_backend() {
    "$SCRIPTS_DIR/stop-backend.sh"
    read -p "Presiona Enter para continuar..."
}

restart_backend() {
    "$SCRIPTS_DIR/restart-backend.sh"
    read -p "Presiona Enter para continuar..."
}

view_status() {
    "$SCRIPTS_DIR/status.sh"
    read -p "Presiona Enter para continuar..."
}

view_logs() {
    "$SCRIPTS_DIR/view-logs.sh"
}

check_health() {
    echo -e "${YELLOW}Verificando salud del Backend...${NC}"
    if curl -s http://localhost:3001/api/health | jq . 2>/dev/null; then
        echo -e "${GREEN}✅ Backend está saludable${NC}"
    else
        echo -e "${RED}❌ Backend no responde${NC}"
    fi
    read -p "Presiona Enter para continuar..."
}

install_systemd() {
    echo -e "${YELLOW}Instalando servicio systemd...${NC}"
    echo "Ejecuta estos comandos con sudo:"
    echo ""
    echo "sudo cp /tmp/uniacc-backend.service /etc/systemd/system/"
    echo "sudo systemctl daemon-reload"
    echo "sudo systemctl enable uniacc-backend"
    echo "sudo systemctl start uniacc-backend"
    echo ""
    read -p "Presiona Enter para continuar..."
}

manage_systemd() {
    echo -e "${YELLOW}Gestión de servicio systemd${NC}"
    echo ""
    echo "1. Iniciar:   sudo systemctl start uniacc-backend"
    echo "2. Detener:   sudo systemctl stop uniacc-backend"
    echo "3. Reiniciar: sudo systemctl restart uniacc-backend"
    echo "4. Estado:    sudo systemctl status uniacc-backend"
    echo "5. Logs:      sudo journalctl -u uniacc-backend -f"
    echo ""
    read -p "Presiona Enter para continuar..."
}

# Menú principal
while true; do
    show_menu
    read option
    case $option in
        1) build_all ;;
        2) build_backend ;;
        3) build_frontend ;;
        4) start_backend ;;
        5) stop_backend ;;
        6) restart_backend ;;
        7) view_status ;;
        8) view_logs ;;
        9) check_health ;;
        10) install_systemd ;;
        11) manage_systemd ;;
        0) echo "¡Hasta luego!"; exit 0 ;;
        *) echo -e "${RED}Opción inválida${NC}"; sleep 1 ;;
    esac
done
