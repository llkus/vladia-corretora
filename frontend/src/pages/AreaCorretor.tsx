import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import '../styles/AreaCorretor.css'

const AreaCorretor = () => {
  const { user } = useAuth()

  return (
    <div className="area-corretor-container">
      <Header />

      <main className="area-corretor-main">
        <div className="welcome-section">
          <div className="welcome-icon">👋</div>
          <h1>Bem-vindo, {user?.nome}!</h1>
          <p className="user-type-badge">{user?.tipo === 'admin' ? 'Admin Sistema' : 'Corretor'}</p>
        </div>

        <div className="cards-grid">
          <Link to="/cadastrar" className="card-link">
            <div className="action-card">
              <div className="card-icon">🏠</div>
              <h2>Cadastrar Imóvel</h2>
              <p>Adicione novos imóveis ao sistema</p>
            </div>
          </Link>
        </div>

        <div className="info-section">
          <div className="info-card">
            <div className="info-card-header">
              <h3>Informações da Conta</h3>
              <Link to="/editar-perfil" className="btn-editar-perfil">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Editar Perfil
              </Link>
            </div>
            <div className="info-content">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div className="info-details">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user?.email}</span>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📱</span>
                <div className="info-details">
                  <span className="info-label">Telefone</span>
                  <span className="info-value">{user?.telefone || 'Não informado'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AreaCorretor


