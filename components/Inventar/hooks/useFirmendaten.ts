import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { Firmendatum } from '../types'

export function useFirmendaten() {
  const [firmendaten, setFirmendaten] = useState<Firmendatum[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFirmendaten = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('firmendaten')
      .select('*')
      .order('kategorie').order('sort_order')
    if (error) console.error('[useFirmendaten]', error)
    else setFirmendaten(data as Firmendatum[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchFirmendaten() }, [fetchFirmendaten])

  async function createEintrag(entry: Omit<Firmendatum, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('firmendaten').insert(entry).select().single()
    if (error) throw new Error(error.message)
    setFirmendaten(prev => [...prev, data as Firmendatum])
    return data as Firmendatum
  }

  async function updateEintrag(id: string, updates: Partial<Firmendatum>) {
    const { data, error } = await supabase
      .from('firmendaten')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) throw new Error(error.message)
    setFirmendaten(prev => prev.map(f => f.id === id ? data as Firmendatum : f))
    return data as Firmendatum
  }

  async function deleteEintrag(id: string) {
    const { error } = await supabase.from('firmendaten').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setFirmendaten(prev => prev.filter(f => f.id !== id))
  }

  return { firmendaten, loading, createEintrag, updateEintrag, deleteEintrag }
}
