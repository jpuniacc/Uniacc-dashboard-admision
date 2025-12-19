# 🎓 Sistema de Gestión de Postulantes UNIACC

Sistema completo de gestión y seguimiento de postulantes para el proceso de admisión 2026 de UNIACC. Incluye dashboard interactivo, filtros avanzados, estadísticas en tiempo real y sistema de notificaciones por correo.

## ✨ Características Principales

### Frontend (Vue 3 + TypeScript)
- ✅ **Dashboard moderno** con diseño responsive y profesional
- ✅ **Tabla interactiva** de postulantes con paginación optimizada
- ✅ **Filtros avanzados** por RUT, nombre, carrera, estado, año, comuna, sexo
- ✅ **Búsqueda en tiempo real** con múltiples criterios
- ✅ **Vista de detalle** completa del postulante en modal
- ✅ **Estadísticas visuales** con cards y gráfico de top 10 carreras
- ✅ **Exportación de datos** en formato CSV o JSON
- ✅ **Sistema de notificaciones** por correo electrónico
- ✅ **Actualización automática** de datos cada hora
- ✅ **Diseño responsive** optimizado para móviles, tablets y desktop

### Backend (Node.js + Express + TypeScript)
- ✅ **API RESTful** completa con Express y TypeScript
- ✅ **Conexión a SQL Server** con pool de conexiones optimizado
- ✅ **Paginación eficiente** para grandes volúmenes de datos
- ✅ **Filtros y búsqueda** avanzada con validación de parámetros
- ✅ **Exportación de datos** en múltiples formatos
- ✅ **Estadísticas en tiempo real** con cacheo inteligente
- ✅ **Sistema de notificaciones** por correo (SMTP sin autenticación)
- ✅ **Scheduler automático** para actualización de datos (Lun-Sáb, 07:00-23:00)
- ✅ **Detección de nuevos postulantes** con tracking en SQLite
- ✅ **Prevención de SQL injection** y validación de entrada

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ o superior
- SQL Server con acceso a la tabla `MT_INTERE`
- npm o yarn

### 1. Instalar Dependencias

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..
```

### 2. Configurar Backend

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

# SMTP (Opcional - para notificaciones)
SMTP_HOST=smtp.tu-servidor.com
SMTP_PORT=25
SMTP_FROM=noreply@uniacc.cl
SMTP_TO=admin@uniacc.cl
```

### 3. Configurar Frontend

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Ejecutar el Sistema

```bash
# Terminal 1: Iniciar backend
cd backend
npm run dev

# Terminal 2: Iniciar frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:3001`.

## 📁 Estructura del Proyecto

```
uniacc-admision/
├── backend/                    # API Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts     # Conexión SQL Server
│   │   ├── controllers/
│   │   │   └── postulantes.controller.ts
│   │   ├── services/
│   │   │   ├── postulantes.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── postulantes-tracking.service.ts
│   │   ├── routes/
│   │   │   └── postulantes.routes.ts
│   │   ├── types/
│   │   │   └── postulante.types.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md               # Documentación del backend
│
├── src/                        # Frontend Vue
│   ├── components/
│   │   ├── Postulantes/
│   │   │   ├── PostulantesFiltros.vue    # Filtros con diseño responsive
│   │   │   ├── PostulantesStats.vue      # Estadísticas y gráficos
│   │   │   ├── PostulanteDetalle.vue     # Modal de detalle
│   │   │   └── EstadoPostulacionTimeline.vue
│   │   └── ui/                 # Componentes shadcn-vue
│   ├── composables/
│   │   ├── usePostulantes.ts   # Llamadas a la API
│   │   └── useAutoRefresh.ts   # Auto-refresh de datos
│   ├── stores/
│   │   ├── postulantes.ts      # Store Pinia principal
│   │   └── app.ts
│   ├── types/
│   │   └── postulante.ts       # Interfaces TypeScript
│   ├── views/
│   │   └── Dashboard/
│   │       ├── DashboardView.vue
│   │       ├── PostulantesView.vue
│   │       └── HomeView.vue
│   └── router/
│       └── index.ts
│
├── package.json
├── README.md                   # Este archivo
└── SISTEMA_POSTULANTES.md      # Documentación completa del sistema
```

## 🎨 Tecnologías Utilizadas

