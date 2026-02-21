import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import '../styles/DetalhesImovel.css'

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
  comodidades?: string[]
  latitude?: number
  longitude?: number
  aluguel?: number
  condominio?: number
  iptu?: number
  valorTotal?: number
  valorAbaixoMercado?: boolean
}

function DetalhesImovel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [imovel, setImovel] = useState<Imovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)
  const [imagemAtual, setImagemAtual] = useState(0)
  const [galeriaAberta, setGaleriaAberta] = useState(false)

  useEffect(() => {
    buscarImovel()
  }, [id])

  const buscarImovel = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/imoveis/${id}`)
      setImovel(response.data)
      setErro(false)
    } catch (error) {
      console.error('Erro ao buscar imovel:', error)
      setErro(true)
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

  const proximaImagem = () => {
    if (!imovel?.imagens) return
    setImagemAtual((prev) => (prev + 1) % imovel.imagens!.length)
  }

  const imagemAnterior = () => {
    if (!imovel?.imagens) return
    setImagemAtual((prev) => (prev - 1 + imovel.imagens!.length) % imovel.imagens!.length)
  }

  const irParaImagem = (index: number) => {
    setImagemAtual(index)
  }

  const handleVoltar = () => {
    if (window.history.length > 2) {
      navigate(-1)
      return
    }
    navigate('/')
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  if (erro || !imovel) {
    return (
      <div className="detalhes-container">
        <header className="detalhes-header">
          <Link to="/" className="logo-link">
            <img src="/assets/logo/logo.png" alt="Vladia Corretora" className="logo" />
          </Link>
        </header>
        <div className="erro-container">
          <h2>Imovel nao encontrado</h2>
          <Link to="/" className="btn-voltar-erro">Voltar para inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="detalhes-container">
      <header className="detalhes-header">
        <Link to="/" className="logo-link">
          <img src="/assets/logo/logo.png" alt="Vladia Corretora" className="logo" />
        </Link>
      </header>

      <main className="detalhes-main">
        <div className="detalhes-actions">
          <button type="button" className="btn-voltar-modern" onClick={handleVoltar}>
            <span className="voltar-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H8.83l4.58-4.59L12 5l-7 7 7 7 1.41-1.41L8.83 13H20v-2z" />
              </svg>
            </span>
            <span className="voltar-text">
              <small>Voltar</small>
              <strong>Imoveis</strong>
            </span>
          </button>
        </div>
        <div className="detalhes-card">
          <div className="imagem-destaque">
            <img
              src={imovel.imagens && imovel.imagens.length > 0 ? imovel.imagens[imagemAtual] : '/assets/imoveis/foto-1.jpg'}
              alt={`${imovel.titulo} - Imagem ${imagemAtual + 1}`}
              onClick={() => setGaleriaAberta(true)}
              style={{ cursor: 'pointer' }}
              title="Clique para ver todas as fotos"
            />
            <div className="status-badge">{imovel.status}</div>

            {imovel.imagens && imovel.imagens.length > 1 && (
              <>
                <button
                  className="nav-button nav-button-prev"
                  onClick={imagemAnterior}
                  aria-label="Imagem anterior"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>

                <button
                  className="nav-button nav-button-next"
                  onClick={proximaImagem}
                  aria-label="Proxima imagem"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>

                <div className="image-indicators">
                  {imovel.imagens.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === imagemAtual ? 'active' : ''}`}
                      onClick={() => irParaImagem(index)}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="image-counter">
                  {imagemAtual + 1} / {imovel.imagens.length}
                </div>
              </>
            )}
          </div>

          <div className="imovel-info">
            <div className="info-header">
              <h1 className="titulo-imovel">{imovel.titulo}</h1>
              <p className="tipo-imovel">{imovel.tipo.toUpperCase()}</p>
            </div>

            <div className="info-location">
              <svg className="location-icon-detalhes" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="endereco-completo">{imovel.endereco}</span>
            </div>

            <div className="preco-card">
              <div className="preco-principal">{formatarPreco(imovel.preco)}</div>
            </div>

            <div className="caracteristicas-detalhes">
              <div className="caracteristica-item">
                <span className="caracteristica-icon" aria-hidden="true">📐</span>
                <span>{imovel.area} m²</span>
              </div>
              {imovel.quartos && imovel.quartos > 0 && (
                <div className="caracteristica-item">
                  <span className="caracteristica-icon" aria-hidden="true">🛏</span>
                  <span>{imovel.quartos} {imovel.quartos === 1 ? 'Quarto' : 'Quartos'}</span>
                </div>
              )}
              {imovel.banheiros && imovel.banheiros > 0 && (
                <div className="caracteristica-item">
                  <span className="caracteristica-icon" aria-hidden="true">🚿</span>
                  <span>{imovel.banheiros} {imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}</span>
                </div>
              )}
            </div>

            {imovel.descricao && (
              <div className="descricao-section">
                <h3>Sobre o imovel</h3>
                <p>{imovel.descricao}</p>
              </div>
            )}
          </div>
        </div>

        {((imovel.comodidades && imovel.comodidades.length > 0) || (imovel.latitude && imovel.longitude)) && (
          <div className="detalhes-extras">
            <div className="extras-esquerda">
              <h2 className="extras-titulo-principal">{imovel.titulo}</h2>

              <div className="extras-caracteristicas-grid">
                <div className="extras-caract-item">
                  <span className="extras-caract-label">Metragem</span>
                  <span className="extras-caract-valor">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="extras-caract-icon"><path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"/></svg>
                    {imovel.area} m²
                  </span>
                </div>
                {imovel.quartos !== undefined && imovel.quartos > 0 && (
                  <div className="extras-caract-item">
                    <span className="extras-caract-label">Quartos</span>
                    <span className="extras-caract-valor">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="extras-caract-icon"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2V11c0-2.21-1.79-4-4-4z"/></svg>
                      {imovel.quartos}
                    </span>
                  </div>
                )}
                {imovel.banheiros !== undefined && imovel.banheiros > 0 && (
                  <div className="extras-caract-item">
                    <span className="extras-caract-label">Banheiros</span>
                    <span className="extras-caract-valor">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="extras-caract-icon"><path d="M7 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm13.6 8.8L17 12.5V6c0-1.1-.9-2-2-2H9C7.9 4 7 4.9 7 6v6.5l-3.6 3.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L8 14.5V18c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-3.5l3.2 2.7c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4z"/></svg>
                      {imovel.banheiros}
                    </span>
                  </div>
                )}
              </div>

              {imovel.comodidades && imovel.comodidades.length > 0 && (
                <div className="caracteristicas-expandidas">
                  <div className="caracteristicas-expandidas-header">
                    <h3>Características</h3>
                  </div>
                  <div className="caracteristicas-expandidas-conteudo">
                    <div className="caracteristicas-coluna">
                      <h4 className="caracteristicas-coluna-titulo">Imóvel</h4>
                      <ul className="caracteristicas-lista">
                        {imovel.comodidades.map((comodidade, index) => (
                          <li key={index} className="caracteristica-item-expandido">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="check-icon">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            {comodidade}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {imovel.latitude && imovel.longitude && (
              <div className="extras-direita">
                <h3 className="extras-titulo-localizacao">Localização</h3>
                <div className="localizacao-endereco">
                  <svg className="location-icon-detalhes" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span>{imovel.endereco}</span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${imovel.latitude},${imovel.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ver-mapa-link"
                >
                  Ver mapa ampliado
                </a>
                <div className="mapa-container">
                  <iframe
                    title="Localização do imóvel"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${imovel.longitude - 0.005},${imovel.latitude - 0.005},${imovel.longitude + 0.005},${imovel.latitude + 0.005}&layer=mapnik&marker=${imovel.latitude},${imovel.longitude}`}
                  />
                </div>
                <a
                  href={`https://wa.me/55${(imovel.whatsapp || '').replace(/\D/g, '')}?text=Ola! Tenho interesse no imovel: ${imovel.titulo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-saiba-mais"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Saiba mais sobre o imovel
                </a>
              </div>
            )}
          </div>
        )}

        {(imovel.aluguel || imovel.condominio || imovel.iptu || imovel.valorTotal) && (
          <div className="detalhes-valores">
            <div className="valores-header">
              <h2 className="valores-titulo">Valores</h2>
              <svg viewBox="0 0 24 24" fill="currentColor" className="valores-icon">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
            </div>
            <div className="valores-grid">
              {imovel.aluguel && (
                <div className="valor-item">
                  <span className="valor-label">Aluguel</span>
                  <span className="valor-numero">{formatarPreco(imovel.aluguel)}/mês</span>
                </div>
              )}
              {imovel.condominio && (
                <div className="valor-item">
                  <span className="valor-label">Condomínio</span>
                  <span className="valor-numero">{formatarPreco(imovel.condominio)}/mês</span>
                </div>
              )}
              {imovel.iptu && (
                <div className="valor-item">
                  <span className="valor-label">IPTU</span>
                  <span className="valor-numero">{formatarPreco(imovel.iptu)}</span>
                </div>
              )}
              {imovel.valorTotal && (
                <div className="valor-item valor-total">
                  <span className="valor-label">
                    Valor total previsto
                    <svg viewBox="0 0 24 24" fill="currentColor" className="info-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </span>
                  <span className="valor-numero valor-destaque">
                    {formatarPreco(imovel.valorTotal)}
                    {imovel.valorAbaixoMercado && (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="valor-down-icon">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    )}
                  </span>
                </div>
              )}
            </div>
            {imovel.valorAbaixoMercado && (
              <div className="valor-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" className="badge-down-icon">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
                Valor abaixo do mercado
              </div>
            )}
          </div>
        )}
      </main>

      {imovel.whatsapp && (
        <a
          href={`https://wa.me/55${imovel.whatsapp.replace(/\D/g, '')}?text=Ola! Tenho interesse no imovel: ${imovel.titulo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="Contato WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      )}

      {/* Modal de Galeria de Fotos */}
      {galeriaAberta && imovel.imagens && imovel.imagens.length > 0 && (
        <div className="galeria-modal" onClick={() => setGaleriaAberta(false)}>
          <div className="galeria-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="galeria-fechar"
              onClick={() => setGaleriaAberta(false)}
              aria-label="Fechar galeria"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>

            <div className="galeria-imagem-principal">
              <img
                src={imovel.imagens[imagemAtual]}
                alt={`${imovel.titulo} - Foto ${imagemAtual + 1}`}
              />
            </div>

            {imovel.imagens.length > 1 && (
              <>
                <button
                  className="galeria-nav galeria-nav-prev"
                  onClick={imagemAnterior}
                  aria-label="Foto anterior"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>

                <button
                  className="galeria-nav galeria-nav-next"
                  onClick={proximaImagem}
                  aria-label="Próxima foto"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>

                <div className="galeria-contador">
                  {imagemAtual + 1} / {imovel.imagens.length}
                </div>
              </>
            )}

            {/* Miniaturas */}
            {imovel.imagens.length > 1 && (
              <div className="galeria-miniaturas">
                {imovel.imagens.map((img, index) => (
                  <button
                    key={index}
                    className={`galeria-miniatura ${index === imagemAtual ? 'ativa' : ''}`}
                    onClick={() => irParaImagem(index)}
                  >
                    <img src={img} alt={`Miniatura ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DetalhesImovel
