import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { InventarLoan } from '../types'

export function useLoans(itemId?: string) {
  const [loans, setLoans] = useState<InventarLoan[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLoans = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('inventar_loans')
      .select('*, profile:profiles(id, full_name, email, avatar_url, role), item:inventar_items(id, geraet, modell, px_nummer, bild_url)')
      .order('created_at', { ascending: false })

    if (itemId) query = query.eq('item_id', itemId)

    const { data, error } = await query
    if (!error) setLoans(data || [])
    setLoading(false)
  }, [itemId])

  useEffect(() => { fetchLoans() }, [fetchLoans])

  async function createLoan(loan: {
    item_id: string
    profile_id?: string | null
    mitarbeiter_name?: string
    department?: string
    ausgeliehen_am: string
    zurueck_bis?: string | null
    zweck?: string
    notes?: string
    created_by?: string | null
  }) {
    const { data, error } = await supabase
      .from('inventar_loans')
      .insert(loan)
      .select('*, profile:profiles(id, full_name, email, avatar_url, role)')
      .single()
    if (error) throw new Error(error.message)
    setLoans(prev => [data, ...prev])
    return data
  }

  async function returnLoan(id: string) {
    const { data, error } = await supabase
      .from('inventar_loans')
      .update({ zurueck_am: new Date().toISOString().split('T')[0] })
      .eq('id', id)
      .select('*, profile:profiles(id, full_name, email, avatar_url, role)')
      .single()
    if (error) throw new Error(error.message)
    setLoans(prev => prev.map(l => l.id === id ? data : l))
    return data
  }

  async function deleteLoan(id: string) {
    const { error } = await supabase
      .from('inventar_loans')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
    setLoans(prev => prev.filter(l => l.id !== id))
  }

  const activeLoans = loans.filter(l => !l.zurueck_am)
  const pastLoans = loans.filter(l => !!l.zurueck_am)

  return { loans, activeLoans, pastLoans, loading, fetchLoans, createLoan, returnLoan, deleteLoan }
}
