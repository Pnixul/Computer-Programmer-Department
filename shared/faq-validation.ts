import type { FaqCategoryId, FaqInput } from '../types/faq'

const categories: FaqCategoryId[] = ['learning', 'internship', 'future', 'admission']
const fields = ['category', 'question', 'answer']

export const validateFaqPatch = (value: unknown): Partial<FaqInput> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('ข้อมูลคำถามต้องเป็นออบเจ็กต์')
  }
  const body = value as Record<string, unknown>
  const keys = Object.keys(body)
  if (!keys.length || keys.some(key => !fields.includes(key))) {
    throw new Error('กรุณาระบุเฉพาะหมวดหมู่ คำถาม หรือคำตอบ')
  }
  const result: Partial<FaqInput> = {}
  if ('category' in body) {
    if (typeof body.category !== 'string' || !categories.includes(body.category as FaqCategoryId)) {
      throw new Error('กรุณาเลือกหมวดหมู่ที่ถูกต้อง')
    }
    result.category = body.category as FaqCategoryId
  }
  for (const field of ['question', 'answer'] as const) {
    if (!(field in body)) continue
    const text = body[field]
    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('กรุณากรอกคำถามและคำตอบ โดยไม่ใช้เพียงช่องว่าง')
    }
    const normalized = text.trim()
    if (normalized.includes('\0') || normalized.length > (field === 'question' ? 240 : 4000)) {
      throw new Error('คำถามยาวได้ไม่เกิน 240 ตัวอักษร คำตอบไม่เกิน 4,000 ตัวอักษร และต้องไม่มีอักขระว่าง NUL')
    }
    result[field] = normalized
  }
  return result
}

export const validateFaqInput = (value: unknown): FaqInput => {
  const result = validateFaqPatch(value)
  if (!result.category || !result.question || !result.answer) {
    throw new Error('กรุณากรอกหมวดหมู่ คำถาม และคำตอบให้ครบ')
  }
  return { category: result.category, question: result.question, answer: result.answer }
}