### Frontend
- **Vue 3** con Composition API y `<script setup>`
- **TypeScript** para type safety
- **Pinia** para gestión de estado
- **Vue Router** con lazy loading
- **shadcn-vue** + **Tailwind CSS** para UI moderna
- **Lucide Icons** para iconografía
- **Vite** para desarrollo rápido
- **Vue Sonner** para notificaciones toast
- **@vueuse/core** para utilidades composables

### Backend
- **Node.js** + **Express** para el servidor
- **TypeScript** para type safety
- **mssql** para conexión a SQL Server
- **nodemailer** para envío de correos
- **node-cron** para tareas programadas
- **better-sqlite3** para tracking de notificaciones

## 📊 Funcionalidades Principales

### Gestión de Postulantes
- Visualización de lista paginada con todos los postulantes
- Búsqueda por RUT (sin puntos ni guión), nombre o apellido
- Filtros por carrera, estado, año de postulación, comuna, sexo
- Vista detallada con toda la información del postulante
- Timeline de estados de postulación
- Exportación de datos filtrados

### Estadísticas
- Total de postulantes registrados
- Nuevos postulantes del día
- Nuevos postulantes de la semana
- Carrera más popular
- Gráfico de top 10 carreras con más postulaciones
- Estadísticas de matriculados (1ª opción vs otras opciones)

### Notificaciones
- Detección automática de nuevos postulantes
- Envío de correos electrónicos con información del postulante
- Tracking de notificaciones enviadas (SQLite)
- Endpoint manual para reenvío de notificaciones
- Template HTML para correos

### Actualización Automática
- Scheduler que actualiza datos cada hora
- Horario: Lunes a Sábado, 07:00 - 23:00
- Indicador visual de próxima actualización
- Botón manual de actualización

## 🔌 API Endpoints

### GET /api/postulantes
Lista paginada de postulantes con filtros

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

### GET /api/postulantes/:codint
Detalle completo de un postulante específico

### GET /api/postulantes/stats
Estadísticas generales del sistema

### GET /api/postulantes/export
Exportar datos en CSV o JSON

**Parámetros:**
- `format`: csv o json (default: csv)
- Mismos filtros que el endpoint de lista

### POST /api/postulantes/:codint/notificar
Enviar notificación por correo para un postulante específico

## 🎨 Componentes UI

El proyecto utiliza componentes de **shadcn-vue**:

- `Button` - Botones con variantes
- `Card` - Tarjetas contenedoras
- `Input` - Campos de entrada
- `Table` - Tablas responsivas
- `Dialog` - Modales
- `Badge` - Etiquetas de estado
- `Toast` - Notificaciones toast
- Y más...

Ver documentación completa: [shadcn-vue.com](https://www.shadcn-vue.com/)

## 📱 Diseño Responsive

El sistema está completamente optimizado para:

- 💻 **Desktop** (1920px+) - Layout completo con todas las columnas
- 💻 **Laptop** (1366px+) - Layout adaptado
- 📱 **Tablet** (768px+) - Grid de 2 columnas, menú colapsable
- 📱 **Mobile** (320px+) - Layout vertical, filtros apilados

Los filtros se adaptan automáticamente:
- Pantallas pequeñas: 1 columna (apilados verticalmente)
- Pantallas medianas: 2 columnas
- Pantallas grandes: 3 columnas

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Ejecutar linter
npm run format     # Formatear código
npm run type-check # Verificar tipos TypeScript
```

### Backend
```bash
cd backend
npm run dev        # Servidor de desarrollo con hot reload
npm run build      # Compilar TypeScript
npm start          # Ejecutar producción
```

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

### Dropdowns se superponen en responsive
El sistema incluye correcciones de z-index y overflow para evitar que los dropdowns se superpongan. Si persiste el problema, verifica que los componentes tengan las clases `overflow-visible` y z-index apropiados.

## 🚀 Despliegue a Producción

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
npm run build
```

Los archivos compilados estarán en `dist/` listos para servir con cualquier servidor estático (nginx, Apache, etc.).

## 📝 Documentación Adicional

Para información más detallada sobre:
- Configuración avanzada
- Estructura de la base de datos
- Uso del sistema
- API completa

Consulta: **[SISTEMA_POSTULANTES.md](./SISTEMA_POSTULANTES.md)**

Para documentación del backend: **[backend/README.md](./backend/README.md)**

## 📄 Licencia

MIT

## 👥 Contribuidores

Sistema desarrollado para UNIACC - Proceso de Admisión 2026
