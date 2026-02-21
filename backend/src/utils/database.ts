import { User } from '../types/user.types'
import { supabase } from '../lib/supabase'

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) throw error
  return data || []
}

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data || undefined
}

export const findUserById = async (id: string): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data || undefined
}

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

