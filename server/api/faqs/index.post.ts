import { validateFaqInput } from '~/shared/faq-validation'

export default defineEventHandler(async (event) => {
  requireFaqAdmin()
  const input = parseFaqBody(await readBody(event), validateFaqInput)
  const { data, error } = await getFaqDatabase(event)
    .from('faqs').insert(input).select('id, category, question, answer')
    .abortSignal(AbortSignal.timeout(8000))
    .single()
  if (error) throw faqDatabaseError()
  setResponseStatus(event, 201)
  return data
})
