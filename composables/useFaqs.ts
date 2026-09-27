import { FetchError } from 'ofetch'
import { validateFaqInput } from '~/shared/faq-validation'
import type { FaqInput, FaqItem } from '~/types/faq'

export const useFaqs = () => {
  const { data: items, status, error: requestError, refresh } = useFetch<FaqItem[]>('/api/faqs', {
    key: 'faqs',
    default: () => [],
    retry: 0,
    timeout: 10000,
  })
  const error = computed(() => requestError.value ? 'ไม่สามารถโหลดคำถามได้ กรุณาลองอีกครั้ง' : null)

  const mutationError = (cause: unknown) => {
    if (cause instanceof FetchError && cause.statusCode === 401) {
      if (import.meta.client) {
        useAdminAuth().user.value = null
        void navigateTo('/admin/login')
      }
      return new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง')
    }
    if (cause instanceof FetchError && cause.statusCode === 403) {
      return new Error('บัญชีนี้ไม่มีสิทธิ์จัดการ FAQ กรุณาตรวจสอบสิทธิ์ผู้ดูแล')
    }
    return new Error('ไม่สามารถทำรายการได้ กรุณาลองอีกครั้ง')
  }

  const saveFaq = async (url: string, method: 'POST' | 'PATCH', input: FaqInput) => {
    const body = validateFaqInput(input)
    try {
      return await $fetch<FaqItem>(url, { method, body, headers: { 'x-admin-request': '1' }, retry: 0, timeout: 20000 })
    } catch (cause) {
      throw mutationError(cause)
    }
  }

  const createFaq = async (input: FaqInput) => {
    const item = await saveFaq('/api/faqs', 'POST', input)
    items.value = [...items.value, item]
    return item
  }

  const updateFaq = async (id: string, input: FaqInput) => {
    const item = await saveFaq('/api/faqs/' + encodeURIComponent(id), 'PATCH', input)
    items.value = items.value.map(existing => existing.id === id ? item : existing)
    return item
  }

  const deleteFaq = async (id: string) => {
    try {
      await $fetch('/api/faqs/' + encodeURIComponent(id), { method: 'DELETE', headers: { 'x-admin-request': '1' }, retry: 0, timeout: 20000 })
    } catch (cause) {
      throw mutationError(cause)
    }
    items.value = items.value.filter(item => item.id !== id)
  }

  return { items: readonly(items), status, error, refresh: () => refresh(), createFaq, updateFaq, deleteFaq }
}
