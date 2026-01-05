import { Request, Response } from 'express'
import { DesistimientoService } from '../services/desistimiento.service'

const service = new DesistimientoService()

export class DesistimientoController {
  async marcarDesistido(req: Request, res: Response) {
    try {
      const { codint } = req.params
      const resultado = await service.marcarDesistido(codint)
      
      if (resultado) {
        res.json({ success: true, message: 'Postulante marcado como desistido' })
      } else {
        res.status(500).json({ success: false, error: 'Error al marcar desistido' })
      }
    } catch (error) {
      console.error('Error en marcarDesistido:', error)
      res.status(500).json({ success: false, error: 'Error al marcar desistido' })
    }
  }

  async desmarcarDesistido(req: Request, res: Response) {
    try {
      const { codint } = req.params
      const resultado = await service.desmarcarDesistido(codint)
      
      if (resultado) {
        res.json({ success: true, message: 'Desistimiento removido' })
      } else {
        res.status(500).json({ success: false, error: 'Error al desmarcar desistido' })
      }
    } catch (error) {
      console.error('Error en desmarcarDesistido:', error)
      res.status(500).json({ success: false, error: 'Error al desmarcar desistido' })
    }
  }

  async actualizarEstadoSeguimiento(req: Request, res: Response) {
    try {
      const { codint } = req.params
      const { estado } = req.body
      
      // Permitir null para eliminar el estado
      if (estado !== null && !estado) {
        return res.status(400).json({ success: false, error: 'El estado es requerido' })
      }
      
      const resultado = await service.actualizarEstadoSeguimiento(codint, estado)
      
      if (resultado) {
        const mensaje = estado === null 
          ? 'Estado de seguimiento eliminado' 
          : 'Estado de seguimiento actualizado'
        res.json({ success: true, message: mensaje })
      } else {
        res.status(500).json({ success: false, error: 'Error al actualizar estado de seguimiento' })
      }
    } catch (error) {
      console.error('Error en actualizarEstadoSeguimiento:', error)
      res.status(500).json({ success: false, error: 'Error al actualizar estado de seguimiento' })
    }
  }

  async obtenerHistorialEstados(req: Request, res: Response) {
    try {
      const { codint } = req.params
      const historial = await service.obtenerHistorialEstados(codint)
      res.json({ success: true, historial })
    } catch (error) {
      console.error('Error en obtenerHistorialEstados:', error)
      res.status(500).json({ success: false, error: 'Error al obtener historial de estados' })
    }
  }
}

