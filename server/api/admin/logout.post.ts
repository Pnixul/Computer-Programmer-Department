export default defineEventHandler(async (event) => {
  requireAdminMutation(event)
  try {
    await getAdminDatabase(event).auth.signOut({ scope: 'local' })
  } finally {
    clearAdminCookies(event)
  }
  return { signedOut: true }
})
