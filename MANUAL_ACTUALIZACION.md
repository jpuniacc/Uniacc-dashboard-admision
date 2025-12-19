# 📘 Manual de Actualización - UNIACC Dashboard

Este manual explica cómo actualizar, compilar y gestionar la aplicación en producción.

## 📋 Tabla de Contenidos

1. [Actualización Completa](#actualización-completa)
2. [Compilación](#compilación)
3. [Gestión con PM2](#gestión-con-pm2)
4. [Interfaz Web PM2](#interfaz-web-pm2)
5. [Proceso Paso a Paso](#proceso-paso-a-paso)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🔄 Actualización Completa

### Proceso Completo de Actualización

```bash
# 1. Ir al directorio del proyecto
cd /opt/Uniacc-dashboard-admision

# 2. Detener servicios con PM2
pm2 stop all
# O detener individualmente:
pm2 stop uniacc-backend
pm2 stop uniacc-frontend

# 3. Actualizar código (git pull, copiar archivos, etc.)
git pull origin main
# O copiar nuevos archivos según corresponda

# 4. Reinstalar dependencias (si hay cambios en package.json)
cd backend && npm install
cd .. && npm install

# 5. Recompilar
./scripts/build.sh

# 6. Reiniciar servicios
pm2 restart all
# O reiniciar individualmente:
pm2 restart uniacc-backend
pm2 restart uniacc-frontend

# 7. Verificar estado
pm2 list
pm2 logs --lines 20
```

---

## 🔨 Compilación

### Compilar Todo el Proyecto

```bash
cd /opt/Uniacc-dashboard-admision
./scripts/build.sh
```

### Compilar Solo Backend

```bash
cd /opt/Uniacc-dashboard-admision/backend
npm install
npm run build
```

### Compilar Solo Frontend

```bash
cd /opt/Uniacc-dashboard-admision
npm install
npm run build
```

---

## ⚙️ Gestión con PM2

### Ver Estado de Procesos

```bash
# Ver todos los procesos
pm2 list

# Ver información detallada
pm2 describe uniacc-backend
pm2 describe uniacc-frontend

# Ver uso de recursos
pm2 monit
```

### Detener Procesos

```bash
# Detener todos
pm2 stop all

# Detener individualmente
pm2 stop uniacc-backend
pm2 stop uniacc-frontend

# Detener por ID
pm2 stop 0  # ID del proceso
```

### Iniciar Procesos

```bash
# Iniciar todos
pm2 start all

# Iniciar individualmente
pm2 start ecosystem.config.cjs  # Backend
pm2 serve dist 4173 --name uniacc-frontend --spa  # Frontend

# O usar los scripts
./scripts/pm2-start.sh
./scripts/pm2-frontend.sh
```

### Reiniciar Procesos

```bash
# Reiniciar todos
pm2 restart all

# Reiniciar individualmente
pm2 restart uniacc-backend
pm2 restart uniacc-frontend

# Reinicio forzado (útil si se cuelga)
pm2 restart uniacc-backend --update-env
```

### Eliminar Procesos

```bash
# Eliminar proceso (detiene y elimina de PM2)
pm2 delete uniacc-backend
pm2 delete uniacc-frontend

# Eliminar todos
pm2 delete all
```

### Ver Logs

```bash
# Ver logs de todos los procesos
pm2 logs

# Ver logs de un proceso específico
pm2 logs uniacc-backend
pm2 logs uniacc-frontend

# Ver últimas N líneas
pm2 logs --lines 50

# Seguir logs en tiempo real
pm2 logs --follow

# Limpiar logs
pm2 flush
```

### Guardar y Restaurar Configuración

```bash
# Guardar configuración actual
pm2 save

# Configurar inicio automático al arrancar el servidor
pm2 startup systemd
# (ejecutar el comando que te muestre, generalmente requiere sudo)

# Eliminar inicio automático
pm2 unstartup systemd
```

---

## 🌐 Interfaz Web PM2

### Opción 1: PM2 Plus (Gratis con cuenta)

PM2 Plus es la interfaz web oficial de PM2:

```bash
# Instalar PM2 Plus
npm install -g pm2-logrotate
pm2 install pm2-logrotate

# Conectar a PM2 Plus (requiere cuenta gratuita)
pm2 link <secret_key> <public_key>
```

**Características:**
- ✅ Dashboard web en tiempo real
- ✅ Monitoreo de CPU, memoria, logs
- ✅ Alertas por email
- ✅ Historial de logs
- ✅ Gratis para hasta 2 servidores

**Registro:** https://app.pm2.io/

### Opción 2: PM2 Web (Local)

Instalar interfaz web local:

```bash
# Instalar pm2-web
npm install -g pm2-web

# Iniciar interfaz web
pm2-web

# Acceder en: http://localhost:9615
```

### Opción 3: PM2 GUI (Alternativa)

```bash
# Instalar
npm install -g pm2-gui

# Iniciar
pm2-gui

# Acceder en: http://localhost:4200
```

### Opción 4: Usar PM2 Monit (Terminal)

```bash
# Monitor en terminal (ya incluido)
pm2 monit
```

---

## 📝 Proceso Paso a Paso

### Escenario: Actualizar después de cambios en código

```bash
# PASO 1: Detener servicios
cd /opt/Uniacc-dashboard-admision
pm2 stop all

# PASO 2: Actualizar código
git pull
# O copiar nuevos archivos

# PASO 3: Reinstalar dependencias (si es necesario)
cd backend && npm install && cd ..
npm install

# PASO 4: Recompilar
./scripts/build.sh

# PASO 5: Reiniciar servicios
pm2 restart all

# PASO 6: Verificar
pm2 list
curl http://localhost:3001/api/health
```

### Escenario: Solo actualizar backend

```bash
# Detener backend
pm2 stop uniacc-backend

# Actualizar y compilar backend
cd /opt/Uniacc-dashboard-admision/backend
git pull  # o copiar archivos
npm install
npm run build

# Reiniciar
pm2 restart uniacc-backend

# Verificar
pm2 logs uniacc-backend --lines 20
```

### Escenario: Solo actualizar frontend

```bash
# Detener frontend
pm2 stop uniacc-frontend

# Actualizar y compilar frontend
cd /opt/Uniacc-dashboard-admision
git pull  # o copiar archivos
npm install
npm run build

# Reiniciar frontend
pm2 serve dist 4173 --name uniacc-frontend --spa

# Verificar
pm2 list
```

---

## 🛠️ Scripts de Ayuda

### Script de Actualización Completa

```bash
#!/bin/bash
# scripts/update.sh

cd /opt/Uniacc-dashboard-admision

echo "🛑 Deteniendo servicios..."
pm2 stop all

echo "📦 Actualizando dependencias..."
cd backend && npm install && cd ..
npm install

echo "🔨 Compilando..."
./scripts/build.sh

echo "🚀 Reiniciando servicios..."
pm2 restart all

echo "✅ Actualización completada"
pm2 list
```

### Script de Reinicio Rápido

```bash
#!/bin/bash
# scripts/quick-restart.sh

cd /opt/Uniacc-dashboard-admision

echo "🔄 Reiniciando servicios..."
pm2 restart all

echo "✅ Servicios reiniciados"
pm2 list
```

---

## 🐛 Solución de Problemas

### El backend no inicia

```bash
# 1. Ver logs de error
pm2 logs uniacc-backend --err --lines 50

# 2. Verificar que está compilado
ls -la backend/dist/index.js

# 3. Verificar variables de entorno
cat backend/.env

# 4. Probar ejecución directa
cd backend
node dist/index.js
```

### El frontend no carga

```bash
# 1. Verificar que está compilado
ls -la dist/index.html

# 2. Recompilar frontend
npm run build

# 3. Reiniciar frontend
pm2 restart uniacc-frontend
```

### Error de CORS

```bash
# Verificar configuración CORS en backend/.env
grep CORS_ORIGIN backend/.env

# Actualizar si es necesario
# CORS_ORIGIN=http://tu-dominio:4173,http://localhost:4173

# Reiniciar backend
pm2 restart uniacc-backend
```

### PM2 no guarda procesos

```bash
# Guardar manualmente
pm2 save

# Verificar archivo de guardado
cat ~/.pm2/dump.pm2

# Si no funciona, eliminar y recrear
pm2 kill
pm2 resurrect
```

### Proceso se cae constantemente

```bash
# Ver logs de errores
pm2 logs --err --lines 100

# Verificar configuración de reinicio
pm2 describe uniacc-backend

# Ajustar límites de reinicio en ecosystem.config.cjs
# max_restarts: 10
# restart_delay: 4000
```

---

## 📊 Comandos de Monitoreo

### Ver Estado General

```bash
# Lista de procesos
pm2 list

# Información detallada
pm2 show uniacc-backend

# Uso de recursos
pm2 monit

# Estadísticas
pm2 status
```

### Ver Logs Específicos

```bash
# Logs de error solamente
pm2 logs --err

# Logs de salida solamente
pm2 logs --out

# Logs de un proceso específico
pm2 logs uniacc-backend

# Buscar en logs
pm2 logs | grep "error"
```

---

## 🔐 Seguridad

### Variables de Entorno

```bash
# Nunca commitees el archivo .env
# Asegúrate de que tiene permisos 600
chmod 600 backend/.env

# Verificar que no está en git
git check-ignore backend/.env
```

### Permisos

```bash
# Verificar permisos del proyecto
ls -la /opt/Uniacc-dashboard-admision

# Si hay problemas, reconfigurar:
sudo chown -R cl159906175:nimbi /opt/Uniacc-dashboard-admision
```

---

## 📚 Referencias Rápidas

### Comandos PM2 Más Usados

| Comando | Descripción |
|---------|-------------|
| `pm2 list` | Ver todos los procesos |
| `pm2 start ecosystem.config.cjs` | Iniciar backend |
| `pm2 stop all` | Detener todos |
| `pm2 restart all` | Reiniciar todos |
| `pm2 logs` | Ver logs |
| `pm2 monit` | Monitor en tiempo real |
| `pm2 save` | Guardar configuración |
| `pm2 delete all` | Eliminar todos |

### URLs Importantes

- **Backend API:** http://localhost:3001
- **Frontend:** http://localhost:4173 (o http://172.16.0.206:4173)
- **Health Check:** http://localhost:3001/api/health
- **PM2 Web (si instalado):** http://localhost:9615

---

## ✅ Checklist de Actualización

- [ ] Detener servicios con PM2
- [ ] Actualizar código fuente
- [ ] Reinstalar dependencias (si es necesario)
- [ ] Compilar backend
- [ ] Compilar frontend
- [ ] Reiniciar servicios
- [ ] Verificar que todo funciona
- [ ] Revisar logs por errores
- [ ] Guardar configuración PM2

---

**Última actualización:** 2025-12-19

