# 🔄 Comparación de Gestores de Procesos

## 📊 Tabla Comparativa

| Característica | PM2 | Systemd | Forever | Supervisor | Docker |
|---------------|-----|---------|---------|------------|--------|
| **Dificultad** | ⭐⭐ Fácil | ⭐⭐⭐ Medio | ⭐ Muy Fácil | ⭐⭐ Fácil | ⭐⭐⭐⭐ Avanzado |
| **Reinicio automático** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Logs integrados** | ✅ Excelente | ✅ Bueno | ⚠️ Básico | ✅ Bueno | ✅ |
| **Monitoreo** | ✅ Avanzado | ⚠️ Básico | ❌ | ⚠️ Básico | ⚠️ Básico |
| **Clustering** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Inicio al arranque** | ✅ | ✅ | ⚠️ Manual | ✅ | ✅ |
| **Interfaz web** | ✅ | ❌ | ❌ | ⚠️ Básico | ❌ |
| **Uso de recursos** | Medio | Bajo | Bajo | Bajo | Alto |
| **Recomendado para** | Node.js | Linux nativo | Simple | Python/Node | Contenedores |

## 🎯 PM2 (Recomendado para Node.js)

### Ventajas
- ✅ Diseñado específicamente para Node.js
- ✅ Interfaz web de monitoreo (pm2-web)
- ✅ Clustering y balanceo de carga
- ✅ Gestión de logs avanzada
- ✅ Fácil de usar
- ✅ Hot reload en desarrollo

### Desventajas
- ⚠️ Requiere instalación adicional
- ⚠️ Consume más recursos que systemd

### Instalación y Uso
```bash
# Instalar
npm install -g pm2
# O usar el script:
./scripts/pm2-install.sh

# Iniciar
pm2 start ecosystem.config.js
# O usar el script:
./scripts/pm2-start.sh

# Comandos útiles
pm2 list                    # Ver procesos
pm2 logs uniacc-backend      # Ver logs
pm2 monit                    # Monitor en tiempo real
pm2 stop uniacc-backend      # Detener
pm2 restart uniacc-backend   # Reiniciar
pm2 delete uniacc-backend    # Eliminar
pm2 save                     # Guardar configuración
pm2 startup                  # Configurar inicio automático
pm2 startup systemd          # Para systemd
```

## ⚙️ Systemd (Ya configurado)

### Ventajas
- ✅ Nativo de Linux, no requiere instalación
- ✅ Muy estable y confiable
- ✅ Integrado con el sistema
- ✅ Bajo consumo de recursos
- ✅ Gestión de dependencias

### Desventajas
- ⚠️ Más complejo de configurar
- ⚠️ No tiene interfaz web
- ⚠️ Menos características específicas para Node.js

### Uso
```bash
# Instalar servicio
sudo cp scripts/uniacc-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable uniacc-backend

# Gestionar
sudo systemctl start uniacc-backend
sudo systemctl stop uniacc-backend
sudo systemctl restart uniacc-backend
sudo systemctl status uniacc-backend
sudo journalctl -u uniacc-backend -f
```

## 🔄 Forever

### Ventajas
- ✅ Muy simple de usar
- ✅ Ligero
- ✅ Bueno para scripts simples

### Desventajas
- ❌ Sin monitoreo avanzado
- ❌ Sin clustering
- ❌ Logs básicos
- ❌ Menos mantenido

### Instalación y Uso
```bash
# Instalar
npm install -g forever

# Iniciar
forever start -c "node" backend/dist/index.js

# O con configuración
forever start forever.json

# Ver procesos
forever list

# Detener
forever stop uniacc-backend

# Logs
forever logs uniacc-backend
```

## 👨‍💼 Supervisor

### Ventajas
- ✅ Bueno para múltiples procesos
- ✅ Configuración simple
- ✅ Logs organizados

### Desventajas
- ⚠️ Más orientado a Python
- ⚠️ Menos características para Node.js

### Instalación y Uso
```bash
# Instalar (Ubuntu/Debian)
sudo apt-get install supervisor

# Copiar configuración
sudo cp supervisord.conf /etc/supervisor/conf.d/uniacc-backend.conf

# Recargar y iniciar
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start uniacc-backend

# Gestionar
sudo supervisorctl status
sudo supervisorctl restart uniacc-backend
sudo supervisorctl stop uniacc-backend
```

## 🐳 Docker + Docker Compose

### Ventajas
- ✅ Aislamiento completo
- ✅ Portabilidad
- ✅ Fácil escalado
- ✅ Gestión de dependencias

### Desventajas
- ⚠️ Requiere Docker instalado
- ⚠️ Más complejo
- ⚠️ Mayor uso de recursos

### Uso
```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 💡 Recomendación

### Para Producción Node.js:
1. **PM2** - Si quieres características avanzadas y monitoreo
2. **Systemd** - Si prefieres algo nativo y estable

### Para Simplicidad:
- **Forever** - Si solo necesitas reinicio automático

### Para Múltiples Procesos:
- **Supervisor** - Si manejas varios servicios

### Para Contenedores:
- **Docker** - Si ya usas contenedores

## 🚀 Inicio Rápido con PM2

```bash
# 1. Instalar PM2
./scripts/pm2-install.sh

# 2. Compilar proyecto
./scripts/build.sh

# 3. Iniciar con PM2
./scripts/pm2-start.sh

# 4. Configurar inicio automático
pm2 save
pm2 startup systemd
# (ejecutar el comando que te muestre)

# 5. Verificar
pm2 list
pm2 logs uniacc-backend
```

