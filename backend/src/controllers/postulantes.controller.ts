import { Request, Response } from 'express'
import { PostulantesService } from '../services/postulantes.service'
import { schedulerService } from '../services/scheduler.service'
import { EmailService } from '../services/email.service'
import { PostulantesTrackingService } from '../services/postulantes-tracking.service'
import { FiltrosPostulante } from '../types/postulante.types'
import { Parser } from 'json2csv'

const emailService = new EmailService()
const trackingService = new PostulantesTrackingService()

const postulantesService = new PostulantesService()

export class PostulantesController {
  async getPostulantes(req: Request, res: Response): Promise<void> {
    try {
      const filtros: FiltrosPostulante = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
        carrera: req.query.carrera as string,
        fechaDesde: req.query.fechaDesde as string,
        fechaHasta: req.query.fechaHasta as string,
        comuna: req.query.comuna as string,
        sexo: req.query.sexo as string,
      }

      const result = await postulantesService.getPostulantes(filtros)
      res.json(result)
    } catch (error) {
      console.error('Error en getPostulantes controller:', error)
      res.status(500).json({ 
        error: 'Error al obtener postulantes',
        message: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  async getPostulantesComparacion(req: Request, res: Response): Promise<void> {
    try {
      const filtros: FiltrosPostulante = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
        carrera: req.query.carrera as string,
        fechaDesde: req.query.fechaDesde as string,
        fechaHasta: req.query.fechaHasta as string,
        comuna: req.query.comuna as string,
        sexo: req.query.sexo as string,
      }

      const result = await postulantesService.getPostulantesComparacion(filtros)
      res.json(result)
    } catch (error) {
      console.error('Error en getPostulantesComparacion controller:', error)
      res.status(500).json({ 
        error: 'Error al obtener postulantes de comparación',
        message: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  async getPostulanteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const postulante = await postulantesService.getPostulanteById(id)

      if (!postulante) {
        res.status(404).json({ error: 'Postulante no encontrado' })
        return
      }

      res.json(postulante)
    } catch (error) {
      console.error('Error en getPostulanteById controller:', error)
      res.status(500).json({ 
        error: 'Error al obtener postulante',
        message: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await postulantesService.getStats()
      res.json(stats)
    } catch (error) {
      console.error('Error en getStats controller:', error)
      res.status(500).json({ 
        error: 'Error al obtener estadísticas',
        message: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  async exportPostulantes(req: Request, res: Response): Promise<void> {
    try {
      const filtros: FiltrosPostulante = {
        search: req.query.search as string,
        carrera: req.query.carrera as string,
        fechaDesde: req.query.fechaDesde as string,
        fechaHasta: req.query.fechaHasta as string,
        comuna: req.query.comuna as string,
        sexo: req.query.sexo as string,
      }

      const postulantes = await postulantesService.exportPostulantes(filtros)

      const format = req.query.format as string || 'csv'

      if (format === 'csv') {
        // Exportar como CSV
        const fields = [
          'CODINT',
          'RUT',
          'DIGITO',
          'NOMBRE',
          'PATERNO',
          'MATERNO',
          'EMAIL',
          'CELULAR',
          'CARRINT1',
          'CARRINT2',
          'NOMBRECOL',
          'FECREG',
          'DIRECCION',
          'COMUNA',
          'CIUDAD',
        ]

        const parser = new Parser({ fields })
        const csv = parser.parse(postulantes)

        res.header('Content-Type', 'text/csv; charset=utf-8')
        res.header('Content-Disposition', `attachment; filename="postulantes_${new Date().toISOString().split('T')[0]}.csv"`)
        res.send('\uFEFF' + csv) // BOM para UTF-8
      } else {
        // Exportar como JSON
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.header('Content-Disposition', `attachment; filename="postulantes_${new Date().toISOString().split('T')[0]}.json"`)
        res.json(postulantes)
      }
    } catch (error) {
      console.error('Error en exportPostulantes controller:', error)
      res.status(500).json({ 
        error: 'Error al exportar postulantes',
        message: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      await schedulerService.executeManualRefresh()
      res.json({
        success: true,
        message: 'Datos actualizados correctamente',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error en refresh controller:', error)
      res.status(500).json({ 
        error: 'Error al actualizar datos',
        message: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  async notificar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const postulante = await postulantesService.getPostulanteById(id)

      if (!postulante) {
        res.status(404).json({ error: 'Postulante no encontrado' })
        return
      }

      // Enviar correo de notificación
      const enviado = await emailService.enviarNotificacionNuevoPostulante(postulante)

      if (enviado) {
        // Marcar como notificado
        await trackingService.marcarComoNotificado(postulante.CODINT)
        res.json({
          success: true,
          message: 'Notificación enviada correctamente',
          timestamp: new Date().toISOString()
        })
      } else {
        res.status(500).json({
          error: 'Error al enviar notificación',
          message: 'No se pudo enviar el correo. Verifique la configuración SMTP.'
        })
      }
    } catch (error) {
      console.error('Error en notificar controller:', error)
      res.status(500).json({ 
        error: 'Error al enviar notificación',
        message: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }
}

