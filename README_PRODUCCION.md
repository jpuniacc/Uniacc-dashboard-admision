# 🚀 README - Producción UNIACC Dashboard

Guía completa para administrar y actualizar el sistema en producción.

## 📋 Tabla de Contenidos

1. [Inicio Rápido](#inicio-rápido)
2. [Gestión con PM2](#gestión-con-pm2)
3. [Actualización de la Aplicación](#actualización-de-la-aplicación)
4. [Gestión con Git](#gestión-con-git)
5. [Monitoreo y Logs](#monitoreo-y-logs)
6. [Solución de Problemas](#solución-de-problemas)
7. [Comandos de Referencia](#comandos-de-referencia)

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ instalado
- PM2 instalado globalmente: `npm install -g pm2`
- Acceso a SQL Server configurado
- Archivo `.env` configurado en `backend/`

### Primera Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/jpuniacc/Uniacc-dashboard-admision.git
cd Uniacc-dashboard-admision

# 2. Instalar dependencias
cd backend && npm install && cd ..
npm install

# 3. Configurar variables de entorno
# Editar backend/.env con tus credenciales

# 4. Compilar proyecto
./scripts/build.sh

# 5. Iniciar con PM2
./scripts/pm2-start.sh
./scripts/pm2-frontend.sh

# 6. Verificar estado
pm2 list
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

# Monitor en tiempo real
pm2 monit
```

### Iniciar Procesos

```bash
# Backend
./scripts/pm2-start.sh
# O directamente:
pm2 start ecosystem.config.cjs

# Frontend
./scripts/pm2-frontend.sh
# O directamente:
pm2 serve dist 4173 --name uniacc-frontend --spa

# Ambos
pm2 start ecosystem.config.cjs
pm2 serve dist 4173 --name uniacc-frontend --spa
```

### Detener Procesos

```bash
# Detener todos
pm2 stop all

# Detener individualmente
pm2 stop uniacc-backend
pm2 stop uniacc-frontend
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

# Solo errores
pm2 logs --err

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

### Interfaz Web PM2 Plus

El proyecto está conectado a PM2 Plus para monitoreo web:

- **Dashboard:** https://app.pm2.io/
- **Acceso directo:** https://app.pm2.io/#/r/iua26ys31spze9x

En el dashboard puedes ver:
- Estado de procesos en tiempo real
- Uso de CPU y memoria
- Logs históricos
- Métricas y estadísticas
- Alertas configurables

---

## 🔄 Actualización de la Aplicación

### Proceso Completo de Actualización

Cuando hay nuevos cambios en el repositorio, sigue estos pasos:

#### Opción 1: Script Automático (Recomendado)

```bash
cd /opt/Uniacc-dashboard-admision
./scripts/update.sh
```

Este script automáticamente:
1. Detiene los servicios
2. Actualiza dependencias
3. Recompila el proyecto
4. Reinicia los servicios
5. Verifica el estado

#### Opción 2: Manual (Paso a Paso)

```bash
# 1. Ir al directorio del proyecto
cd /opt/Uniacc-dashboard-admision

# 2. Detener servicios con PM2
pm2 stop all

# 3. Actualizar código desde Git
git pull origin main

# 4. Reinstalar dependencias (si hay cambios en package.json)
cd backend && npm install && cd ..
npm install

# 5. Recompilar proyecto
./scripts/build.sh

# 6. Reiniciar servicios
pm2 restart all

# 7. Verificar estado
pm2 list
pm2 logs --lines 20
```

### Actualizar Solo Backend

```bash
# 1. Detener backend
pm2 stop uniacc-backend

# 2. Actualizar y compilar backend
cd /opt/Uniacc-dashboard-admision/backend
git pull  # o copiar nuevos archivos
npm install
npm run build

# 3. Reiniciar backend
pm2 restart uniacc-backend

# 4. Verificar
pm2 logs uniacc-backend --lines 20
```

### Actualizar Solo Frontend

```bash
# 1. Detener frontend
pm2 stop uniacc-frontend

# 2. Actualizar y compilar frontend
cd /opt/Uniacc-dashboard-admision
git pull  # o copiar nuevos archivos
npm install
npm run build

# 3. Reiniciar frontend
pm2 serve dist 4173 --name uniacc-frontend --spa

# 4. Verificar
pm2 list
```

### Verificar Actualización

Después de actualizar, verifica que todo funciona:

```bash
# 1. Ver estado de procesos
pm2 list

# 2. Verificar backend
curl http://localhost:3001/api/health

# 3. Ver logs recientes
pm2 logs --lines 30

# 4. Verificar frontend
# Abrir navegador en http://localhost:4173
```

---

## 📦 Gestión con Git

### Configuración Inicial

```bash
# Configurar usuario (si no está configurado)
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@uniacc.cl"

# Guardar credenciales (para no escribir token cada vez)
git config --global credential.helper store
```

### Comandos Git Básicos

```bash
# Ver estado
git status

# Ver cambios
git diff

# Ver historial
git log --oneline -10

# Ver rama actual
git branch
```

### Actualizar desde Git

```bash
# Obtener últimos cambios
git pull origin main

# Si hay conflictos, resolver y luego:
git add .
git commit -m "Resuelto conflicto"
git push origin main
```

### Subir Cambios a Git

```bash
# 1. Ver qué archivos cambiaron
git status

# 2. Agregar archivos al staging
git add .
# O archivos específicos:
git add archivo1.js archivo2.js

# 3. Crear commit
git commit -m "Descripción de los cambios"

# 4. Subir a GitHub
git push origin main
```

### Autenticación con GitHub

Si necesitas autenticarte para hacer push:

**Opción 1: Personal Access Token (Recomendado)**

1. Crear token en: https://github.com/settings/tokens
2. Generar nuevo token (classic) con scope `repo`
3. Usar el token como contraseña al hacer push:

```bash
git push origin main
# Usuario: jpuniacc
# Contraseña: <pegar-token-aquí>
```

**Opción 2: Token en URL**

```bash
git push https://<tu-token>@github.com/jpuniacc/Uniacc-dashboard-admision.git main
```

**Opción 3: Guardar Token Permanentemente**

```bash
git config --global credential.helper store
git push origin main
# (introduce token una vez, se guardará)
```

### Resolver Conflictos

Si hay conflictos al hacer `git pull`:

```bash
# 1. Ver archivos en conflicto
git status

# 2. Abrir archivos y resolver conflictos manualmente
# (buscar marcadores <<<<<<<, =======, >>>>>>>)

# 3. Marcar como resuelto
git add archivo-resuelto.js

# 4. Completar merge
git commit -m "Resuelto conflicto"

# 5. Subir cambios
git push origin main
```

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Todos los procesos
pm2 logs --follow

# Proceso específico
pm2 logs uniacc-backend --follow

# Solo errores
pm2 logs --err --follow
```

### Ver Logs Históricos

```bash
# Últimas 100 líneas
pm2 logs --lines 100

# Buscar en logs
pm2 logs | grep "error"
pm2 logs | grep "POSTULANTE"

# Logs de un proceso específico
pm2 logs uniacc-backend --lines 50
```

### Verificar Salud del Sistema

```bash
# Health check del backend
curl http://localhost:3001/api/health

# Ver uso de recursos
pm2 monit

# Ver estadísticas
pm2 status
pm2 show uniacc-backend
```

### Logs del Sistema

Los logs también se guardan en archivos:

```bash
# Logs del backend
tail -f /opt/Uniacc-dashboard-admision/logs/backend.log

# Logs de PM2
tail -f ~/.pm2/logs/uniacc-backend-out.log
tail -f ~/.pm2/logs/uniacc-backend-error.log
```

---

## 🐛 Solución de Problemas

### Backend No Inicia

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

# 5. Verificar conexión a base de datos
# Revisar logs para errores de conexión SQL Server
```

### Frontend No Carga

```bash
# 1. Verificar que está compilado
ls -la dist/index.html

# 2. Recompilar frontend
npm run build

# 3. Reiniciar frontend
pm2 restart uniacc-frontend

# 4. Verificar logs
pm2 logs uniacc-frontend
```

### Error de CORS

```bash
# 1. Verificar configuración CORS
grep CORS_ORIGIN backend/.env

# 2. Actualizar si es necesario
# Editar backend/.env y agregar:
# CORS_ORIGIN=http://tu-dominio:4173,http://localhost:4173

# 3. Recompilar y reiniciar
cd backend && npm run build && cd ..
pm2 restart uniacc-backend
```

### Proceso Se Cae Constantemente

```bash
# 1. Ver logs de errores
pm2 logs --err --lines 100

# 2. Verificar memoria disponible
free -h

# 3. Verificar configuración de reinicio
pm2 describe uniacc-backend

# 4. Ajustar límites en ecosystem.config.cjs si es necesario
# max_memory_restart: '500M'
# max_restarts: 10
```

### PM2 No Guarda Procesos

```bash
# 1. Guardar manualmente
pm2 save

# 2. Verificar archivo de guardado
cat ~/.pm2/dump.pm2

# 3. Si no funciona, eliminar y recrear
pm2 kill
pm2 resurrect
```

### Problemas de Permisos

```bash
# Verificar permisos
ls -la /opt/Uniacc-dashboard-admision

# Reconfigurar permisos si es necesario
sudo chown -R cl159906175:nimbi /opt/Uniacc-dashboard-admision
sudo chmod -R 755 /opt/Uniacc-dashboard-admision
sudo chmod 600 /opt/Uniacc-dashboard-admision/backend/.env
```

### Base de Datos No Conecta

```bash
# 1. Verificar variables de entorno
cat backend/.env | grep DB_

# 2. Probar conexión manual
# (usar herramienta de SQL Server)

# 3. Ver logs de conexión
pm2 logs uniacc-backend | grep -i "sql\|database\|connection"
```

---

## 📚 Comandos de Referencia

### PM2 - Comandos Esenciales

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
| `pm2 flush` | Limpiar logs |

### Git - Comandos Esenciales

| Comando | Descripción |
|---------|-------------|
| `git status` | Ver estado |
| `git pull origin main` | Actualizar desde GitHub |
| `git add .` | Agregar todos los cambios |
| `git commit -m "mensaje"` | Crear commit |
| `git push origin main` | Subir a GitHub |
| `git log --oneline -10` | Ver últimos commits |

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `./scripts/build.sh` | Compilar proyecto completo |
| `./scripts/pm2-start.sh` | Iniciar backend con PM2 |
| `./scripts/pm2-frontend.sh` | Iniciar frontend con PM2 |
| `./scripts/update.sh` | Actualización completa automática |
| `./scripts/status.sh` | Ver estado del sistema |
| `./scripts/view-logs.sh` | Ver logs del backend |

---

## 🔐 Seguridad

### Variables de Entorno

- **Nunca** commitees el archivo `.env`
- Asegúrate de que tiene permisos `600`:
  ```bash
  chmod 600 backend/.env
  ```
- Verificar que está en `.gitignore`:
  ```bash
  git check-ignore backend/.env
  ```

### Base de Datos

- La base de datos SQLite (`backend/data/admision.db`) **NO** debe subirse a Git
- Está configurada en `.gitignore`
- Mantener backups regulares

### Permisos

```bash
# Verificar permisos del proyecto
ls -la /opt/Uniacc-dashboard-admision

# Si hay problemas, reconfigurar:
sudo chown -R cl159906175:nimbi /opt/Uniacc-dashboard-admision
sudo chmod -R 755 /opt/Uniacc-dashboard-admision
```

---

## 📞 URLs Importantes

- **Backend API:** http://localhost:3001
- **Frontend:** http://localhost:4173 (o http://172.16.0.206:4173)
- **Health Check:** http://localhost:3001/api/health
- **PM2 Plus Dashboard:** https://app.pm2.io/
- **Repositorio GitHub:** https://github.com/jpuniacc/Uniacc-dashboard-admision

---

## ✅ Checklist de Actualización

Antes de actualizar, verifica:

- [ ] Backup de la base de datos (si es necesario)
- [ ] Servicios corriendo correctamente (`pm2 list`)
- [ ] Logs sin errores críticos
- [ ] Espacio en disco suficiente
- [ ] Acceso a Git configurado

Después de actualizar, verifica:

- [ ] `pm2 list` muestra todos los procesos online
- [ ] `curl http://localhost:3001/api/health` responde OK
- [ ] Frontend carga correctamente
- [ ] Logs sin errores nuevos
- [ ] Funcionalidad principal funciona

---

## 📖 Documentación Adicional

- **Manual de Administración:** `ADMINISTRACION.md`
- **Manual de Actualización:** `MANUAL_ACTUALIZACION.md`
- **Comparación de Gestores:** `COMPARACION_GESTORES.md`
- **Backend README:** `backend/README.md`

---

**Última actualización:** 2025-12-19

