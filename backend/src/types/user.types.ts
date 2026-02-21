export interface User {
  id: string
  nome: string
  email: string
  senha: string
  telefone?: string
  tipo: 'admin' | 'corretor' | 'cliente'
  criadoEm: Date
  atualizadoEm: Date
}

export interface UserDTO {
  id: string
  nome: string
  email: string
  telefone?: string
  tipo: 'admin' | 'corretor' | 'cliente'
}

export interface RegisterDTO {
  nome: string
  email: string
  senha: string
  telefone?: string
  tipo?: 'admin' | 'corretor' | 'cliente'
}

export interface LoginDTO {
  email: string
  senha: string
}

export interface AuthResponse {
  user: UserDTO
  token: string
}







