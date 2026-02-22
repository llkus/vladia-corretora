import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Home.css'

interface Imovel {
  id: string
  titulo: string
  categoria: string
  tipo: string
  endereco: string
  preco: number
  area: number
  quartos?: number
  banheiros?: number
  descricao: string
  imagens?: string[]
  whatsapp?: string
  status: string
}

function Home() {
  const navigate = useNavigate()
  const [tipoImovel, setTipoImovel] = useState<'aluguel' | 'compra'>('aluguel')
  const [todosImoveis, setTodosImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    buscarImoveis()
  }, [])

  const buscarImoveis = async () => {
    try {
      const response = await axios.get('/api/imoveis')
      setTodosImoveis(response.data)
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar imóveis baseado na categoria selecionada
  const imoveis = todosImoveis.filter(imovel => imovel.categoria === tipoImovel)

  const extrairLocalizacao = (endereco: string) => {
    // Formato cadastrado: "Rua X, Numero, Bairro, Cidade - Estado, CEP: XXXXX"
    const partes = endereco.split(',').map(p => p.trim())
    
    if (partes.length >= 4) {
      // Pega a rua (primeira parte) e a cidade-estado (parte que contém " - ")
      const rua = partes[0]
      
      // Encontra a parte que tem "Cidade - Estado"
      const cidadeEstado = partes.find(p => p.includes(' - '))
      
      if (cidadeEstado) {
        return `${rua}, ${cidadeEstado}`
      }
      
      // Se não encontrar, usa a terceira parte (índice 3) que seria a cidade
      if (partes[3]) {
        return `${rua}, ${partes[3]}`
      }
    }
    
    // Fallback simples: pega as duas primeiras partes
    if (partes.length >= 2) {
      return `${partes[0]}, ${partes[partes.length > 3 ? 3 : 1]}`
    }
    
    // Fallback final: retorna o endereço limitado
    return endereco.length > 40 ? endereco.substring(0, 40) + '...' : endereco
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img 
            src="/assets/logo/logo.png" 
            alt="Vladia Corretora" 
            className="logo"
          />
        </div>
        <button 
          className="area-corretor-btn"
          onClick={() => navigate('/area-corretor')}
        >
          Área do corretor
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Seção de Busca */}
        <section className="search-section">
          <h1 className="main-title">O que você estar buscando:</h1>
          
          <div className="tipo-buttons-container">
            <button 
              className={`tipo-btn ${tipoImovel === 'aluguel' ? 'active' : ''}`}
              onClick={() => setTipoImovel('aluguel')}
            >
              ALUGUEL
            </button>
            <button 
              className={`tipo-btn ${tipoImovel === 'compra' ? 'active' : ''}`}
              onClick={() => setTipoImovel('compra')}
            >
              COMPRA
            </button>
          </div>
        </section>

        {/* Contador de resultados - Centralizado */}
        <div className="resultados-info">
          <p className="contador-resultados">
            {loading ? (
              'Carregando imóveis...'
            ) : (
              `${imoveis.length} ${imoveis.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'} para ${tipoImovel}`
            )}
          </p>
        </div>

        {/* Grid de Imóveis */}
        <section className="imoveis-grid">
          {loading ? (
            <div className="loading-container">
              <p>Carregando...</p>
            </div>
          ) : imoveis.length === 0 ? (
            <div className="empty-container">
              <p>Nenhum imóvel encontrado para {tipoImovel}.</p>
            </div>
          ) : (
            imoveis.map((imovel) => (
              <Link 
                key={imovel.id} 
                to={`/imovel/${imovel.id}`} 
                className="imovel-card-link"
              >
                <div className="imovel-card">
                  <div className="imovel-image">
                    <img 
                      src={imovel.imagens && imovel.imagens.length > 0 ? imovel.imagens[0] : '/assets/imoveis/foto-1.jpg'} 
                      alt={`Imóvel em ${extrairLocalizacao(imovel.endereco)}`} 
                    />
                  </div>
                  
                  <div className="imovel-content">
                    <h3 className="imovel-titulo">{imovel.titulo}</h3>
                    
                    <div className="imovel-location">
                      <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="bairro-nome">{extrairLocalizacao(imovel.endereco)}</span>
                    </div>

                    <div className="imovel-caracteristicas">
                      {imovel.quartos && imovel.quartos > 0 && (
                        <div className="caracteristica-item">
                          <svg className="carac-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                          </svg>
                          <span>{imovel.quartos}</span>
                        </div>
                      )}
                      {imovel.banheiros && imovel.banheiros > 0 && (
                        <div className="caracteristica-item">
                          <svg className="carac-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                          </svg>
                          <span>{imovel.banheiros}</span>
                        </div>
                      )}
                      <div className="caracteristica-item">
                        <svg className="carac-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                        </svg>
                        <span>{imovel.area}m²</span>
                      </div>
                    </div>

                    <div className="imovel-preco">
                      <span className="preco-label">Valor</span>
                      <span className="preco-valor">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.preco)}
                      </span>
                    </div>

                    <span className="saiba-mais">
                      Ver Detalhes
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default Home

