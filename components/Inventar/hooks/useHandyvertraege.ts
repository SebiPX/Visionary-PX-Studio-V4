import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { Handyvertrag } from '../types'

export function useHandyvertraege() {
  const [vertraege, setVertraege] = useState<Handyvertrag[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVertraege = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('handyvertraege')
      .select('*')
      .order('handynummer', { ascending: true })
    if (error) console.error('[useHandyvertraege]', error)
    else setVertraege(data as Handyvertrag[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchVertraege() }, [fetchVertraege])

  async function createVertrag(entry: Omit<Handyvertrag, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('handyvertraege').insert(entry).select().single()
    if (error) throw new Error(error.message)
    setVertraege(prev => [...prev, data as Handyvertrag])
    return data as Handyvertrag
  }

  async function updateVertrag(id: string, updates: Partial<Handyvertrag>) {
    const { data, error } = await supabase
      .from('handyvertraege')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) throw new Error(error.message)
    setVertraege(prev => prev.map(v => v.id === id ? data as Handyvertrag : v))
    return data as Handyvertrag
  }

  async function deleteVertrag(id: string) {
    const { error } = await supabase.from('handyvertraege').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setVertraege(prev => prev.filter(v => v.id !== id))
  }

  return { vertraege, loading, createVertrag, updateVertrag, deleteVertrag }
}
