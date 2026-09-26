import type { FaqItem } from '~/types/faq'

export default defineEventHandler(async (event): Promise<FaqItem[]> => {
  const { data, error } = await getFaqDatabase(event)
    .from('faqs')
    .select('id, category, question, answer')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })
    .abortSignal(AbortSignal.timeout(8000))
  if (error) throw faqDatabaseError()
  return data
})
