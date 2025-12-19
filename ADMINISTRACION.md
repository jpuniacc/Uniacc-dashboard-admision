# 📋 Guía de Administración del Proyecto

## 🚀 Scripts de Administración

Todos los scripts están en el directorio `scripts/`:

### Script Maestro (Recomendado)
```bash
./scripts/admin.sh
```
Menú interactivo con todas las opciones.

### Scripts Individuales

#### Compilar
```bash
# Compilar todo el proyecto
./scripts/build.sh

# O manualmente:
cd backend && npm install && npm run build
cd .. && npm install && npm run build
```

#### Gestionar Backend
```bash
# Iniciar backend
./scripts/start-backend.sh

# Detener backend
./scripts/stop-backend.sh

# Reiniciar backend
./scripts/restart-backend.sh

# Ver estado
./scripts/status.sh

# Ver logs
./scripts/view-logs.sh
```

## 🔧 Comandos Útiles

### Verificar Estado
```bash
# Verificar si el backend está corriendo
curl http://localhost:3001/api/health

# Ver procesos Node
ps aux | grep node

# Ver puertos en uso
netstat -tulpn | grep :3001
```

### Logs
```bash
# Ver logs del backend
tail -f logs/backend.log

# Ver últimas 100 líneas
tail -n 100 logs/backend.log

# Buscar errores
grep -i error logs/backend.log
```

### Compilación Manual

**Backend:**
```bash
cd /opt/Uniacc-dashboard-admision/backend
npm install
npm run build
```

**Frontend:**
```bash
cd /opt/Uniacc-dashboard-admision
npm install
npm run build
```

## 🎯 Configuración como Servicio Systemd

### 1. Crear archivo de servicio
```bash
sudo cp /tmp/uniacc-backend.service /etc/systemd/system/
```

### 2. Recargar systemd
```bash
sudo systemctl daemon-reload
```

### 3. Habilitar inicio automático
```bash
sudo systemctl enable uniacc-backend
```

### 4. Gestionar el servicio
```bash
# Iniciar
sudo systemctl start uniacc-backend

# Detener
sudo systemctl stop uniacc-backend

# Reiniciar
sudo systemctl restart uniacc-backend

# Ver estado
sudo systemctl status uniacc-backend

# Ver logs
sudo journalctl -u uniacc-backend -f
```

## 📊 Monitoreo

### Ver uso de recursos
```bash
# CPU y memoria del proceso
ps aux | grep "node.*dist/index.js"

# Uso de puertos
ss -tulpn | grep :3001

# Espacio en disco
du -sh /opt/Uniacc-dashboard-admision
```

### Health Check
```bash
# Verificar salud del backend
curl http://localhost:3001/api/health

# Con formato JSON
curl http://localhost:3001/api/health | jq .
```

## 🔄 Actualización del Proyecto

```bash
# 1. Detener servicios
./scripts/stop-backend.sh

# 2. Actualizar código (git pull, etc.)

# 3. Reinstalar dependencias
cd backend && npm install
cd .. && npm install

# 4. Recompilar
./scripts/build.sh

# 5. Reiniciar
./scripts/restart-backend.sh
```

## 🐛 Solución de Problemas

### Backend no inicia
1. Verificar que está compilado: `ls backend/dist/index.js`
2. Verificar variables de entorno: `cat backend/.env`
3. Ver logs: `tail -f logs/backend.log`
4. Verificar puerto: `netstat -tulpn | grep :3001`

### Backend se cae frecuentemente
1. Ver logs de errores: `grep -i error logs/backend.log`
2. Verificar conexión a base de datos
3. Verificar memoria disponible: `free -h`
4. Considerar usar PM2 o systemd con restart automático

### Permisos
```bash
# Si hay problemas de permisos:
sudo chown -R cl159906175:nimbi /opt/Uniacc-dashboard-admision
sudo chmod -R 755 /opt/Uniacc-dashboard-admision
```

## 📝 Estructura de Directorios

```
/opt/Uniacc-dashboard-admision/
├── scripts/          # Scripts de administración
├── logs/            # Logs de la aplicación
├── backend/
│   ├── dist/        # Backend compilado
│   └── src/         # Código fuente backend
├── dist/            # Frontend compilado
└── src/             # Código fuente frontend
```

## 🔐 Seguridad

- Los archivos `.env` tienen permisos 600 (solo propietario)
- El backend debe estar detrás de un proxy reverso (nginx) en producción
- Configurar firewall para permitir solo puertos necesarios
- Usar HTTPS en producción

