import { createError, deleteCookie, getHeader, getRequestURL, parseCookies, setHeader } from 'h3'
import type { H3Event } from 'h3'
import type { AdminUser } from '../../types/admin'

export const preventAdminCaching = (event: H3Event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')
  setHeader(event, 'Vary', 'Cookie')
}

export const requireAdminMutation = (event: H3Event) => {
  preventAdminCaching(event)
  // Custom header requires a same-origin request (no cross-origin CORS grants).
  // Also reject a mismatched Origin, including login/logout CSRF.
  const origin = getHeader(event, 'origin')
  if (getHeader(event, 'x-admin-request') !== '1' ||
      (origin && origin !== getRequestURL(event).origin)) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid request origin' })
  }
}

export const clearAdminCookies = (event: H3Event) => {
  const names = new Set<string>([...Object.keys(parseCookies(event)), ...(event.context.adminCookieNames ?? [])])
  for (const name of names) {
    if (name === adminCookieName || name.startsWith(`${adminCookieName}.`)) {
      deleteCookie(event, name, { path: '/', httpOnly: true, sameSite: 'strict', secure: !import.meta.dev })
    }
  }
}

export const verifyAdminMembership = async (database: ReturnType<typeof getAdminDatabase>, userId: string) => {
  const { data, error } = await database.from('admin_users').select('user_id').eq('user_id', userId)
    .abortSignal(AbortSignal.timeout(8000)).maybeSingle()
  if (error) throw createError({ statusCode: 503, statusMessage: 'Admin authorization unavailable' })
  if (!data) throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
}

export const requireAdmin = async (event: H3Event) => {
  preventAdminCaching(event)
  if (!Object.keys(parseCookies(event)).some(name => name === adminCookieName || name.startsWith(`${adminCookieName}.`))) {
    throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  }
  const database = getAdminDatabase(event)
  const { data: { user }, error } = await database.auth.getUser()
  if (error && (!error.status || error.status === 429 || error.status >= 500)) {
    throw createError({ statusCode: 503, statusMessage: 'Authentication service unavailable' })
  }
  if (error || !user) {
    clearAdminCookies(event)
    throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  }
  await verifyAdminMembership(database, user.id)
  const admin: AdminUser = { id: user.id, email: user.email ?? '' }
  return { database, admin }
}
