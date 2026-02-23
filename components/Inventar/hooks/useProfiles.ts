import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { Profile } from '../types'

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role')
      .order('full_name', { ascending: true })
      .then(({ data }) => {
        setProfiles(data || [])
        setLoading(false)
      })
  }, [])

  return { profiles, loading }
}
