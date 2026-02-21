import { Router } from 'express'
import imoveisRoutes from './imoveis.routes'
import mapsRoutes from './maps.routes'
import authRoutes from './auth.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/imoveis', imoveisRoutes)
router.use('/maps', mapsRoutes)

export default router


