import { createError } from 'h3'

export const requireFaqAdmin = (): void => {
  // Deliberately fail closed. Replace only after server-side session verification,
  // admin-role checks, CSRF protection and admin-only database grants/policies exist.
  // The current getFaqDatabase client is anonymous and must also be replaced for writes.
  throw createError({
    statusCode: 403,
    statusMessage: 'FAQ writes are disabled until admin authentication is implemented',
    data: { code: 'FAQ_WRITES_DISABLED' },
  })
}

export const validateFaqId = (id: string | undefined): string => {
  if (!id || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid FAQ ID' })
  }
  return id
}

export const parseFaqBody = <T>(body: unknown, validate: (value: unknown) => T): T => {
  try {
    return validate(body)
  } catch (cause) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid FAQ input',
      data: { message: cause instanceof Error ? cause.message : 'ข้อมูลคำถามไม่ถูกต้อง' },
    })
  }
}

export const faqDatabaseError = () => createError({
  statusCode: 502,
  statusMessage: 'FAQ database request failed',
})
