# Sistema de Gestión de Postulantes - Guía Completa

Este documento describe cómo configurar, ejecutar y usar el sistema completo de gestión de postulantes.

## 📋 Descripción General

El sistema consta de dos partes:

1. **Backend API** (Node.js/Express + TypeScript + SQL Server + SQLite)
2. **Frontend** (Vue 3 + TypeScript + Tailwind CSS + shadcn-vue)

## 🚀 Inicio Rápido

### 1. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en `backend/`:

```env
# Servidor
PORT=3001
NODE_ENV=development

# SQL Server
DB_SERVER=tu-servidor-sql
DB_DATABASE=tu-base-datos
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false

# CORS
CORS_ORIGIN=http://localhost:5173

# SMTP (Opcional - para notificaciones por correo)
SMTP_HOST=smtp.tu-servidor.com
SMTP_PORT=25
SMTP_FROM=noreply@uniacc.cl
SMTP_FROM_NAME=Sistema de Postulantes UNIACC
EMAIL_RECIPIENTS=admin@uniacc.cl,otro@uniacc.cl
```

Iniciar el backend:

```bash
npm run dev
```

### 2. Configurar Frontend

```bash
# En la raíz del proyecto
npm install
```

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3001
```

Iniciar el frontend:

```bash
npm run dev
```

## 📊 Características del Sistema

### Backend API

- ✅ **Paginación**: Manejo eficiente de grandes volúmenes de datos
- ✅ **Filtros avanzados**: Por RUT, nombre, carrera, estado, comuna, fechas, etc.
- ✅ **Búsqueda**: Búsqueda en tiempo real por múltiples campos
- ✅ **Exportación**: Descarga de datos en formato CSV o JSON
- ✅ **Estadísticas**: Métricas y análisis en tiempo real
- ✅ **Validación**: Validación de parámetros y prevención de SQL injection
- ✅ **Sistema de notificaciones**: Envío automático de correos para nuevos postulantes
- ✅ **Detección automática**: Tracking de nuevos postulantes usando SQLite
- ✅ **Scheduler automático**: Actualización de datos cada hora (Lun-Sáb, 07:00-23:00)
- ✅ **Template HTML**: Correos con diseño profesional y responsive

### Frontend

- ✅ **Dashboard moderno**: Interfaz limpia y profesional
- ✅ **Tabla interactiva**: Visualización optimizada con ordenamiento
- ✅ **Filtros dinámicos**: Múltiples criterios de búsqueda con diseño responsive
- ✅ **Vista de detalle**: Modal con toda la información del postulante
- ✅ **Estadísticas visuales**: Cards y gráficos de barras (Top 10 carreras)
- ✅ **Exportación**: Descarga de datos filtrados
- ✅ **Responsive**: Funciona perfectamente en móviles y tablets
- ✅ **Feedback visual**: Toasts, loading states, y estados vacíos
- ✅ **Indicador de actualización**: Muestra próxima actualización automática
- ✅ **Botón de actualización manual**: Refrescar datos cuando sea necesario
- ✅ **Notificaciones por correo**: Botón para enviar notificación manual desde la tabla

## 🗂️ Estructura del Proyecto

```
uniacc-admision/
├── backend/                    # API Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts     # Conexión SQL Server
│   │   │   └── sqlite.ts       # Configuración SQLite para tracking
│   │   ├── controllers/
│   │   │   └── postulantes.controller.ts
│   │   ├── services/
│   │   │   ├── postulantes.service.ts
│   │   │   ├── email.service.ts          # Servicio de correo
│   │   │   ├── scheduler.service.ts      # Scheduler automático
│   │   │   └── postulantes-tracking.service.ts  # Tracking de notificaciones
│   │   ├── routes/
│   │   │   └── postulantes.routes.ts
│   │   ├── types/
│   │   │   └── postulante.types.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── src/                        # Frontend Vue
│   ├── components/
│   │   ├── Postulantes/
│   │   │   ├── PostulantesFiltros.vue    # Filtros responsive
│   │   │   ├── PostulantesStats.vue      # Estadísticas y gráficos
│   │   │   ├── PostulanteDetalle.vue     # Modal de detalle
│   │   │   └── EstadoPostulacionTimeline.vue
│   │   └── ui/                 # shadcn-vue components
│   ├── composables/
│   │   ├── usePostulantes.ts   # API calls
│   │   ├── useAutoRefresh.ts   # Auto-refresh de datos
│   │   └── utils.ts
│   ├── stores/
│   │   ├── postulantes.ts      # Pinia store
│   │   └── app.ts
│   ├── types/
│   │   └── postulante.ts       # TypeScript interfaces
│   ├── views/
│   │   └── Dashboard/
│   │       ├── DashboardView.vue
│   │       ├── PostulantesView.vue
│   │       └── HomeView.vue
│   └── router/
│       └── index.ts
│
└── package.json
```

## 🔌 Endpoints API

### GET /api/postulantes

Lista paginada con filtros

**Parámetros:**

- `page`: Número de página (default: 1)
- `limit`: Registros por página (default: 20)
- `search`: Búsqueda en RUT/nombre/apellido
- `carrera`: Filtrar por carrera
- `estado`: Filtrar por estado (pendiente, en_espera, aprobado, matriculado, desistido)
- `ano`: Año de postulación
- `comuna`: Filtrar por comuna
- `sexo`: Filtrar por sexo (M/F)
- `fechaDesde`: Fecha inicio (YYYY-MM-DD)
- `fechaHasta`: Fecha fin (YYYY-MM-DD)

**Ejemplo:**

```
GET /api/postulantes?page=1&limit=20&search=juan&carrera=ingenieria&estado=pendiente
```

### GET /api/postulantes/:id

Detalle de un postulante específico

### GET /api/postulantes/stats

Estadísticas generales

### GET /api/postulantes/export

Exportar datos

**Parámetros:**

- `format`: csv o json (default: csv)
- Mismos filtros que el endpoint de lista

### POST /api/postulantes/refresh

Actualización manual de datos (fuera del horario programado)

### POST /api/postulantes/:id/notificar

Enviar notificación por correo para un postulante específico

**Respuesta:**

```json
{
  "success": true,
  "message": "Notificación enviada correctamente",
  "data": {
    "codint": "12345",
    "fechaNotificacion": "2026-01-15T10:30:00.000Z"
  }
}
```

## 📧 Sistema de Notificaciones por Correo

### Configuración SMTP

El sistema utiliza SMTP sin autenticación para enviar correos. Configura las siguientes variables en `backend/.env`:

```env
# Configuración SMTP
SMTP_HOST=smtp.tu-servidor.com
SMTP_PORT=25
SMTP_FROM=noreply@uniacc.cl
SMTP_FROM_NAME=Sistema de Postulantes UNIACC

