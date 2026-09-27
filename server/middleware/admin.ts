export default defineEventHandler(async (event) => {
  const path = decodeURI(getRequestURL(event).pathname).toLowerCase().replace(/\/$/, '')
  if (path !== '/admin' && !path.startsWith('/admin/')) return
  preventAdminCaching(event)
  try {
    const { admin } = await requireAdmin(event)
    event.context.adminUser = admin
    if (path === '/admin/login') return sendRedirect(event, '/admin', 302)
  } catch (cause) {
    const status = (cause as { statusCode?: number }).statusCode
    if (status !== 401 && status !== 403) throw cause
    if (path !== '/admin/login') return sendRedirect(event, '/admin/login', 302)
  }
})
