import { Router } from 'express'
import * as imoveisController from '../controllers/imoveis.controller'

const router = Router()

// GET /api/imoveis - Listar todos os imóveis
router.get('/', imoveisController.listarImoveis)

// GET /api/imoveis/:id - Buscar imóvel por ID
router.get('/:id', imoveisController.buscarImovelPorId)

// POST /api/imoveis - Criar novo imóvel
router.post('/', imoveisController.criarImovel)

// PUT /api/imoveis/:id - Atualizar imóvel
router.put('/:id', imoveisController.atualizarImovel)

// DELETE /api/imoveis/:id - Deletar imóvel
router.delete('/:id', imoveisController.deletarImovel)

export default router








