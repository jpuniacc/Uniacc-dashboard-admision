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
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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
    })
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

startServer()

