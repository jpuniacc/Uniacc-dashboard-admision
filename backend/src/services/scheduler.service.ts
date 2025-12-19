import cron from 'node-cron'
import { PostulantesService } from './postulantes.service'
import { PostulantesTrackingService } from './postulantes-tracking.service'
import { EmailService } from './email.service'
import { formatChileTime } from '../utils/date.utils'

export class SchedulerService {
  private postulantesService: PostulantesService
  private trackingService: PostulantesTrackingService
  private emailService: EmailService
  private cronJob: cron.ScheduledTask | null = null
  private lastExecution: Date | null = null

  constructor() {
    this.postulantesService = new PostulantesService()
    this.trackingService = new PostulantesTrackingService()
    this.emailService = new EmailService()
  }

  /**
   * Verifica si estamos en horario laboral (Lun-Sáb, 07:00-23:00)
   */
  private isBusinessHours(): boolean {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const hour = now.getHours()

    // Lunes a Sábado (1-6) y entre 07:00 y 23:00
    return dayOfWeek >= 1 && dayOfWeek <= 6 && hour >= 7 && hour < 23
  }

  /**
   * Ejecuta la actualización de datos y detecta nuevos postulantes
   */
  private async executeRefresh(): Promise<void> {
    try {
      console.log(`🔄 [Scheduler] Iniciando actualización automática - ${formatChileTime()}`)
      
      // Ejecutar queries para mantener datos frescos
      const result = await this.postulantesService.getPostulantes({})
      await this.postulantesService.getStats()
      
      // Detectar nuevos postulantes y enviar notificaciones
      await this.procesarNuevosPostulantes(result.data)
      
      this.lastExecution = new Date()
      console.log(`✅ [Scheduler] Actualización completada - ${formatChileTime(this.lastExecution)}`)
    } catch (error) {
      console.error('❌ [Scheduler] Error en actualización automática:', error)
    }
  }

  /**
   * Detecta nuevos postulantes y envía notificaciones por correo
   */
  private async procesarNuevosPostulantes(postulantes: any[]): Promise<void> {
    try {
      console.log(`🔍 [Scheduler] Detectando nuevos postulantes de ${postulantes.length} totales...`)
      const nuevos = await this.trackingService.detectarNuevosPostulantes(postulantes)
      
      if (nuevos.length === 0) {
        console.log(`✅ [Scheduler] No hay nuevos postulantes para notificar`)
        return
      }

      console.log(`📧 [Scheduler] Procesando ${nuevos.length} nuevo(s) postulante(s) para notificación`)

      // Enviar correos de forma asíncrona (no bloqueante)
      let exitosos = 0
      let fallidos = 0
      
      const promesasEnvio = nuevos.map(async (postulante) => {
        try {
          const codintStr = String(postulante.CODINT)
          const enviado = await this.emailService.enviarNotificacionNuevoPostulante(postulante)
          
          if (enviado) {
            // Solo marcar como notificado si el envío fue exitoso
            const marcado = await this.trackingService.marcarComoNotificado(codintStr)
            if (marcado) {
              exitosos++
              console.log(`✅ [Scheduler] Notificación enviada y registrada para postulante ${codintStr}`)
            } else {
              console.warn(`⚠️ [Scheduler] Correo enviado pero no se pudo marcar como notificado: ${codintStr}`)
            }
          } else {
            fallidos++
            console.warn(`⚠️ [Scheduler] No se pudo enviar notificación para postulante ${codintStr}, se reintentará en la próxima ejecución`)
          }
        } catch (error) {
          fallidos++
          console.error(`❌ [Scheduler] Error al procesar notificación para postulante ${postulante.CODINT}:`, error)
        }
      })

      // Esperar a que todos los correos se procesen (pero no bloquear si alguno falla)
      await Promise.allSettled(promesasEnvio)
      
      console.log(`📧 [Scheduler] Procesamiento completado: ${exitosos} exitosos, ${fallidos} fallidos de ${nuevos.length} totales`)
    } catch (error) {
      console.error('❌ [Scheduler] Error al procesar nuevos postulantes:', error)
    }
  }

  /**
   * Inicia el scheduler
   */
  start(): void {
    if (this.cronJob) {
      console.log('⚠️ [Scheduler] Ya está en ejecución')
      return
    }

    // Cron expression: cada hora (minuto 0) de lunes a sábado
    // 0 * * * 1-6 = minuto 0, cada hora, cada día, cada mes, lunes a sábado
    this.cronJob = cron.schedule('0 * * * 1-6', async () => {
      if (this.isBusinessHours()) {
        await this.executeRefresh()
      } else {
        console.log(`⏸️ [Scheduler] Fuera del horario laboral - ${formatChileTime()}`)
      }
    }, {
      scheduled: true,
      timezone: 'America/Santiago' // Zona horaria de Chile
    })

    console.log('✅ [Scheduler] Iniciado - Actualización cada hora (Lun-Sáb, 07:00-23:00)')
  }

  /**
   * Detiene el scheduler
   */
  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop()
      this.cronJob = null
      console.log('🛑 [Scheduler] Detenido')
    }
  }

  /**
   * Obtiene la fecha de la última ejecución
   */
  getLastExecution(): Date | null {
    return this.lastExecution
  }

  /**
   * Ejecuta una actualización manual (fuera del horario programado)
   */
  async executeManualRefresh(): Promise<void> {
    console.log(`🔄 [Scheduler] Ejecutando actualización manual - ${formatChileTime()}`)
    await this.executeRefresh()
  }
}

// Instancia singleton del scheduler
export const schedulerService = new SchedulerService()