# Destinatarios (separados por comas)
EMAIL_RECIPIENTS=admin@uniacc.cl,otro@uniacc.cl
```

### Funcionamiento Automático

1. **Detección de nuevos postulantes**: El sistema usa SQLite para mantener un registro de postulantes ya notificados
2. **Scheduler automático**: Cada hora (Lun-Sáb, 07:00-23:00), el sistema:
   - Actualiza los datos desde SQL Server
   - Detecta nuevos postulantes comparando con la base SQLite
   - Envía correos de notificación para cada nuevo postulante
   - Marca los postulantes como notificados en SQLite
3. **Template HTML**: Los correos incluyen un diseño profesional con:
   - Información completa del postulante
   - RUT, nombre completo, carrera de interés
   - Fecha de postulación
   - Datos de contacto (email y teléfono)
   - Diseño responsive

### Notificación Manual

Puedes enviar una notificación manualmente desde:

1. **Frontend**: Click en el botón de correo (📧) en la tabla de postulantes
2. **API**: `POST /api/postulantes/:id/notificar`

El sistema marcará automáticamente el postulante como notificado después del envío exitoso.

### Tracking de Notificaciones

El sistema utiliza SQLite (`backend/data/tracking.db`) para:

- Registrar qué postulantes ya fueron notificados
- Evitar envíos duplicados
- Mantener un historial de notificaciones

La tabla `postulantes_notificados` contiene:
- `codint`: Código interno del postulante (PRIMARY KEY)
- `fecha_notificacion`: Timestamp de cuando se envió la notificación

## ⏰ Scheduler Automático

El sistema incluye un scheduler que actualiza los datos automáticamente:

- **Frecuencia**: Cada hora
- **Horario**: Lunes a Sábado, 07:00 - 23:00 (horario laboral)
- **Zona horaria**: America/Santiago
- **Funciones**:
  - Actualiza datos desde SQL Server
  - Calcula estadísticas
  - Detecta nuevos postulantes
  - Envía notificaciones por correo

El scheduler se inicia automáticamente cuando el backend arranca. Puedes ver los logs en la consola del backend para monitorear su funcionamiento.

### Indicador en Frontend

El frontend muestra un indicador visual que informa:
- Tiempo restante hasta la próxima actualización
- Si está fuera del horario laboral, muestra cuándo será la próxima actualización
- Mensaje "Actualizando..." cuando está en proceso

## 🎨 Uso del Sistema

### 1. Ver Postulantes

1. Navega a "Postulantes" en el menú
2. La lista se carga automáticamente
3. Usa la paginación para navegar entre páginas

### 2. Buscar y Filtrar

1. Escribe en el campo de búsqueda (RUT sin puntos ni guión, nombre o apellido)
2. Aplica filtros adicionales:
   - **Carrera**: Búsqueda por nombre de carrera
   - **Estado**: Dropdown con estados (Pendiente, En Espera, Aprobado, Matriculado, Desistido)
   - **Año de Postulación**: Dropdown con años disponibles
3. Click en "Buscar" o presiona Enter
4. Click en "Limpiar" para resetear filtros

**Nota**: Los filtros son completamente responsive:
- Pantallas pequeñas: 1 columna (apilados verticalmente)
- Pantallas medianas: 2 columnas
- Pantallas grandes: 3 columnas

### 3. Ver Detalle

1. Click en el ícono de ojo (👁️) en la fila del postulante
2. Se abre un modal con toda la información:
   - Datos personales
   - Datos de contacto
   - Información académica
   - Carreras de interés
   - Estados de postulación con timeline
   - Observaciones

### 4. Enviar Notificación por Correo

1. Click en el botón de correo (📧) en la fila del postulante
2. El sistema enviará un correo con la información del postulante
3. Se mostrará una notificación toast confirmando el envío
4. El postulante quedará marcado como notificado

### 5. Exportar Datos

1. Click en "Exportar" en el encabezado
2. Se descargan los registros con los filtros aplicados
3. El archivo incluye todos los campos en formato CSV o JSON

### 6. Ver Estadísticas

En la parte superior se muestran:

- **Total de postulantes**: Contador general
- **Nuevos hoy**: Postulantes registrados hoy
- **Esta semana**: Postulantes de los últimos 7 días
- **Carrera Top**: La carrera con más postulaciones
- **Matriculados**: Total y desglose (1ª opción vs otras opciones)
- **Gráfico Top 10**: Visualización de las 10 carreras más populares con barras de progreso

### 7. Actualizar Datos Manualmente

1. Click en el botón "Actualizar" en el encabezado
2. El sistema refrescará los datos desde SQL Server
3. Se mostrará un indicador de carga durante el proceso

## 🔧 Configuración SQL Server

### SQL Server Local

```env
DB_SERVER=localhost
DB_DATABASE=tu_base_datos
DB_USER=sa
DB_PASSWORD=tu_password
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

