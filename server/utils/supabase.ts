import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import type { Database } from '../types/database'

export const getFaqDatabase = (event: H3Event) => {
  const config = useRuntimeConfig(event)
  const url = config.supabaseUrl
  const key = config.supabasePublishableKey
  // Requiring the new publishable format also rejects accidentally supplied
  // secret/service-role keys. No privileged client is needed for public FAQs.
  if (!url || !key?.startsWith('sb_publishable_')) {
    throw createError({ statusCode: 503, statusMessage: 'FAQ service is not configured' })
  }
  try {
    if (!['https:', 'http:'].includes(new URL(url).protocol)) throw new Error()
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'FAQ service is not configured' })
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
