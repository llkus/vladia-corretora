import { Router } from 'express'
import { register, login, getProfile, verifyToken, updateProfile } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

// Rotas públicas
router.post('/register', register)
router.post('/login', login)

// Rotas protegidas
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)
router.get('/verify', authenticate, verifyToken)

export default router



