export default defineEventHandler(async (event) => {
  requireAdminMutation(event)
  const { database } = await requireAdmin(event)
  const id = validateFaqId(getRouterParam(event, 'id'))
  const { data, error } = await database
    .from('faqs').delete().eq('id', id).select('id')
    .abortSignal(AbortSignal.timeout(8000))
    .maybeSingle()
  if (error) throw faqDatabaseError()
  if (!data) throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  return sendNoContent(event)
})
