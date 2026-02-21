import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { findUserById } from '../utils/database'
import { userToDTO } from '../utils/helpers'
import { logger } from '../utils/logger'

const JWT_SECRET = process.env.JWT_SECRET || 'vladia-corretora-secret-key-2024'

interface JwtPayload {
  userId: string
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Token malformatado' })
    }

    const token = parts[1]

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

    // Buscar usuário
    const user = await findUserById(decoded.userId)
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' })
    }

    // Adicionar usuário na requisição
    req.user = userToDTO(user)
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado' })
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' })
    }
    logger.error('Erro na autenticação:', error)
    res.status(500).json({ message: 'Erro ao autenticar' })
  }
}

// Middleware para verificar tipo de usuário
export const authorize = (...allowedTypes: Array<'admin' | 'corretor' | 'cliente'>) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' })
    }

    if (!allowedTypes.includes(req.user.tipo)) {
      return res.status(403).json({ 
        message: 'Sem permissão para acessar este recurso' 
      })
    }

    next()
  }
}

