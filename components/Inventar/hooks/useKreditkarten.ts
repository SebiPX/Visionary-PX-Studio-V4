import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { Kreditkarte } from '../types'

export function useKreditkarten() {
  const [kreditkarten, setKreditkarten] = useState<Kreditkarte[]>([])
  const [loading, setLoading] = useState(true)

  const fetchKreditkarten = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('kreditkarten')
      .select('*')
      .order('name', { ascending: true })
    if (error) console.error('[useKreditkarten]', error)
    else setKreditkarten(data as Kreditkarte[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchKreditkarten() }, [fetchKreditkarten])

  async function createKreditkarte(entry: Omit<Kreditkarte, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('kreditkarten').insert(entry).select().single()
    if (error) throw new Error(error.message)
    setKreditkarten(prev => [...prev, data as Kreditkarte])
    return data as Kreditkarte
  }

  async function updateKreditkarte(id: string, updates: Partial<Kreditkarte>) {
    const { data, error } = await supabase
      .from('kreditkarten')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) throw new Error(error.message)
    setKreditkarten(prev => prev.map(k => k.id === id ? data as Kreditkarte : k))
    return data as Kreditkarte
  }

  async function deleteKreditkarte(id: string) {
    const { error } = await supabase.from('kreditkarten').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setKreditkarten(prev => prev.filter(k => k.id !== id))
  }

  return { kreditkarten, loading, createKreditkarte, updateKreditkarte, deleteKreditkarte }
}
