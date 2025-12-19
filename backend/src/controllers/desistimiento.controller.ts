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
}

