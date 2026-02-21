import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import '../styles/Imoveis.css'

interface Imovel {
  id: string
  titulo: string
  endereco: string
  preco: number
  area: number
  tipo: string
  descricao: string
  imagens?: string[]
  quartos?: number
  banheiros?: number
  whatsapp?: string
  status: string
}

function Imoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    buscarImoveis()
  }, [])

  const buscarImoveis = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/imoveis')
      setImoveis(response.data)
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  return (
    <div className="imoveis-container">
      <Header />
      
      <div className="imoveis-content">
        <header className="page-header-imoveis">
          <h1>📋 Meus Imóveis</h1>
          <Link to="/cadastrar" className="add-btn">
            + Adicionar Imóvel
          </Link>
        </header>

        {loading ? (
          <p className="loading-message">Carregando imóveis...</p>
        ) : imoveis.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">Nenhum imóvel cadastrado ainda.</p>
            <Link to="/cadastrar" className="cadastrar-primeiro-btn">
              Cadastrar Primeiro Imóvel
            </Link>
          </div>
        ) : (
          <div className="imoveis-grid">
            {imoveis.map((imovel) => (
              <div key={imovel.id} className="imovel-card">
                <div className="imovel-image">
                  <img 
                    src={imovel.imagens && imovel.imagens.length > 0 ? imovel.imagens[0] : '/assets/imoveis/foto-1.jpg'} 
                    alt={imovel.titulo} 
                  />
                  <div className="imovel-status">{imovel.status}</div>
                </div>
                <div className="imovel-info">
                  <h3>{imovel.titulo}</h3>
                  <p className="tipo">{imovel.tipo.toUpperCase()}</p>
                  <p className="endereco">📍 {imovel.endereco}</p>
                  <div className="imovel-detalhes">
                    <span>🏠 {imovel.area}m²</span>
                    {imovel.quartos && imovel.quartos > 0 && (
                      <span>🛏️ {imovel.quartos}</span>
                    )}
                    {imovel.banheiros && imovel.banheiros > 0 && (
                      <span>🚿 {imovel.banheiros}</span>
                    )}
                  </div>
                  <p className="preco">{formatarPreco(imovel.preco)}</p>
                  
                  <div className="card-actions">
                    <Link 
                      to={`/editar-imovel/${imovel.id}`}
                      className="editar-btn"
                    >
                      ✏️ Editar
                    </Link>
                    <Link 
                      to={`/imovel/${imovel.id}`}
                      className="saiba-mais-btn"
                    >
                      Saiba mais
                    </Link>
                    {imovel.whatsapp && (
                      <a 
                        href={`https://wa.me/55${imovel.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        💬 WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Imoveis
