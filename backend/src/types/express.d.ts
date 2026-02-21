import { UserDTO } from './user.types'

declare global {
  namespace Express {
    interface Request {
      user?: UserDTO
    }
  }
}

export {}







