import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie } from 'h3'
import type { H3Event } from 'h3'
import type { Database } from '../types/database'

const getSupabaseConfig = (event: H3Event) => {
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
  return { url, key }
}

export const getFaqDatabase = (event: H3Event) => {
  const { url, key } = getSupabaseConfig(event)
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

export const adminCookieName = 'cp-admin-session'

export const getAdminDatabase = (event: H3Event) => {
  const { url, key } = getSupabaseConfig(event)
  return createServerClient<Database>(url, key, {
    cookieOptions: { name: adminCookieName, path: '/', httpOnly: true, sameSite: 'strict', secure: !import.meta.dev },
    cookies: {
      getAll: () => Object.entries(parseCookies(event)).map(([name, value]) => ({ name, value })),
      setAll: cookies => {
        for (const { name, value, options } of cookies) {
          event.context.adminCookieNames ??= new Set<string>()
          event.context.adminCookieNames.add(name)
          setCookie(event, name, value, options)
        }
      },
    },
  })
}
