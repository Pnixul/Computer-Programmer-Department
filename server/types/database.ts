import type { FaqInput, FaqItem } from '../../types/faq'

// Keep aligned with the FAQ migration; replace with generated Supabase types later.
export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string; created_at: string }
        Insert: { user_id: string; created_at?: string }
        Update: never
        Relationships: []
      }
      faqs: {
        Row: { [K in keyof FaqItem]: FaqItem[K] } & { sort_order: number; created_at: string }
        Insert: { [K in keyof FaqInput]: FaqInput[K] } & { id?: string; created_at?: string }
        Update: Partial<FaqInput>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
