import { Request, Response } from 'express'
import { supabase } from '../lib/supabase'

export const listarImoveis = async (_req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('imoveis')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar imóveis' })
  }
}

export const buscarImovelPorId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('imoveis')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error

    if (!data) {
      return res.status(404).json({ error: 'Imóvel não encontrado' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar imóvel' })
  }
}

export const criarImovel = async (req: Request, res: Response): Promise<any> => {
  try {
    const novoImovel = {
      ...req.body,
      criado_em: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('imoveis')
      .insert([novoImovel])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar imóvel' })
  }
}

export const atualizarImovel = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params

    // Verificar se imóvel existe
    const { data: imovelExistente, error: erroVerificacao } = await supabase
      .from('imoveis')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (erroVerificacao && erroVerificacao.code !== 'PGRST116') throw erroVerificacao

    if (!imovelExistente) {
      return res.status(404).json({ error: 'Imóvel não encontrado' })
    }

    const atualizacoes = {
      ...req.body,
      atualizado_em: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('imoveis')
      .update(atualizacoes)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar imóvel' })
  }
}

export const deletarImovel = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params

    // Verificar se imóvel existe
    const { data: imovelExistente, error: erroVerificacao } = await supabase
      .from('imoveis')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (erroVerificacao && erroVerificacao.code !== 'PGRST116') throw erroVerificacao

    if (!imovelExistente) {
      return res.status(404).json({ error: 'Imóvel não encontrado' })
    }

    const { error } = await supabase
      .from('imoveis')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar imóvel' })
  }
}


