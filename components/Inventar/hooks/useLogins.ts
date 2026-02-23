import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { Login } from '../types'

export function useLogins() {
  const [logins, setLogins] = useState<Login[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogins = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('logins')
      .select('*')
      .order('name', { ascending: true })
    if (error) console.error('[useLogins]', error)
    else setLogins(data as Login[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchLogins() }, [fetchLogins])

  async function createLogin(entry: Omit<Login, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('logins').insert(entry).select().single()
    if (error) throw new Error(error.message)
    setLogins(prev => [...prev, data as Login].sort((a, b) => (a.name || '').localeCompare(b.name || '')))
    return data as Login
  }

  async function updateLogin(id: string, updates: Partial<Login>) {
    const { data, error } = await supabase
      .from('logins')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) throw new Error(error.message)
    setLogins(prev => prev.map(l => l.id === id ? data as Login : l))
    return data as Login
  }

  async function deleteLogin(id: string) {
    const { error } = await supabase.from('logins').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setLogins(prev => prev.filter(l => l.id !== id))
  }

  return { logins, loading, fetchLogins, createLogin, updateLogin, deleteLogin }
}
