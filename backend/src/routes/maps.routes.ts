import { Router } from 'express'
import * as mapsController from '../controllers/maps.controller'

const router = Router()

// POST /api/maps/geocode - Buscar coordenadas de um endereço
router.post('/geocode', mapsController.geocodeEndereco)

// POST /api/maps/reverse-geocode - Buscar endereço de coordenadas
router.post('/reverse-geocode', mapsController.reverseGeocode)

export default router








