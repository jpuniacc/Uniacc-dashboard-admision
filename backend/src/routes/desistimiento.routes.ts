import { Router } from 'express'
import { DesistimientoController } from '../controllers/desistimiento.controller'

const router = Router()
const controller = new DesistimientoController()

router.post('/:codint/desistir', controller.marcarDesistido.bind(controller))
router.delete('/:codint/desistir', controller.desmarcarDesistido.bind(controller))

export default router

