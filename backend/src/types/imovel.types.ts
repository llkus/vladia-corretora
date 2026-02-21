export interface Imovel {
  id: string
  titulo: string
  tipo: 'casa' | 'apartamento' | 'terreno' | 'comercial'
  endereco: string
  enderecoFormatado?: string
  latitude?: number
  longitude?: number
  preco: number
  area: number
  quartos?: number
  banheiros?: number
  descricao: string
  imagens?: string[]
  comodidades?: string[]
  aluguel?: number
  condominio?: number
  iptu?: number
  valorTotal?: number
  valorAbaixoMercado?: boolean
  status: 'disponivel' | 'indisponivel' | 'vendido' | 'alugado'
  criadoEm: Date
  atualizadoEm?: Date
}

export interface CriarImovelDTO {
  titulo: string
  tipo: 'casa' | 'apartamento' | 'terreno' | 'comercial'
  endereco: string
  preco: number
  area: number
  quartos?: number
  banheiros?: number
  descricao: string
  comodidades?: string[]
  aluguel?: number
  condominio?: number
  iptu?: number
  valorTotal?: number
  valorAbaixoMercado?: boolean
}








