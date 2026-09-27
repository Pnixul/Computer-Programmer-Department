import type { AdminUser } from '~/types/admin'

export default defineNuxtRouteMiddleware(async (to) => {
  const path = decodeURI(to.path).toLowerCase().replace(/\/$/, '')
  if (path !== '/admin' && !path.startsWith('/admin/')) return
  const { user } = useAdminAuth()
  if (import.meta.server) {
    // Server middleware already verified this request and refreshed its cookies.
    user.value = useRequestEvent()?.context.adminUser ?? null
  } else {
    try {
      user.value = await $fetch<AdminUser>('/api/admin/session', { retry: 0, timeout: 15000 })
    } catch (cause) {
      const status = (cause as { statusCode?: number }).statusCode
      user.value = null
      if (status !== 401 && status !== 403) {
        throw createError({ statusCode: 503, statusMessage: 'Unable to verify admin access. Please try again.' })
      }
    }
  }
  const isLogin = path === '/admin/login'
  if (!user.value && !isLogin) return navigateTo('/admin/login', { replace: true })
  if (user.value && isLogin) return navigateTo('/admin', { replace: true })
})
