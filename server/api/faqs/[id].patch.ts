import { validateFaqPatch } from '~/shared/faq-validation'

export default defineEventHandler(async (event) => {
  requireAdminMutation(event)
  const { database } = await requireAdmin(event)
  const id = validateFaqId(getRouterParam(event, 'id'))
  const input = parseFaqBody(await readBody(event), validateFaqPatch)
  const { data, error } = await database
    .from('faqs').update(input).eq('id', id)
    .select('id, category, question, answer')
    .abortSignal(AbortSignal.timeout(8000))
    .maybeSingle()
  if (error) throw faqDatabaseError()
  if (!data) throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  return data
})