### SQL Server Azure

```env
DB_SERVER=tu-servidor.database.windows.net
DB_DATABASE=tu_base_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

## 📱 Responsive Design

El sistema está completamente optimizado para:

- 💻 **Desktop** (1920px+) - Layout completo con todas las columnas
- 💻 **Laptop** (1366px+) - Layout adaptado
- 📱 **Tablet** (768px+) - Grid de 2 columnas, menú colapsable
- 📱 **Mobile** (320px+) - Layout vertical, filtros apilados

### Mejoras de Responsive

Los filtros incluyen correcciones especiales para evitar problemas de superposición:

- **Z-index management**: Los dropdowns tienen z-index apropiados para aparecer sobre otros elementos
- **Overflow visible**: Los contenedores permiten que los dropdowns se muestren correctamente
- **Grid responsive**: Los filtros se adaptan automáticamente al tamaño de pantalla
- **Espaciado**: Margen adecuado entre componentes para evitar solapamientos

## 🐛 Solución de Problemas

### Backend no conecta a SQL Server

1. Verifica las credenciales en `backend/.env`
2. Asegúrate de que SQL Server permite conexiones remotas
3. Revisa el firewall y puertos
4. Para SQL Server local, usa `DB_ENCRYPT=false` y `DB_TRUST_SERVER_CERTIFICATE=true`

### Frontend no se conecta al Backend

1. Verifica que el backend esté corriendo en `http://localhost:3001`
2. Revisa la variable `VITE_API_URL` en el `.env` del frontend
3. Verifica la consola del navegador para errores CORS

