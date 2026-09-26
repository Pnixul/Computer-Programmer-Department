import test from 'node:test'
import assert from 'node:assert/strict'
import { validateFaqInput, validateFaqPatch } from '../shared/faq-validation.ts'
import { requireFaqAdmin, validateFaqId, parseFaqBody } from '../server/utils/faq.ts'
import { faqSeedItems } from '../data/faq.ts'

const valid = { category: 'learning', question: ' A question? ', answer: ' First line\nSecond line ' }

test('input trims surrounding whitespace and preserves answer paragraphs', () => {
  assert.deepEqual(validateFaqInput(valid), { category: 'learning', question: 'A question?', answer: 'First line\nSecond line' })
})

test('rejects incomplete, oversized, invalid and unexpected fields', () => {
  for (const value of [null, [], 'text', {}, { ...valid, answer: 2 }, { ...valid, question: '\n\t\u2003' },
    { ...valid, category: 'admin' }, { ...valid, id: 'client-controlled' }, { ...valid, sort_order: 1 },
    { ...valid, answer: '\0' }, { ...valid, question: 'x'.repeat(241) }, { ...valid, answer: 'x'.repeat(4001) },
    { question: 'Missing fields' }]) {
    assert.throws(() => validateFaqInput(value))
  }
  assert.doesNotThrow(() => validateFaqInput({ ...valid, question: 'x'.repeat(240), answer: 'x'.repeat(4000) }))
})

test('PATCH accepts subsets without erasing other fields and rejects empty patches', () => {
  assert.deepEqual(validateFaqPatch({ answer: ' Updated ' }), { answer: 'Updated' })
  assert.throws(() => validateFaqPatch({}))
  assert.throws(() => validateFaqPatch({ question: '' }))
})

test('seed entries all satisfy the real API model and retain unique import IDs', () => {
  assert.equal(new Set(faqSeedItems.map(item => item.id)).size, faqSeedItems.length)
  for (const { id, ...input } of faqSeedItems) assert.doesNotThrow(() => validateFaqInput(input))
})

test('server validation returns 400 for invalid IDs and payloads', () => {
  assert.equal(validateFaqId('937804c1-b795-4cc8-bf00-a91f42bd0a11'), '937804c1-b795-4cc8-bf00-a91f42bd0a11')
  for (const id of [undefined, 'faq-01', '../../anything', 'id,another-id']) {
    assert.throws(() => validateFaqId(id), { statusCode: 400 })
  }
  assert.throws(() => parseFaqBody({ ...valid, category: 'unknown' }, validateFaqInput), { statusCode: 400 })
})

test('writes unconditionally fail closed until Admin Auth is implemented', () => {
  assert.throws(() => requireFaqAdmin(), error => error.statusCode === 403 && error.data.code === 'FAQ_WRITES_DISABLED')
})
