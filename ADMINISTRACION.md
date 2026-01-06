# 📋 Guía de Administración del Proyecto

## 🌿 Gestión de Ramas (Git)

El proyecto utiliza dos ramas principales:

- **`main`**: Rama de producción (corriendo con PM2)
- **`dev`**: Rama de desarrollo (para cambios y pruebas locales)

### Trabajar con las Ramas

```bash
# Cambiar a rama dev para desarrollo
git checkout dev

# Hacer cambios y commits en dev
git add .
git commit -m "Descripción de cambios"

# Actualizar dev con cambios de main (cuando sea necesario)
git checkout dev
git merge main

# Cuando esté listo para producción, hacer merge a main
git checkout main
git merge dev
git push origin main

# Luego desplegar en producción (ver sección de Actualización)
```

### Desarrollo Local

Para trabajar en desarrollo sin afectar producción:

**Opción 1: Script único (Recomendado)**
```bash
# 1. Asegurarse de estar en rama dev
git checkout dev

# 2. Ejecutar el script de desarrollo
./scripts/dev.sh
```

Este script levanta automáticamente:
- Backend en puerto **3002** (diferente a producción)
- Frontend en puerto **5174** (diferente a producción)
- Configura automáticamente las variables de entorno necesarias

**Opción 2: Manualmente (dos terminales)**
```bash
# Terminal 1: Backend
cd backend
PORT=3002 npm run dev

# Terminal 2: Frontend
VITE_API_URL=http://localhost:3002 npm run dev
```

**Puertos del Sistema:**
- **Producción (main)**: 
  - Frontend: 4173 (PM2) o según configuración de nginx
  - Backend: **3001**
- **Desarrollo (dev)**: 
  - Frontend: **5174** (Vite dev server)
  - Backend: **3002**

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

#### Desarrollo Completo
```bash
# Levantar backend y frontend en desarrollo (puertos 3002 y 5174)
./scripts/dev.sh

# Detener servidores de desarrollo
./scripts/stop-dev.sh
```

#### Gestionar Frontend
```bash
# Modo desarrollo (rama dev)
./scripts/start-frontend.sh dev
# O directamente: npm run dev (puerto 5174)
# Nota: Requiere VITE_API_URL=http://localhost:3002 si el backend está en puerto 3002

# Modo preview (producción compilada)
./scripts/start-frontend.sh preview
```

## 🔧 Comandos Útiles

### Verificar Estado
```bash
# Verificar backend producción
curl http://localhost:3001/api/health

# Verificar backend desarrollo
curl http://localhost:3002/api/health

# Ver procesos Node
ps aux | grep node

# Ver puertos en uso
netstat -tulpn | grep :3001  # Backend producción
netstat -tulpn | grep :3002  # Backend desarrollo
netstat -tulpn | grep :5174  # Frontend desarrollo
netstat -tulpn | grep :4173  # Frontend producción
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

### Actualización desde Desarrollo a Producción

Cuando los cambios en `dev` están listos para producción:

```bash
# 1. Asegurarse de estar en dev y tener todos los cambios commiteados
git checkout dev
git status  # Verificar que no haya cambios sin commitear

# 2. Cambiar a main y hacer merge
git checkout main
git merge dev

# 3. Detener servicios de producción
pm2 stop all
# O individualmente:
# pm2 stop uniacc-backend
# pm2 stop uniacc-frontend

# 4. Reinstalar dependencias (si hay cambios en package.json)
cd backend && npm install && cd ..
npm install

# 5. Recompilar proyecto
./scripts/build.sh

# 6. Reiniciar servicios
pm2 restart all
# O si no están corriendo:
# pm2 start ecosystem.config.cjs
# pm2 serve dist 4173 --name uniacc-frontend --spa

# 7. Hacer push de main al remoto
git push origin main
```

### Actualización desde Remoto (Producción)

Para actualizar producción desde el repositorio remoto:

```bash
# 1. Detener servicios
./scripts/stop-backend.sh
pm2 stop uniacc-frontend

# 2. Actualizar código desde remoto
git checkout main
git pull origin main

# 3. Reinstalar dependencias
cd backend && npm install && cd ..
npm install

# 4. Recompilar
./scripts/build.sh

# 5. Reiniciar
./scripts/restart-backend.sh
pm2 serve dist 4173 --name uniacc-frontend --spa
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

