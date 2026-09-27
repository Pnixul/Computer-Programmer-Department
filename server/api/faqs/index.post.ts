import { validateFaqInput } from '~/shared/faq-validation'

export default defineEventHandler(async (event) => {
  requireAdminMutation(event)
  const { database } = await requireAdmin(event)
  const input = parseFaqBody(await readBody(event), validateFaqInput)
  const { data, error } = await database
    .from('faqs').insert(input).select('id, category, question, answer')
    .abortSignal(AbortSignal.timeout(8000))
    .single()
  if (error) throw faqDatabaseError()
  setResponseStatus(event, 201)
  return data
})
