import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { InventarItem } from '../types'

export function useInventar() {
  const [items, setItems] = useState<InventarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('inventar_items')
      .select('*')
      .order('geraet', { ascending: true })
      .order('px_nummer', { ascending: true })

    if (error) setError(error.message)
    else setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  async function createItem(item: Omit<InventarItem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('inventar_items')
      .insert(item)
      .select()
      .single()
    if (error) throw new Error(error.message)
    setItems(prev => [...prev, data])
    return data
  }

  async function updateItem(id: string, updates: Partial<InventarItem>) {
    const { data, error } = await supabase
      .from('inventar_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    setItems(prev => prev.map(i => i.id === id ? data : i))
    return data
  }

  async function deleteItem(id: string) {
    const { error } = await supabase
      .from('inventar_items')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  async function uploadImage(file: File, pxNummer: string): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `${pxNummer || Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('inventar-images')
      .upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('inventar-images').getPublicUrl(path)
    return data.publicUrl
  }

  return { items, loading, error, fetchItems, createItem, updateItem, deleteItem, uploadImage }
}
