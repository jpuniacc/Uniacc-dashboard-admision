import { Router } from 'express'
import { DesistimientoController } from '../controllers/desistimiento.controller'

const router = Router()
const controller = new DesistimientoController()

router.post('/:codint/desistir', controller.marcarDesistido.bind(controller))
router.delete('/:codint/desistir', controller.desmarcarDesistido.bind(controller))
router.put('/:codint/estado-seguimiento', controller.actualizarEstadoSeguimiento.bind(controller))
router.get('/:codint/historial-estados', controller.obtenerHistorialEstados.bind(controller))

export default router

