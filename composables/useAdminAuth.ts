import type { AdminUser } from '~/types/admin'

export const useAdminAuth = () => {
  const user = useState<AdminUser | null>('admin-user', () => null)
  const headers = { 'x-admin-request': '1' }
  const login = async (email: string, password: string) => {
    user.value = await $fetch<AdminUser>('/api/admin/login', {
      method: 'POST', body: { email, password }, headers, retry: 0, timeout: 20000,
    })
  }
  const logout = async () => {
    await $fetch('/api/admin/logout', { method: 'POST', headers, retry: 0, timeout: 20000 })
    user.value = null
    await navigateTo('/admin/login', { replace: true })
  }
  return { user, login, logout }
}
