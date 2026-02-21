import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import '../styles/EditarPerfil.css'

const EditarPerfil = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [alterarSenha, setAlterarSenha] = useState(false)

  useEffect(() => {
    if (user) {
      setNome(user.nome)
      setEmail(user.email)
      setTelefone(user.telefone || '')
    }
  }, [user])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validações
    if (alterarSenha) {
      if (!senhaAtual) {
        setError('Digite sua senha atual para alterá-la')
        return
      }

      if (!novaSenha) {
        setError('Digite a nova senha')
        return
      }

      if (novaSenha.length < 6) {
        setError('A nova senha deve ter no mínimo 6 caracteres')
        return
      }

      if (novaSenha !== confirmarSenha) {
        setError('As senhas não coincidem')
        return
      }
    }

    setLoading(true)

    try {
      await updateProfile(
        nome, 
        email, 
        telefone || undefined,
        alterarSenha ? senhaAtual : undefined,
        alterarSenha ? novaSenha : undefined
      )
      
      setSuccess('Perfil atualizado com sucesso!')
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
      setAlterarSenha(false)
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/area-corretor')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="editar-perfil-container">
      <Header />

      <main className="editar-perfil-main">
        <div className="editar-perfil-card">
          <div className="editar-perfil-header">
            <Link to="/area-corretor" className="btn-voltar-perfil">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </Link>
            <h1>Editar Perfil</h1>
            <p>Atualize suas informações pessoais</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="editar-perfil-form">
            <div className="form-section">
              <h3>Informações Pessoais</h3>

              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(85) 99999-9999"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-header-senha">
                <h3>Segurança</h3>
                <button
                  type="button"
                  className="btn-toggle-senha"
                  onClick={() => setAlterarSenha(!alterarSenha)}
                  disabled={loading}
                >
                  {alterarSenha ? 'Cancelar alteração' : 'Alterar senha'}
                </button>
              </div>

              {alterarSenha && (
                <>
                  <div className="form-group">
                    <label htmlFor="senhaAtual">Senha Atual</label>
                    <input
                      type="password"
                      id="senhaAtual"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="novaSenha">Nova Senha</label>
                    <input
                      type="password"
                      id="novaSenha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      id="confirmarSenha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="Digite a nova senha novamente"
                      disabled={loading}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-actions">
              <Link to="/area-corretor" className="btn-cancelar">
                Cancelar
              </Link>
              <button 
                type="submit" 
                className="btn-salvar"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default EditarPerfil





