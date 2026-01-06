#!/bin/bash
# Script para configurar Nginx como reverse proxy

echo "🔧 Configurando Nginx para redirigir puerto 80 → 4173"
echo ""

# Crear configuración de Nginx
sudo tee /etc/nginx/sites-available/uniacc-dashboard > /dev/null << 'NGINX_CONFIG'
server {
    listen 80;
    server_name _;  # Acepta cualquier dominio/IP

    # Redirección simple
    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
NGINX_CONFIG

# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/uniacc-dashboard /etc/nginx/sites-enabled/

# Eliminar configuración por defecto si existe
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
echo "Verificando configuración de Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuración válida"
    echo ""
    echo "Para aplicar los cambios:"
    echo "  sudo systemctl reload nginx"
    echo "  # O"
    echo "  sudo systemctl restart nginx"
else
    echo "❌ Error en la configuración"
    exit 1
fi

