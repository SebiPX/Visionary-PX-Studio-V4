import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// ─── Config shape ────────────────────────────────────────────────────────────
export interface DashboardConfig {
  show_links: boolean
  /** null = all categories; string[] = only these categories */
  link_categories: string[] | null
  show_calendar: boolean
  show_loans: boolean
  show_inventory_stats: boolean
  pinned_login_ids: string[]
}

export const DEFAULT_CONFIG: DashboardConfig = {
  show_links: true,
  link_categories: null,
  show_calendar: true,
  show_loans: true,
  show_inventory_stats: true,
  pinned_login_ids: [],
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data, error } = await supabase
        .from('inventar_dashboard_config')
        .select('config')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) { console.error('[useDashboardConfig] load:', error); return }

      if (data?.config) {
        // Merge with defaults so new keys always have a value
        setConfig({ ...DEFAULT_CONFIG, ...(data.config as Partial<DashboardConfig>) })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const save = useCallback(async (next: DashboardConfig) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('inventar_dashboard_config')
        .upsert({ user_id: user.id, config: next, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' })

      if (error) { console.error('[useDashboardConfig] save:', error); return }
      setConfig(next)
    } finally {
      setSaving(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { config, loading, saving, save }
}
