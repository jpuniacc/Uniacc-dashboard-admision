# 🔒 Plan Completo: Configurar HTTPS con postulantes.uniacc.cl

Plan paso a paso para resolver el error de Mixed Content y configurar HTTPS correctamente.

---

## 🎯 Objetivo

- Configurar Nginx con HTTPS para `postulantes.uniacc.cl`
- Resolver error "Mixed Content" (HTTPS → HTTP)
- Hacer que el backend API también funcione sobre HTTPS

---

## 📋 Plan Paso a Paso

### Paso 1: Actualizar configuración de Nginx

```bash
sudo nano /etc/nginx/sites-available/uniacc-dashboard
```

**Pegar esta configuración completa:**

```nginx
# Redirección HTTP (80) a HTTPS (443)
server {
    listen 80;
    server_name postulantes.uniacc.cl;

    # Redirigir todo a HTTPS
    return 301 https://$host$request_uri;
}

# Configuración HTTPS (443)
server {
    listen 443 ssl http2;
    server_name postulantes.uniacc.cl;

    # Rutas de certificados SSL
    ssl_certificate /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt;
    ssl_certificate_key /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key;

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

    # Proxy al backend API en puerto 3001
    location /api {
        proxy_pass http://localhost:3001;
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

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

---

### Paso 2: Verificar permisos de certificados

```bash
sudo chmod 600 /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key
sudo chmod 644 /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt
```

---

### Paso 3: Habilitar el sitio (si no está habilitado)

```bash
sudo ln -s /etc/nginx/sites-available/uniacc-dashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

---

### Paso 4: Verificar configuración de Nginx

```bash
sudo nginx -t
```

**Debe mostrar:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Si hay errores, revisa:
- Rutas de certificados correctas
- Sintaxis correcta
- Permisos de archivos

---

### Paso 5: Recargar Nginx

```bash
sudo systemctl reload nginx
```

O si prefieres reiniciar completamente:
```bash
sudo systemctl restart nginx
```

---

### Paso 6: Verificar estado de Nginx

```bash
sudo systemctl status nginx
```

Debe mostrar `active (running)`.

---

### Paso 7: Actualizar .env del frontend

```bash
nano .env
```

**Cambiar o agregar:**
```
VITE_API_URL=
```

O simplemente dejar vacío para usar URLs relativas.

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

---

### Paso 8: Recompilar el frontend

```bash
npm run build
```

Esto aplicará los cambios en los composables que ahora usan URLs relativas.

---

### Paso 9: Reiniciar PM2

```bash
pm2 restart uniacc-frontend
```

---

### Paso 10: Verificar que funciona

**Desde el servidor:**
```bash
# Verificar que HTTP redirige a HTTPS
curl -I http://postulantes.uniacc.cl
# Debe mostrar: HTTP/1.1 301 Moved Permanently

# Verificar HTTPS
curl -k https://postulantes.uniacc.cl
# Debe mostrar el HTML del dashboard

# Verificar API sobre HTTPS
curl -k https://postulantes.uniacc.cl/api/postulantes/stats
# Debe devolver JSON con estadísticas
```

**Desde el navegador:**
- Abrir: `https://postulantes.uniacc.cl`
- Debe cargar el dashboard sin errores de Mixed Content
- El candado verde debe aparecer (SSL válido)

---

## ✅ Checklist Final

Después de completar todos los pasos, verifica:

- [ ] `sudo nginx -t` muestra "syntax is ok"
- [ ] Nginx está corriendo: `sudo systemctl status nginx`
- [ ] HTTP redirige a HTTPS: `curl -I http://postulantes.uniacc.cl`
- [ ] HTTPS funciona: `curl -k https://postulantes.uniacc.cl`
- [ ] API funciona sobre HTTPS: `curl -k https://postulantes.uniacc.cl/api/postulantes/stats`
- [ ] El dashboard carga en el navegador sin errores
- [ ] No hay errores de "Mixed Content" en la consola del navegador
- [ ] El certificado SSL se muestra correctamente

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

### Error: "502 Bad Gateway"

```bash
# Verificar que PM2 está corriendo
pm2 list

# Verificar que el frontend responde
curl http://localhost:4173

# Verificar que el backend responde
curl http://localhost:3001/api/health

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

### Error: "Mixed Content" persiste

```bash
# Verificar que el .env tiene VITE_API_URL vacío
cat .env | grep VITE_API_URL

# Recompilar el frontend
npm run build

# Reiniciar PM2
pm2 restart uniacc-frontend

# Limpiar caché del navegador (Ctrl+Shift+Delete)
```

### El dominio no resuelve

```bash
# Verificar DNS
nslookup postulantes.uniacc.cl

# Verificar que el servidor escucha en el puerto 443
sudo netstat -tulpn | grep :443

# Verificar logs de Nginx
sudo tail -f /var/log/nginx/access.log
```

---

## 📝 Resumen de Comandos

```bash
# 1. Editar configuración de Nginx
sudo nano /etc/nginx/sites-available/uniacc-dashboard
# (pegar configuración completa)

# 2. Ajustar permisos
sudo chmod 600 /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.key
sudo chmod 644 /opt/Uniacc-dashboard-admision/certificados/uniacc_cl.crt

# 3. Habilitar sitio
sudo ln -s /etc/nginx/sites-available/uniacc-dashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 4. Verificar y aplicar
sudo nginx -t
sudo systemctl reload nginx

# 5. Actualizar .env
nano .env
# (VITE_API_URL=)

# 6. Recompilar frontend
npm run build

# 7. Reiniciar PM2
pm2 restart uniacc-frontend

# 8. Verificar
curl -k https://postulantes.uniacc.cl/api/postulantes/stats
```

---

**Última actualización:** 2025-12-22


