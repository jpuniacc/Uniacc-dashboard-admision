import { Router } from 'express'
import { PostulantesController } from '../controllers/postulantes.controller'

const router = Router()
const controller = new PostulantesController()

// GET /api/postulantes - Lista con paginación y filtros
router.get('/', controller.getPostulantes.bind(controller))

// GET /api/postulantes/stats - Estadísticas
router.get('/stats', controller.getStats.bind(controller))

// POST /api/postulantes/refresh - Actualización manual de datos
router.post('/refresh', controller.refresh.bind(controller))

// GET /api/postulantes/export - Exportar datos
router.get('/export', controller.exportPostulantes.bind(controller))

// POST /api/postulantes/:id/notificar - Reenviar notificación de postulante
router.post('/:id/notificar', controller.notificar.bind(controller))

// GET /api/postulantes/:id - Detalle de un postulante
router.get('/:id', controller.getPostulanteById.bind(controller))

export default router

