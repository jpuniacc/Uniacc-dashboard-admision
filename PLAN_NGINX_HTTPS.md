# 🔒 Plan Manual: Configurar Nginx con HTTPS (Puerto 443)

Guía paso a paso para configurar Nginx con certificados SSL.

---

## 📋 Certificados Disponibles

- `certificados/uniacc_cl.crt` - Certificado SSL
- `certificados/uniacc_cl.key` - Clave privada
- `certificados/uniacc_cl.pem` - Certificado completo (si es necesario)
- `certificados/CACert.crt` - Certificado de CA

---

## 🎯 Plan Paso a Paso

### Paso 1: Verificar que Nginx está instalado

```bash
which nginx
```

Si no está instalado:
```bash
sudo apt-get update
sudo apt-get install nginx -y
```

### Paso 2: Verificar permisos de los certificados

```bash
ls -la /opt/Uniacc-dashboard-admision/certificados/
```

Los certificados deben tener permisos adecuados:
- `.key` debe ser 600 (solo lectura para propietario)
- `.crt` y `.pem` pueden ser 644

Si es necesario, ajustar permisos:
```bash
sudo chmod 600 /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key
sudo chmod 644 /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt
sudo chmod 644 /opt/Uniacc-dashboard-admision/certificados/CACert.crt
```

### Paso 3: Crear configuración de Nginx con HTTPS

```bash
sudo nano /etc/nginx/sites-available/uniacc-dashboard
```

### Paso 4: Pegar esta configuración completa

```nginx
# Redirección HTTP (80) a HTTPS (443)
server {
    listen 80;
    server_name _;  # O tu dominio específico: uniacc.cl, dashboard.uniacc.cl, etc.

    # Redirigir todo a HTTPS
    return 301 https://$host$request_uri;
}

# Configuración HTTPS (443)
server {
    listen 443 ssl http2;
    server_name _;  # O tu dominio específico

    # Rutas de certificados SSL
    ssl_certificate /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt;
    ssl_certificate_key /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key;

    # Si tienes cadena de certificados, descomenta y ajusta:
    # ssl_trusted_certificate /opt/Uniacc-dashboard-admision/certificados/CACert.crt;

    # Configuración SSL moderna y segura
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy al frontend en puerto 4173
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

### Paso 5: Guardar el archivo

- Presiona `Ctrl+X`
- Luego `Y` para confirmar
- Luego `Enter` para guardar

### Paso 6: Habilitar el sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/uniacc-dashboard /etc/nginx/sites-enabled/

# Eliminar configuración por defecto (si existe)
sudo rm -f /etc/nginx/sites-enabled/default
```

### Paso 7: Verificar configuración

```bash
sudo nginx -t
```

Debe mostrar:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Si hay errores, revisa:
- Rutas de certificados correctas
- Permisos de archivos
- Sintaxis de la configuración

### Paso 8: Aplicar cambios

```bash
sudo systemctl reload nginx
```

O si prefieres reiniciar completamente:
```bash
sudo systemctl restart nginx
```

### Paso 9: Verificar estado

```bash
sudo systemctl status nginx
```

Debe mostrar `active (running)`.

### Paso 10: Probar HTTPS

```bash
# Desde el servidor
curl -k https://localhost

# Verificar que HTTP redirige a HTTPS
curl -I http://localhost
# Debe mostrar: HTTP/1.1 301 Moved Permanently
```

### Paso 11: Probar desde navegador

Abre en tu navegador:
- `https://172.16.0.206`
- O `https://tu-dominio.com` (si configuraste el dominio)

Debería mostrar el dashboard con el candado verde (SSL activo).

---

## 🔧 Configuración Alternativa (Si el certificado .pem es necesario)

Si necesitas usar el archivo `.pem` en lugar de `.crt`, cambia estas líneas en la configuración:

```nginx
ssl_certificate /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.pem;
ssl_certificate_key /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key;
```

---

## 🔧 Configuración con Cadena de Certificados

Si necesitas incluir el certificado de CA:

```nginx
ssl_certificate /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt;
ssl_certificate_key /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key;
ssl_trusted_certificate /opt/Uniacc-dashboard-admision/certificados/CACert.crt;
```

O si tienes un archivo de cadena completa:

```nginx
ssl_certificate /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.pem;
ssl_certificate_key /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key;
```

---

## 🐛 Solución de Problemas

### Error: "SSL certificate file not found"

```bash
# Verificar que los archivos existen
ls -la /opt/Uniacc-dashboard-admision/certificados/

# Verificar permisos
sudo chmod 644 /opt/Uniacc-dashboard-admision/certificados/*.crt
sudo chmod 600 /opt/Uniacc-dashboard-admision/certificados/*.key
```

### Error: "SSL_CTX_use_certificate_file failed"

```bash
# Verificar que el certificado es válido
openssl x509 -in /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt -text -noout

# Verificar que la clave corresponde al certificado
openssl x509 -noout -modulus -in /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt | openssl md5
openssl rsa -noout -modulus -in /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key | openssl md5
# Ambos deben mostrar el mismo hash
```

### Error: "Permission denied" al leer certificados

```bash
# Ajustar permisos
sudo chmod 644 /opt/Uniacc-dashboard-admision/certificados/*.crt
sudo chmod 600 /opt/Uniacc-dashboard-admision/certificados/*.key
sudo chown root:root /opt/Uniacc-dashboard-admision/certificados/*.crt
sudo chown root:root /opt/Uniacc-dashboard-admision/certificados/*.key
```

### El navegador muestra "Certificado no confiable"

Esto es normal si:
- El certificado es autofirmado
- El certificado de CA no está instalado en el navegador

Solución:
1. Instalar `CACert.crt` en el navegador/cliente
2. O aceptar la excepción en el navegador (solo para uso interno)

---

## 📝 Comandos de Mantenimiento

### Ver logs de Nginx

```bash
# Logs de acceso
sudo tail -f /var/log/nginx/access.log

# Logs de error
sudo tail -f /var/log/nginx/error.log

# Logs de error SSL específicos
sudo grep ssl /var/log/nginx/error.log
```

### Recargar configuración

```bash
# Recargar sin downtime
sudo systemctl reload nginx

# Reiniciar completamente
sudo systemctl restart nginx
```

### Verificar certificado

```bash
# Ver información del certificado
openssl x509 -in /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt -text -noout

# Ver fecha de expiración
openssl x509 -in /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt -noout -enddate
```

---

## ✅ Checklist de Verificación

Después de configurar, verifica:

- [ ] `sudo nginx -t` muestra "syntax is ok"
- [ ] Nginx está corriendo: `sudo systemctl status nginx`
- [ ] HTTP redirige a HTTPS: `curl -I http://localhost`
- [ ] HTTPS funciona: `curl -k https://localhost`
- [ ] El dashboard carga en el navegador con HTTPS
- [ ] El certificado se muestra correctamente (candado verde o advertencia según tipo)

---

## 🎯 Resumen de Comandos

```bash
# 1. Instalar Nginx (si no está)
sudo apt-get install nginx -y

# 2. Ajustar permisos de certificados
sudo chmod 600 /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key
sudo chmod 644 /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt

# 3. Crear configuración
sudo nano /etc/nginx/sites-available/uniacc-dashboard
# (pegar configuración del plan)

# 4. Habilitar sitio
sudo ln -s /etc/nginx/sites-available/uniacc-dashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 5. Verificar y aplicar
sudo nginx -t
sudo systemctl reload nginx

# 6. Probar
curl -k https://localhost
```

---

**Última actualización:** 2025-12-22