### Error de CORS

Ajusta `CORS_ORIGIN` en el `.env` del backend para que coincida con la URL del frontend.

### No se muestran datos

1. Verifica que la tabla `MT_INTERE` existe en SQL Server
2. Verifica que hay registros con `ANO=2026` y `POSTULACION='SI'`
3. Revisa los logs del backend para errores SQL

### Los correos no se envían

1. Verifica la configuración SMTP en `backend/.env`
2. Asegúrate de que `SMTP_HOST` y `SMTP_PORT` son correctos
3. Verifica que `EMAIL_RECIPIENTS` tiene al menos un destinatario
4. Revisa los logs del backend para errores de conexión SMTP
5. Para servidores SMTP internos, el sistema está configurado para no requerir autenticación

### Dropdowns se superponen en responsive

El sistema incluye correcciones de z-index y overflow. Si persiste el problema:

1. Verifica que los componentes tienen las clases `overflow-visible` y z-index apropiados
2. Asegúrate de que no hay conflictos de CSS personalizado
3. Revisa la consola del navegador para errores

### El scheduler no funciona

1. Verifica que el backend está corriendo
2. Revisa los logs del backend para mensajes del scheduler
3. Asegúrate de que la zona horaria está configurada correctamente (America/Santiago)
4. El scheduler solo funciona en horario laboral (Lun-Sáb, 07:00-23:00)

## 🚀 Despliegue a Producción

### Backend

```bash
cd backend
npm run build
npm start
```

**Importante**: Asegúrate de configurar todas las variables de entorno en producción, especialmente:
- Credenciales de SQL Server
- Configuración SMTP
- Destinatarios de correo
- CORS origin correcto

### Frontend

```bash
npm run build
```

Los archivos compilados estarán en `dist/` listos para servir con cualquier servidor estático (nginx, Apache, etc.).

**Importante**: Configura `VITE_API_URL` con la URL del backend en producción antes de hacer el build.

## 📝 Notas Adicionales

- El sistema consulta la tabla `MT_INTERE` filtrada por `ANO=2026` y `POSTULACION='SI'`
- La paginación está optimizada para manejar miles de registros
- Las estadísticas se cachean para mejor performance
- El sistema usa TypeScript en ambos lados para máxima seguridad de tipos
- Los componentes UI son de shadcn-vue, altamente personalizables
- El tracking de notificaciones usa SQLite local (no requiere configuración adicional)
- Los correos incluyen template HTML responsive y profesional
- El scheduler respeta el horario laboral y no ejecuta en domingos o fuera de horario

## 🔐 Seguridad

- **SQL Injection**: Todas las consultas usan parámetros preparados
- **Validación de entrada**: Los parámetros se validan antes de ejecutar queries
- **CORS**: Configurado para permitir solo orígenes específicos
- **SMTP**: Configurado para servidores internos sin autenticación (ajustar según necesidades)

## 🆘 Soporte

Para problemas o dudas:

1. Revisa los logs del backend y frontend
2. Verifica la configuración de `.env`
3. Revisa la documentación de cada módulo
4. Consulta el README.md principal para información general

## 📄 Licencia

MIT
