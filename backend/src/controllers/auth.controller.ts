import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RegisterDTO, LoginDTO, AuthResponse, User } from '../types/user.types'
import { findUserByEmail, createUser, findUserById, updateUser } from '../utils/database'
import { userToDTO } from '../utils/helpers'
import { logger } from '../utils/logger'

const JWT_SECRET = process.env.JWT_SECRET || 'vladia-corretora-secret-key-2024'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Gerar token JWT
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any)
}

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nome, email, senha, telefone, tipo }: RegisterDTO = req.body

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({
        message: 'Nome, email e senha são obrigatórios'
      })
    }

    // Verificar se email já existe
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        message: 'Email já cadastrado'
      })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10)

    // Criar novo usuário
    const newUser = await createUser({
      nome,
      email,
      senha: hashedPassword,
      telefone,
      tipo: tipo || 'cliente',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    })

    // Gerar token
    const token = generateToken(newUser.id)

    const response: AuthResponse = {
      user: userToDTO(newUser),
      token
    }

    logger.info(`Novo usuário registrado: ${email}`)
    res.status(201).json(response)
  } catch (error) {
    logger.error('Erro ao registrar usuário:', error)
    res.status(500).json({ message: 'Erro ao registrar usuário' })
  }
}

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, senha }: LoginDTO = req.body

    // Validações
    if (!email || !senha) {
      return res.status(400).json({
        message: 'Email e senha são obrigatórios'
      })
    }

    // Buscar usuário
    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({
        message: 'Email ou senha inválidos'
      })
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email ou senha inválidos'
      })
    }

    // Gerar token
    const token = generateToken(user.id)

    const response: AuthResponse = {
      user: userToDTO(user),
      token
    }

    logger.info(`Usuário autenticado: ${email}`)
    res.json(response)
  } catch (error) {
    logger.error('Erro ao fazer login:', error)
    res.status(500).json({ message: 'Erro ao fazer login' })
  }
}

export const getProfile = (req: Request, res: Response): any => {
  try {
    // req.user é definido pelo middleware de autenticação
    if (!req.user) {
      return res.status(401).json({ message: 'Não autorizado' })
    }

    res.json(req.user)
  } catch (error) {
    logger.error('Erro ao buscar perfil:', error)
    res.status(500).json({ message: 'Erro ao buscar perfil' })
  }
}

export const verifyToken = (req: Request, res: Response): any => {
  try {
    // Se chegou aqui, o token é válido (verificado pelo middleware)
    res.json({ 
      valid: true, 
      user: req.user 
    })
  } catch (error) {
    logger.error('Erro ao verificar token:', error)
    res.status(500).json({ message: 'Erro ao verificar token' })
  }
}

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autorizado' })
    }

    const { nome, email, telefone, senhaAtual, novaSenha } = req.body

    // Validações
    if (!nome || !email) {
      return res.status(400).json({
        message: 'Nome e email são obrigatórios'
      })
    }

    // Buscar usuário atual
    const user = await findUserById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    // Se está alterando email, verificar se o novo email já existe
    if (email !== user.email) {
      const emailExists = await findUserByEmail(email)
      if (emailExists) {
        return res.status(400).json({
          message: 'Email já está em uso'
        })
      }
    }

    const updates: Partial<User> = {
      nome,
      email,
      telefone,
      atualizadoEm: new Date()
    }

    // Se está alterando senha
    if (novaSenha) {
      if (!senhaAtual) {
        return res.status(400).json({
          message: 'Senha atual é obrigatória para alterar a senha'
        })
      }

      // Verificar senha atual
      const isPasswordValid = await bcrypt.compare(senhaAtual, user.senha)
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Senha atual incorreta'
        })
      }

      // Hash da nova senha
      updates.senha = await bcrypt.hash(novaSenha, 10)
    }

    // Atualizar usuário no Supabase
    const updatedUser = await updateUser(user.id, updates)

    // Gerar novo token com os dados atualizados
    const token = generateToken(updatedUser.id)

    const response: AuthResponse = {
      user: userToDTO(updatedUser),
      token
    }

    logger.info(`Perfil atualizado: ${email}`)
    res.json(response)
  } catch (error) {
    logger.error('Erro ao atualizar perfil:', error)
    res.status(500).json({ message: 'Erro ao atualizar perfil' })
  }
}

