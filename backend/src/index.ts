import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import postulantesRoutes from './routes/postulantes.routes'
import desistimientoRoutes from './routes/desistimiento.routes'
import { getConnection } from './config/database'
import './config/sqlite' // Inicializar SQLite
import { schedulerService } from './services/scheduler.service'
import { EmailService } from './services/email.service'
import { formatChileTime } from './utils/date.utils'

// Cargar variables de entorno
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../.env') })

const app: Application = express()
const PORT = process.env.PORT || 3001

// Middlewares
// Configurar CORS para permitir múltiples orígenes
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173', 'http://172.16.0.206:4173']

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origen (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true)
    } else {
      callback(null, true) // Permitir todos por ahora, ajustar según necesidad
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware de logging
app.use((req: Request, res: Response, next) => {
  console.log(`${formatChileTime()} - ${req.method} ${req.path}`)
  next()
})

// Rutas
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'API de Postulantes funcionando correctamente',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/postulantes', postulantesRoutes)
app.use('/api/postulantes', desistimientoRoutes)

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Manejo de errores global
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error no manejado:', err)
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  })
})

// Iniciar servidor
async function startServer() {
  try {
    // Verificar conexión a base de datos
    await getConnection()
    console.log('✅ Conexión a base de datos establecida')

    // Verificar conexión SMTP (opcional, no bloquea el inicio)
    const emailService = new EmailService()
    emailService.verificarConexion().catch(() => {
      console.warn('⚠️ No se pudo verificar conexión SMTP, pero el servidor continuará')
    })

    // Inicializar scheduler
    schedulerService.start()

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📊 API endpoints disponibles:`)
      console.log(`   - GET    /api/health`)
      console.log(`   - GET    /api/postulantes`)
      console.log(`   - GET    /api/postulantes/:id`)
      console.log(`   - GET    /api/postulantes/stats`)
      console.log(`   - POST   /api/postulantes/refresh`)
      console.log(`   - POST   /api/postulantes/:id/notificar`)
      console.log(`   - GET    /api/postulantes/export`)
      console.log(`   - POST   /api/postulantes/:codint/desistir`)
      console.log(`   - DELETE /api/postulantes/:codint/desistir`)
      console.log(`   - PUT    /api/postulantes/:codint/estado-seguimiento`)
      console.log(`   - GET    /api/postulantes/:codint/historial-estados`)
    })
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

startServer()

