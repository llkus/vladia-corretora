import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Header.css'

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuAberto(false)
  }

  const navegarPara = (rota: string) => {
    navigate(rota)
    setMenuAberto(false)
  }

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand" onClick={() => navegarPara('/area-corretor')}>
          <img 
            src="/assets/logo/logo.png" 
            alt="Vladia Corretora" 
            className="header-logo"
          />
        </div>

        {/* Botão Hamburger - Mobile */}
        <button 
          className={`hamburger ${menuAberto ? 'ativo' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu Desktop */}
        <nav className={`header-nav ${menuAberto ? 'mobile-aberto' : ''}`}>
          <div className="mobile-header">
            <div className="user-info-mobile">
              <span className="user-name">{user?.nome}</span>
              <span className="user-badge">
                {user?.tipo === 'admin' ? 'ADMIN' : 'CORRETOR'}
              </span>
            </div>
          </div>

          <button onClick={() => navegarPara('/')} className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Início</span>
          </button>
          <button onClick={() => navegarPara('/imoveis')} className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span>Imóveis</span>
          </button>
          <button onClick={() => navegarPara('/cadastrar')} className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Cadastrar</span>
          </button>

          <button onClick={handleLogout} className="logout-button-mobile">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Sair</span>
          </button>
        </nav>

        {/* Usuário - Desktop */}
        <div className="header-user">
          <div className="user-info">
            <span className="user-name">{user?.nome}</span>
            <span className="user-badge">
              {user?.tipo === 'admin' ? 'ADMIN' : 'CORRETOR'}
            </span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Sair
          </button>
        </div>

        {/* Overlay do Menu Mobile */}
        {menuAberto && (
          <div className="menu-overlay" onClick={() => setMenuAberto(false)}></div>
        )}
      </div>
    </header>
  )
}

export default Header


