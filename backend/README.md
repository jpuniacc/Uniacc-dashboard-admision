# Backend API - Sistema de Postulantes

Backend Node.js/Express con TypeScript para el sistema de gestión de postulantes.

## Características

- ✅ API RESTful con Express y TypeScript
- ✅ Conexión a SQL Server con `mssql`
- ✅ Paginación y filtros avanzados
- ✅ Exportación de datos (CSV/JSON)
- ✅ Estadísticas en tiempo real
- ✅ CORS configurado
- ✅ Manejo de errores centralizado
- ✅ Sistema de notificaciones por correo para nuevos postulantes
- ✅ Actualización automática cada hora (Lun-Sáb, 07:00-23:00)

## Requisitos

- Node.js 18+ o superior
- SQL Server con acceso a la tabla `MT_INTERE`
- npm o yarn

## Instalación

```bash
cd backend
npm install
```

## Configuración

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# Configuración del servidor
PORT=3001
NODE_ENV=development

# Configuración de SQL Server
DB_SERVER=tu-servidor-sql.database.windows.net
DB_DATABASE=tu-base-datos
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false

# CORS
CORS_ORIGIN=http://localhost:5173

# Configuración SMTP para notificaciones por correo
SMTP_HOST=172.16.0.170
SMTP_PORT=25
SMTP_FROM=noreply@tudominio.cl
SMTP_FROM_NAME=Sistema de Postulantes UNIACC
EMAIL_RECIPIENTS=email1@dominio.com,email2@dominio.com
```

### Nota sobre SQL Server

Si estás usando SQL Server local (no Azure), ajusta las siguientes variables:

```env
DB_SERVER=localhost
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

## Desarrollo

Ejecutar en modo desarrollo (con hot reload):

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## Producción

Compilar TypeScript a JavaScript:

```bash
npm run build
```

Ejecutar el servidor compilado:

```bash
npm start
```

## Endpoints API

### GET /api/health

Verificar estado del servidor

### GET /api/postulantes

Obtener lista de postulantes con paginación y filtros

**Query params:**

- `page` (number): Número de página (default: 1)
- `limit` (number): Registros por página (default: 20)
- `search` (string): Búsqueda por RUT, nombre o apellido
- `carrera` (string): Filtrar por carrera
- `fechaDesde` (string): Fecha desde (formato: YYYY-MM-DD)
- `fechaHasta` (string): Fecha hasta (formato: YYYY-MM-DD)
- `sexo` (string): Filtrar por sexo (M/F)

**Respuesta:**

```json
{
  "data": [...],
  "total": 1234,
  "page": 1,
  "limit": 20,
  "totalPages": 62
}
```

### GET /api/postulantes/:id

Obtener detalle de un postulante específico

### GET /api/postulantes/stats

Obtener estadísticas generales

**Respuesta:**

```json
{
  "total": 1234,
  "porCarrera": [
    { "carrera": "INGENIERÍA", "count": 150 }
  ],
  "porMes": [
    { "mes": "2024-12", "count": 45 }
  ],
  "nuevosHoy": 5,
  "nuevosEstaSemana": 32
}
```

### GET /api/postulantes/export

Exportar datos con filtros

**Query params:**

- `format` (string): Formato de exportación ('csv' o 'json', default: 'csv')
- Mismo filtros que el endpoint de lista

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuración SQL Server
│   ├── controllers/
│   │   └── postulantes.controller.ts
│   ├── services/
│   │   └── postulantes.service.ts
│   ├── routes/
│   │   └── postulantes.routes.ts
│   ├── types/
│   │   └── postulante.types.ts  # Interfaces TypeScript
│   └── index.ts                 # Punto de entrada
├── package.json
├── tsconfig.json
└── .env
```

## Sistema de Notificaciones por Correo

El sistema envía automáticamente correos cuando se detectan nuevos postulantes.

### Configuración

1. **Configurar variables de entorno SMTP** en el archivo `.env`:
   ```env
   SMTP_HOST=172.16.0.170
   SMTP_PORT=25
   SMTP_FROM=noreply@tudominio.cl
   SMTP_FROM_NAME=Sistema de Postulantes UNIACC
   EMAIL_RECIPIENTS=email1@dominio.com,email2@dominio.com
   ```

2. **Destinatarios**: Separa múltiples correos con comas en `EMAIL_RECIPIENTS`

### Funcionamiento

- **Detección automática**: Durante la actualización automática cada hora, el sistema detecta nuevos postulantes comparando con los ya notificados
- **Envío asíncrono**: Los correos se envían de forma asíncrona para no bloquear el scheduler
- **Reintentos**: Si falla el envío, el postulante no se marca como notificado y se reintentará en la próxima ejecución
- **Tracking**: Se usa SQLite para mantener un registro de postulantes ya notificados

### Contenido del Correo

El correo incluye:
- RUT completo
- Nombre completo
- Código de carrera
- Nombre de carrera
- Fecha de postulación
- Email de contacto
- Teléfono de contacto

### Endpoint Manual

Para reenviar una notificación manualmente:
```bash
POST /api/postulantes/:id/notificar
```

## Solución de Problemas

### Error de conexión a SQL Server

1. Verifica que el servidor SQL Server esté accesible
2. Revisa las credenciales en el archivo `.env`
3. Para SQL Server local, asegúrate de tener `DB_ENCRYPT=false` y `DB_TRUST_SERVER_CERTIFICATE=true`

### Error de CORS

Ajusta la variable `CORS_ORIGIN` en `.env` para que coincida con la URL de tu frontend.

### Puerto en uso

Si el puerto 3001 está en uso, cámbialo en el archivo `.env`:

```env
PORT=3002
```

## Licencia

MIT
