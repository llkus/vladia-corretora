import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import '../styles/CadastrarImovel.css'

function CadastrarImovel() {
  const navigate = useNavigate()

  const comodidadesSugestoes = [
    'Piscina',
    'Playground',
    'Sala de jogos',
    'Deck',
    'Churrasqueira',
    'Academia',
    'Coworking',
    'Brinquedoteca',
    'Sauna',
    'Quadra',
    'Portaria 24h',
    'Elevador',
    'Jardim',
    'Bicicletario'
  ]

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    categoria: '',
    disponibilidade: 'disponivel',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    preco: '',
    area: '',
    quartos: '',
    banheiros: '',
    vagas: '',
    iptu: '',
    condominio: '',
    whatsapp: '',
    descricao: '',
  })

  const [comodidadesSelecionadas, setComodidadesSelecionadas] = useState<string[]>([])
  const [comodidadePersonalizada, setComodidadePersonalizada] = useState('')
  const [mostrarCampoOutro, setMostrarCampoOutro] = useState(false)
  const [enderecoValidado, setEnderecoValidado] = useState<string | null>(null)
  const [buscandoEndereco, setBuscandoEndereco] = useState(false)
  const [erroEndereco, setErroEndereco] = useState<string | null>(null)
  const [imagens, setImagens] = useState<string[]>([])
  const [enviando, setEnviando] = useState(false)
  const [coordenadas, setCoordenadas] = useState<{ latitude: number; longitude: number } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    if (['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'].includes(e.target.name)) {
      setEnderecoValidado(null)
      setErroEndereco(null)
      setCoordenadas(null)
    }
  }

  const buscarEndereco = async () => {
    if (!formData.rua.trim() || !formData.cidade.trim() || !formData.estado.trim()) {
      setErroEndereco('Preencha pelo menos Rua, Cidade e Estado')
      return
    }

    setBuscandoEndereco(true)
    setErroEndereco(null)
    setEnderecoValidado(null)

    try {
      const enderecoCompleto = `${formData.rua}, ${formData.numero}, ${formData.bairro}, ${formData.cidade} - ${formData.estado}`

      const response = await axios.post('/api/maps/geocode', {
        endereco: enderecoCompleto
      })

      const enderecoFormatado = response.data.endereco_formatado
      setEnderecoValidado(enderecoFormatado)
      setCoordenadas({ latitude: response.data.latitude, longitude: response.data.longitude })
      setErroEndereco(null)
    } catch (error: any) {
      setErroEndereco(
        error.response?.data?.error || 'Endereco nao encontrado. Verifique e tente novamente.'
      )
      setEnderecoValidado(null)
    } finally {
      setBuscandoEndereco(false)
    }
  }

  const comprimirImagem = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          const MAX_WIDTH = 1200
          const MAX_HEIGHT = 900
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0, width, height)

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
          resolve(compressedDataUrl)
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const maxImages = 10 - imagens.length
    const filesToProcess = Array.from(files).slice(0, maxImages)

    try {
      const compressedImages = await Promise.all(
        filesToProcess.map(file => comprimirImagem(file))
      )
      setImagens([...imagens, ...compressedImages])
    } catch (error) {
      alert('Erro ao processar imagens. Tente novamente.')
    }
  }

  const removerImagem = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index))
  }

  const alternarComodidade = (item: string) => {
    setComodidadesSelecionadas(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    )
  }

  const removerComodidade = (item: string) => {
    setComodidadesSelecionadas(prev => prev.filter(c => c !== item))
  }

  const adicionarComodidadePersonalizada = () => {
    const valorNormalizado = comodidadePersonalizada.trim()
    if (!valorNormalizado) return

    const valorFormatado = valorNormalizado.charAt(0).toUpperCase() + valorNormalizado.slice(1)

    setComodidadesSelecionadas(prev =>
      prev.includes(valorFormatado) ? prev : [...prev, valorFormatado]
    )
    setComodidadePersonalizada('')
  }

  const handleOutroKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      adicionarComodidadePersonalizada()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!enderecoValidado) {
      setErroEndereco('Por favor, valide o endereco antes de cadastrar')
      return
    }

    setEnviando(true)

    try {
      const enderecoCompleto = `${formData.rua}, ${formData.numero}, ${formData.bairro}, ${formData.cidade} - ${formData.estado}, CEP: ${formData.cep}`

      const imovelData = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        categoria: formData.categoria,
        endereco: enderecoCompleto,
        preco: parseFloat(formData.preco),
        area: parseFloat(formData.area),
        quartos: formData.quartos ? parseInt(formData.quartos) : 0,
        banheiros: formData.banheiros ? parseInt(formData.banheiros) : 0,
        vagas: formData.vagas ? parseInt(formData.vagas) : 0,
        iptu: formData.iptu ? parseFloat(formData.iptu) : 0,
        condominio: formData.condominio ? parseFloat(formData.condominio) : 0,
        whatsapp: formData.whatsapp,
        descricao: formData.descricao,
        imagens: imagens,
        comodidades: comodidadesSelecionadas,
        latitude: coordenadas?.latitude,
        longitude: coordenadas?.longitude,
        status: formData.disponibilidade
      }

      await axios.post('/api/imoveis', imovelData)

      alert('Imovel cadastrado com sucesso!')
      navigate('/area-corretor')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao cadastrar imovel. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="cadastrar-container">
      <Header />

      <div className="cadastrar-content">
        <div className="page-header">
          <h1> Cadastrar Imovel</h1>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">ℹ️</span>
              Informacoes Basicas
            </h2>

            <div className="form-group">
              <label htmlFor="titulo">Titulo do Anuncio *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Ex: Apartamento 2 quartos na Cambeba"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria">Categoria *</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="aluguel">Aluguel</option>
                  <option value="compra">Compra</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo *</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="disponibilidade-label">Disponibilidade *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="disponibilidade"
                    value="disponivel"
                    checked={formData.disponibilidade === 'disponivel'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Disponível</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="disponibilidade"
                    value="indisponivel"
                    checked={formData.disponibilidade === 'indisponivel'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Indisponível</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">📍</span>
              Localizacao
            </h2>

            <div className="form-row">
              <div className="form-group" style={{ flex: '3' }}>
                <label htmlFor="rua">Rua/Avenida *</label>
                <input
                  type="text"
                  id="rua"
                  name="rua"
                  value={formData.rua}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Rua Joaquim Martins"
                />
              </div>

              <div className="form-group" style={{ flex: '1' }}>
                <label htmlFor="numero">Numero *</label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                  placeholder="398"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bairro">Bairro *</label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Dionisio Torres"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cidade">Cidade *</label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Fortaleza"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estado">Estado *</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapa</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceara</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espirito Santo</option>
                  <option value="GO">Goias</option>
                  <option value="MA">Maranhao</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Para</option>
                  <option value="PB">Paraiba</option>
                  <option value="PR">Parana</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piaui</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondonia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">Sao Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  placeholder="60000-000"
                  maxLength={9}
                />
              </div>
            </div>

            <div className="validar-endereco-section">
              <button
                type="button"
                onClick={buscarEndereco}
                className="validar-btn"
                disabled={buscandoEndereco}
              >
                <span className="btn-icon">{buscandoEndereco ? '...' : '✔'}</span>
                {buscandoEndereco ? 'Validando endereco...' : 'Validar endereco'}
              </button>

              {enderecoValidado && (
                <div className="success-msg">
                  <span className="msg-icon">✔</span>
                  <div>
                    <strong>Endereco validado com sucesso!</strong>
                    <p>{enderecoValidado}</p>
                  </div>
                </div>
              )}
              {erroEndereco && (
                <div className="error-msg">
                  <span className="msg-icon">!</span>
                  <div>
                    <strong>Erro ao validar endereco</strong>
                    <p>{erroEndereco}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">🏠</span>
              Caracteristicas do Imovel
            </h2>
            <div className="valores-grid">
              <div className="valor-card destaque">
                <div className="valor-card-header">
                  <div className="valor-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1v22M7 5h7.5a3.5 3.5 0 1 1 0 7H9.5a3.5 3.5 0 1 0 0 7H17" />
                    </svg>
                  </div>
                  <div className="valor-textos">
                    <label htmlFor="preco" className="valor-label">Valor (R$) *</label>
                    <p className="valor-legenda">Informe o valor principal do anuncio.</p>
                  </div>
                </div>
                <div className="valor-input-wrap">
                  <span className="valor-prefix">R$</span>
                  <input
                    className="valor-input"
                    type="number"
                    id="preco"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    required
                    placeholder="250000"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {formData.categoria === 'aluguel' && (
                <>
                  <div className="valor-card">
                    <div className="valor-card-header">
                      <div className="valor-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 5h16M4 12h16M4 19h16M7 9v6M12 9v6M17 9v6" />
                        </svg>
                      </div>
                      <div className="valor-textos">
                        <label htmlFor="iptu" className="valor-label">IPTU (R$)</label>
                        <p className="valor-legenda">Opcional; adicione se existir.</p>
                      </div>
                    </div>
                    <div className="valor-input-wrap secundario">
                      <span className="valor-prefix">R$</span>
                      <input
                        className="valor-input"
                        type="number"
                        id="iptu"
                        name="iptu"
                        value={formData.iptu}
                        onChange={handleChange}
                        placeholder="300"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="valor-card">
                    <div className="valor-card-header">
                      <div className="valor-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9.5 12 4l9 5.5M5 10v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
                          <path d="M9 22h6" />
                        </svg>
                      </div>
                      <div className="valor-textos">
                        <label htmlFor="condominio" className="valor-label">Condominio (R$)</label>
                        <p className="valor-legenda">Inclua se o imovel tiver taxa.</p>
                      </div>
                    </div>
                    <div className="valor-input-wrap secundario">
                      <span className="valor-prefix">R$</span>
                      <input
                        className="valor-input"
                        type="number"
                        id="condominio"
                        name="condominio"
                        value={formData.condominio}
                        onChange={handleChange}
                        placeholder="450"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="comodidades-section">
              <label className="comodidades-label">
                <span className="label-icon">+</span>
                Comodidades (opcional)
              </label>
              <p className="hint">Selecione as comodidades que se aplicam; clique novamente para remover ou use "Outros" para adicionar manualmente.</p>
              <div className="comodidades-grid">
                {comodidadesSugestoes.map(item => (
                  <button
                    key={item}
                    type="button"
                    className={`comodidade-pill ${comodidadesSelecionadas.includes(item) ? 'ativo' : ''}`}
                    onClick={() => alternarComodidade(item)}
                  >
                    <span className="pill-dot" aria-hidden="true"></span>
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  className={`comodidade-pill outro ${mostrarCampoOutro ? 'ativo' : ''}`}
                  onClick={() => setMostrarCampoOutro(prev => !prev)}
                >
                  <span className="pill-plus" aria-hidden="true">+</span>
                  Outros
                </button>
              </div>

              {mostrarCampoOutro && (
                <div className="comodidade-outros">
                  <input
                    type="text"
                    value={comodidadePersonalizada}
                    onChange={(event) => setComodidadePersonalizada(event.target.value)}
                    onKeyDown={handleOutroKeyDown}
                    placeholder="Digite ou cole uma comodidade que nao esteja na lista"
                  />
                  <button type="button" onClick={adicionarComodidadePersonalizada}>
                    Adicionar
                  </button>
                </div>
              )}

              {comodidadesSelecionadas.length > 0 && (
                <div className="comodidades-selecionadas">
                  {comodidadesSelecionadas.map(item => (
                    <span key={item} className="tag-comodidade">
                      {item}
                      <button type="button" onClick={() => removerComodidade(item)} aria-label={`Remover ${item}`}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area">
                  <span className="label-icon">{'\uD83D\uDCCF'}</span>
                  Metragem (m²)
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="52"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quartos">
                  <span className="label-icon">{'\uD83D\uDECF'}</span>
                  Quartos
                </label>
                <input
                  type="number"
                  id="quartos"
                  name="quartos"
                  value={formData.quartos}
                  onChange={handleChange}
                  placeholder="2"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="banheiros">
                  <span className="label-icon">{'\uD83D\uDEC1'}</span>
                  Banheiros
                </label>
                <input
                  type="number"
                  id="banheiros"
                  name="banheiros"
                  value={formData.banheiros}
                  onChange={handleChange}
                  placeholder="1"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vagas">
                  <span className="label-icon">{'\uD83D\uDE97'}</span>
                  Vagas
                </label>
                <input
                  type="number"
                  id="vagas"
                  name="vagas"
                  value={formData.vagas}
                  onChange={handleChange}
                  placeholder="1"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">📞</span>
              Contato e Fotos
            </h2>

            <div className="form-group">
              <label htmlFor="whatsapp">
                <span className="label-icon">{'\uD83D\uDCAC'}</span>
                WhatsApp para Contato *
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                placeholder="(85) 99999-9999"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imagens">
                <span className="label-icon">{'\uD83D\uDCF7'}</span>
                Fotos do Imovel (ate 10)
              </label>
              <input
                type="file"
                id="imagens"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="file-input"
                disabled={imagens.length >= 10}
              />
              {imagens.length > 0 && (
                <div className="imagens-preview">
                  {imagens.map((img, index) => (
                    <div key={index} className="imagem-preview-item">
                      <img src={img} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removerImagem(index)}
                        className="remover-imagem-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <small className="hint">{imagens.length}/10 imagens adicionadas</small>
            </div>

            <div className="form-group">
              <label htmlFor="descricao">
                <span className="label-icon">{'\u270E'}</span>
                Descricao
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva as caracteristicas do imovel, diferenciais, comodidades proximas..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/area-corretor')}
              className="cancel-btn"
              disabled={enviando}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-btn" disabled={enviando}>
              {enviando ? 'Cadastrando...' : 'Cadastrar Imovel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CadastrarImovel
