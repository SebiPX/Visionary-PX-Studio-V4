import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { Verleihschein, VerleihscheinItem } from '../types'

interface CreateVerleihscheinInput {
  borrower_type: 'team' | 'extern'
  profile_id?: string | null
  extern_name?: string | null
  extern_firma?: string | null
  extern_email?: string | null
  extern_telefon?: string | null
  abholzeit: string
  rueckgabezeit: string
  prozentsatz: number
  gesamtkosten: number
  zweck?: string | null
  notizen?: string | null
  created_by?: string | null
}

interface CreateVerleihscheinItemInput {
  item_id: string
  anschaffungspreis: number | null
  tagespreis: number | null
  gesamtpreis: number | null
}

export function useVerleihscheine() {
  const [scheine, setScheine] = useState<Verleihschein[]>([])
  const [archivierte, setArchivierte] = useState<Verleihschein[]>([])
  const [loading, setLoading] = useState(true)
  const [archiveLoading, setArchiveLoading] = useState(false)

  async function fetchByStatus(status: 'aktiv' | 'erledigt'): Promise<Verleihschein[]> {
    const { data: scheineData, error: scheineErr } = await supabase
      .from('verleihscheine')
      .select('*, profile:profiles!profile_id(id, full_name, email)')
      .eq('status', status)
      .order('erledigt_am', { ascending: false })

    if (scheineErr) {
      console.error(`[useVerleihscheine] fetch ${status} error:`, scheineErr)
      return []
    }
    if (!scheineData || scheineData.length === 0) return []

    const ids = scheineData.map((s: { id: string }) => s.id)
    const { data: itemsData, error: itemsErr } = await supabase
      .from('verleihschein_items')
      .select('*, item:inventar_items(id, geraet, modell, px_nummer, status)')
      .in('verleihschein_id', ids)

    if (itemsErr) console.error('[useVerleihscheine] items error:', itemsErr)

    const itemsBySchein = new Map<string, VerleihscheinItem[]>()
    for (const li of (itemsData || [])) {
      const sid = (li as { verleihschein_id: string }).verleihschein_id
      if (!itemsBySchein.has(sid)) itemsBySchein.set(sid, [])
      itemsBySchein.get(sid)!.push(li as VerleihscheinItem)
    }
    return scheineData.map((s: { id: string }) => ({
      ...s,
      items: itemsBySchein.get(s.id) || [],
    })) as Verleihschein[]
  }

  const fetchScheine = useCallback(async () => {
    setLoading(true)
    const merged = await fetchByStatus('aktiv')
    setScheine(merged)
    setLoading(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchArchive = useCallback(async () => {
    setArchiveLoading(true)
    const merged = await fetchByStatus('erledigt')
    setArchivierte(merged)
    setArchiveLoading(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchScheine() }, [fetchScheine])

  async function createVerleihschein(
    header: CreateVerleihscheinInput,
    items: CreateVerleihscheinItemInput[]
  ): Promise<Verleihschein> {
    const { data: schein, error: scheinErr } = await supabase
      .from('verleihscheine')
      .insert(header)
      .select()
      .single()
    if (scheinErr) throw new Error(scheinErr.message)

    const lineItems = items.map(i => ({
      verleihschein_id: schein.id,
      item_id: i.item_id,
      anschaffungspreis: i.anschaffungspreis,
      tagespreis: i.tagespreis,
      gesamtpreis: i.gesamtpreis,
    }))
    if (lineItems.length > 0) {
      const { error: itemsErr } = await supabase.from('verleihschein_items').insert(lineItems)
      if (itemsErr) throw new Error(itemsErr.message)
    }

    for (const item of items) {
      await supabase
        .from('inventar_items')
        .update({ status: 'Ausgeliehen', updated_at: new Date().toISOString() })
        .eq('id', item.item_id)
    }

    await fetchScheine()
    return schein as Verleihschein
  }

  async function markErledigt(id: string, itemIds: string[]) {
    const { error } = await supabase
      .from('verleihscheine')
      .update({ status: 'erledigt', erledigt_am: new Date().toISOString() })
      .eq('id', id)
    if (error) throw new Error(error.message)

    for (const itemId of itemIds) {
      await supabase
        .from('inventar_items')
        .update({ status: 'Vorhanden', updated_at: new Date().toISOString() })
        .eq('id', itemId)
    }

    setScheine(prev => prev.filter(s => s.id !== id))
  }

  return { scheine, archivierte, loading, archiveLoading, fetchScheine, fetchArchive, createVerleihschein, markErledigt }
}
