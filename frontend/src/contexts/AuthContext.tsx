import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface User {
  id: string
  nome: string
  email: string
  telefone?: string
  tipo: 'admin' | 'corretor' | 'cliente'
}

interface AuthContextData {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string, telefone?: string) => Promise<void>
  updateProfile: (nome: string, email: string, telefone?: string, senhaAtual?: string, novaSenha?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('@VladiaCorretora:token')
    const storedUser = localStorage.getItem('@VladiaCorretora:user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      
      // Configurar axios com o token
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }

    setLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        senha
      })

      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)

      // Salvar no localStorage
      localStorage.setItem('@VladiaCorretora:token', userToken)
      localStorage.setItem('@VladiaCorretora:user', JSON.stringify(userData))

      // Configurar axios com o token
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      throw new Error(message)
    }
  }

  const register = async (nome: string, email: string, senha: string, telefone?: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        nome,
        email,
        senha,
        telefone
      })

      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)

      // Salvar no localStorage
      localStorage.setItem('@VladiaCorretora:token', userToken)
      localStorage.setItem('@VladiaCorretora:user', JSON.stringify(userData))

      // Configurar axios com o token
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao registrar'
      throw new Error(message)
    }
  }

  const updateProfile = async (nome: string, email: string, telefone?: string, senhaAtual?: string, novaSenha?: string) => {
    try {
      const response = await axios.put('http://localhost:5000/api/auth/profile', {
        nome,
        email,
        telefone,
        senhaAtual,
        novaSenha
      })

      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)

      // Atualizar no localStorage
      localStorage.setItem('@VladiaCorretora:token', userToken)
      localStorage.setItem('@VladiaCorretora:user', JSON.stringify(userData))

      // Atualizar token do axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil'
      throw new Error(message)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    // Remover do localStorage
    localStorage.removeItem('@VladiaCorretora:token')
    localStorage.removeItem('@VladiaCorretora:user')

    // Remover token do axios
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}



