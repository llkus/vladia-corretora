import { Request, Response } from 'express'
import axios from 'axios'

// OpenStreetMap Nominatim - API GRATUITA sem necessidade de cartão!
const NOMINATIM_API = 'https://nominatim.openstreetmap.org'

export const geocodeEndereco = async (req: Request, res: Response): Promise<any> => {
  try {
    const { endereco } = req.body
    
    console.log('📍 Buscando endereço:', endereco)
    
    if (!endereco) {
      return res.status(400).json({ error: 'Endereço é obrigatório' })
    }

    console.log('🌍 Chamando OpenStreetMap Nominatim (GRÁTIS!)...')
    
    // Chamada à API do OpenStreetMap Nominatim
    const response = await axios.get(`${NOMINATIM_API}/search`, {
      params: {
        q: endereco,
        format: 'json',
        addressdetails: 1,
        limit: 1,
        countrycodes: 'br', // Prioriza resultados do Brasil
      },
      headers: {
        'User-Agent': 'Vladia-Corretora-App/1.0' // Necessário para o Nominatim
      }
    })

    console.log('✅ Status da resposta:', response.status)
    console.log('📊 Resultados encontrados:', response.data.length)

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'Endereço não encontrado. Tente adicionar mais detalhes (cidade, estado).' })
    }

    const result = response.data[0]
    console.log('✓ Endereço encontrado:', result.display_name)
    
    // Formatar endereço de forma mais limpa
    const endereco_formatado = result.display_name
    
    res.json({
      endereco_formatado: endereco_formatado,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      componentes: result.address,
      lugar: result.type,
      importancia: result.importance
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar endereço:')
    console.error('Tipo:', error.constructor.name)
    console.error('Mensagem:', error.message)
    console.error('Response data:', error.response?.data)
    console.error('Response status:', error.response?.status)
    
    const errorMessage = error.response?.data?.error || error.message || 'Erro ao buscar endereço'
    res.status(500).json({ 
      error: 'Erro ao buscar endereço. Tente novamente.',
      details: errorMessage
    })
  }
}

export const reverseGeocode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { latitude, longitude } = req.body
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude e longitude são obrigatórias' })
    }

    console.log('🌍 Reverse geocoding:', latitude, longitude)

    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'Vladia-Corretora-App/1.0'
      }
    })

    if (!response.data || !response.data.display_name) {
      return res.status(404).json({ error: 'Endereço não encontrado' })
    }

    const result = response.data
    
    res.json({
      endereco_formatado: result.display_name,
      componentes: result.address,
    })
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error)
    res.status(500).json({ error: 'Erro ao buscar coordenadas' })
  }
}


