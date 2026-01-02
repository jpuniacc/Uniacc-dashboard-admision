#!/bin/bash
# Script para redirigir puerto 80 → 4173 usando iptables

echo "🔧 Configurando redirección de puerto 80 → 4173 con iptables"
echo ""

# Verificar si ya existe la regla
if sudo iptables -t nat -C PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 4173 2>/dev/null; then
    echo "⚠️  La regla ya existe"
    exit 0
fi

# Agregar regla de redirección
echo "Agregando regla de redirección..."
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 4173

if [ $? -eq 0 ]; then
    echo "✅ Redirección configurada"
    echo ""
    echo "Para hacer permanente la regla:"
    echo "  sudo apt-get install iptables-persistent"
    echo "  sudo netfilter-persistent save"
    echo ""
    echo "O guardar manualmente:"
    echo "  sudo iptables-save > /etc/iptables/rules.v4"
else
    echo "❌ Error al configurar redirección"
    exit 1
fi

