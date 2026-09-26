export type FaqCategoryId = 'learning' | 'internship' | 'future' | 'admission'

export interface FaqCategory {
  id: FaqCategoryId
  label: string
  description: string
  iconPaths: string[]
}

export interface FaqInput {
  category: FaqCategoryId
  question: string
  answer: string
}

export interface FaqItem extends FaqInput {
  id: string
}
