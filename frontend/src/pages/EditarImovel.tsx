import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import '../styles/CadastrarImovel.css'

function EditarImovel() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [carregando, setCarregando] = useState(true)
  const [enderecoValidado, setEnderecoValidado] = useState<string | null>(null)
  const [buscandoEndereco, setBuscandoEndereco] = useState(false)
  const [erroEndereco, setErroEndereco] = useState<string | null>(null)
  const [imagens, setImagens] = useState<string[]>([])
  const [enviando, setEnviando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    categoria: '',
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
    whatsapp: '',
    descricao: '',
    status: 'disponivel'
  })

  useEffect(() => {
    buscarImovel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const buscarImovel = async () => {
    try {
      setCarregando(true)
      const response = await axios.get(`http://localhost:5000/api/imoveis/${id}`)
      const imovel = response.data

      const enderecoCompleto = imovel.endereco || ''
      const partes = enderecoCompleto.split(',').map((p: string) => p.trim())

      setFormData({
        titulo: imovel.titulo || '',
        tipo: imovel.tipo || '',
        categoria: imovel.categoria || '',
        rua: partes[0] || '',
        numero: partes[1] || '',
        bairro: partes[2] || '',
        cidade: partes[3]?.split('-')[0]?.trim() || '',
        estado: partes[3]?.split('-')[1]?.trim()?.split(',')[0] || '',
        cep: imovel.cep || '',
        preco: imovel.preco?.toString() || '',
        area: imovel.area?.toString() || '',
        quartos: imovel.quartos?.toString() || '',
        banheiros: imovel.banheiros?.toString() || '',
        whatsapp: imovel.whatsapp || '',
        descricao: imovel.descricao || '',
        status: imovel.status || 'disponivel'
      })

      if (imovel.imagens && imovel.imagens.length > 0) {
        setImagens(imovel.imagens)
      }

      setEnderecoValidado(enderecoCompleto)
    } catch (error) {
      console.error('Erro ao buscar imovel:', error)
      alert('Erro ao carregar imovel')
      navigate('/area-corretor')
    } finally {
      setCarregando(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    if (['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'].includes(e.target.name)) {
      setEnderecoValidado(null)
      setErroEndereco(null)
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

      const response = await axios.post('http://localhost:5000/api/maps/geocode', {
        endereco: enderecoCompleto
      })

      const enderecoFormatado = response.data.endereco_formatado
      setEnderecoValidado(enderecoFormatado)
      setErroEndereco(null)
    } catch (error: any) {
      console.error('Erro ao buscar endereco:', error)
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
      const compressedImages = await Promise.all(filesToProcess.map(file => comprimirImagem(file)))
      setImagens([...imagens, ...compressedImages])
    } catch (error) {
      console.error('Erro ao processar imagens:', error)
      alert('Erro ao processar imagens. Tente novamente.')
    }
  }

  const removerImagem = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!enderecoValidado) {
      setErroEndereco('Por favor, valide o endereco antes de salvar')
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
        whatsapp: formData.whatsapp,
        descricao: formData.descricao,
        imagens: imagens,
        status: formData.status,
      }

      await axios.put(`http://localhost:5000/api/imoveis/${id}`, imovelData)

      alert('Imovel atualizado com sucesso!')
      navigate('/area-corretor')
    } catch (error: any) {
      console.error('Erro ao atualizar imovel:', error)
      alert(error.response?.data?.error || 'Erro ao atualizar imovel. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const handleDelete = async () => {
    if (!id) {
      alert('Imovel invalido. Recarregue a pagina e tente novamente.')
      return
    }

    const confirmou = window.confirm('Tem certeza que deseja excluir este imovel? Essa acao nao podera ser desfeita.')
    if (!confirmou) return

    setExcluindo(true)

    try {
      await axios.delete(`http://localhost:5000/api/imoveis/${id}`)
      alert('Imovel excluido com sucesso!')
      navigate('/area-corretor')
    } catch (error: any) {
      console.error('Erro ao excluir imovel:', error)
      alert(error.response?.data?.error || 'Erro ao excluir imovel. Tente novamente.')
    } finally {
      setExcluindo(false)
    }
  }

  if (carregando) {
    return (
      <div className="cadastrar-container">
        <Header />
        <div className="cadastrar-content">
          <div className="page-header">
            <h1>Carregando...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cadastrar-container">
      <Header />
      <div className="cadastrar-content">
        <div className="page-header">
          <h1>Editar Imovel</h1>
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
                placeholder="Ex: Apartamento 2 quartos"
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
                    name="status"
                    value="disponivel"
                    checked={formData.status === 'disponivel'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Disponível</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="status"
                    value="indisponivel"
                    checked={formData.status === 'indisponivel'}
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preco">
                  <span className="label-icon">{'\uD83D\uDCB0'}</span>
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                  placeholder="250000"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">
                  <span className="label-icon">{'\uD83D\uDCCF'}</span>
                  Metragem (m²) *
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  placeholder="85"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
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
              disabled={enviando || excluindo}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="delete-btn"
              disabled={enviando || excluindo}
            >
              {excluindo ? 'Excluindo...' : 'Excluir Imovel'}
            </button>
            <button type="submit" className="submit-btn" disabled={enviando || excluindo}>
              {enviando ? 'Salvando...' : 'Salvar Alteracoes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarImovel
