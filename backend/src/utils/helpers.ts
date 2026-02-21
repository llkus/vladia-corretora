import { User, UserDTO } from '../types/user.types'

// Converter User para UserDTO (remove senha)
export const userToDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    tipo: user.tipo
  }
}







