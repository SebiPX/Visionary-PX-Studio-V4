import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { InternalLink } from '../types'

export function useLinks() {
  const [links, setLinks] = useState<InternalLink[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('inventar_links')
      .select('*')
      .order('kategorie', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('titel', { ascending: true })
    if (error) console.error('[useLinks]', error)
    else setLinks(data as InternalLink[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  async function createLink(entry: Omit<InternalLink, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('inventar_links')
      .insert(entry)
      .select()
      .single()
    if (error) throw new Error(error.message)
    setLinks(prev => [...prev, data as InternalLink].sort((a, b) => (a.sort_order - b.sort_order) || (a.titel.localeCompare(b.titel, 'de'))))
    return data as InternalLink
  }

  async function updateLink(id: string, updates: Partial<InternalLink>) {
    const { data, error } = await supabase
      .from('inventar_links')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    setLinks(prev => prev.map(l => l.id === id ? data as InternalLink : l))
    return data as InternalLink
  }

  async function deleteLink(id: string) {
    const { error } = await supabase.from('inventar_links').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setLinks(prev => prev.filter(l => l.id !== id))
  }

  return { links, loading, fetchLinks, createLink, updateLink, deleteLink }
}
