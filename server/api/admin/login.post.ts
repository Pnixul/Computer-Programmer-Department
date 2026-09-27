export default defineEventHandler(async (event) => {
  requireAdminMutation(event)
  const body = await readBody(event)
  if (!body || typeof body.email !== 'string' || typeof body.password !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) || body.email.length > 254 ||
      !body.password || body.password.length > 1024) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }
  const database = getAdminDatabase(event)
  const { data, error } = await database.auth.signInWithPassword({ email: body.email.trim(), password: body.password })
  if (error || !data.user) {
    throw createError({
      statusCode: error?.status === 429 ? 429 : error && (!error.status || error.status >= 500) ? 503 : 401,
      statusMessage: 'Unable to sign in',
    })
  }
  try {
    await verifyAdminMembership(database, data.user.id)
  } catch (cause) {
    await database.auth.signOut({ scope: 'local' })
    clearAdminCookies(event)
    throw cause
  }
  return { id: data.user.id, email: data.user.email ?? '' }
})
