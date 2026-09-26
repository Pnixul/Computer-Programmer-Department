<script setup lang="ts">
import { faqCategories } from '~/data/faq'
import type { FaqInput, FaqItem } from '~/types/faq'

definePageMeta({ layout: 'admin' })
useHead({ title: 'จัดการ FAQ | จัดการเว็บไซต์แผนก' })
const { items, status, error, refresh, createFaq, updateFaq, deleteFaq } = useFaqs()
const editorOpen = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')
const actionError = ref('')
const message = ref('')
const questionField = ref<HTMLInputElement | null>(null)
const listHeading = ref<HTMLHeadingElement | null>(null)
const addButton = ref<HTMLButtonElement | null>(null)
const form = reactive<FaqInput>({ question: '', answer: '', category: 'learning' })
const categoryLabel = (id: string) => faqCategories.find(category => category.id === id)?.label

const openEditor = async (item?: FaqItem) => {
  editingId.value = item?.id ?? null
  Object.assign(form, { question: item?.question ?? '', answer: item?.answer ?? '', category: item?.category ?? 'learning' })
  formError.value = ''
  actionError.value = ''
  message.value = ''
  editorOpen.value = true
  await nextTick()
  questionField.value?.focus()
}

const closeEditor = async () => {
  const returnId = editingId.value
  editorOpen.value = false
  editingId.value = null
  await nextTick()
  const editButton = returnId ? document.getElementById(`edit-${returnId}`) : null
  const focusTarget = editButton ?? addButton.value
  focusTarget?.focus()
}

const save = async () => {
  if (saving.value) return
  formError.value = ''
  saving.value = true
  try {
    if (editingId.value) await updateFaq(editingId.value, form)
    else await createFaq(form)
    message.value = editingId.value ? 'บันทึกการแก้ไขแล้ว' : 'เพิ่มคำถามแล้ว'
    saving.value = false
    await closeEditor()
  } catch (cause) {
    formError.value = cause instanceof Error ? cause.message : 'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    saving.value = false
  }
}

const remove = async (item: FaqItem) => {
  if (saving.value) return
  if (!window.confirm(`ลบคำถามนี้หรือไม่?\n\n${item.question}\n\nเมื่อลบแล้วจะไม่สามารถกู้คืนผ่านหน้านี้ได้`)) return
  saving.value = true
  actionError.value = ''
  try {
    await deleteFaq(item.id)
    message.value = 'ลบคำถามแล้ว'
    await nextTick()
    listHeading.value?.focus()
  } catch (cause) {
    actionError.value = cause instanceof Error ? cause.message : 'ลบไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold sm:text-3xl">จัดการคำถามที่พบบ่อย</h1>
        <p class="mt-2 text-sm leading-7 text-[var(--color-muted)]">คำถามชุดเดียวกับหน้าเว็บไซต์ · {{ items.length }} รายการ</p>
      </div>
      <button ref="addButton" type="button" class="admin-button admin-button-primary" :disabled="editorOpen || saving || status !== 'success'" @click="openEditor()">เพิ่มคำถาม</button>
    </div>

    <p role="status" class="mb-4 text-sm text-[var(--color-navy)]">{{ message }}</p>
    <p v-if="actionError" role="alert" class="mb-4 text-sm text-red-800">{{ actionError }}</p>

    <section v-if="editorOpen" class="admin-panel mb-6" aria-labelledby="faq-editor-title">
      <h2 id="faq-editor-title" class="text-xl font-bold">{{ editingId ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่' }}</h2>
      <p id="faq-form-help" class="mt-2 text-sm leading-7 text-[var(--color-muted)]">กรอกทุกช่อง · คำตอบแสดงเป็นข้อความธรรมดา</p>
      <form class="mt-5 space-y-5" aria-describedby="faq-form-help" :aria-busy="saving" @submit.prevent="save">
        <fieldset :disabled="saving" class="min-w-0 space-y-5">
          <legend class="sr-only">รายละเอียดคำถาม</legend>
          <label class="block text-sm font-bold" for="faq-category">หมวดหมู่
            <select id="faq-category" v-model="form.category" class="admin-field sm:max-w-xs" required>
              <option v-for="category in faqCategories" :key="category.id" :value="category.id">{{ category.label }}</option>
            </select>
          </label>
          <label class="block text-sm font-bold" for="faq-question">คำถาม
            <input id="faq-question" ref="questionField" v-model="form.question" class="admin-field" required maxlength="240" aria-describedby="question-hint">
          </label>
          <p id="question-hint" class="text-xs text-[var(--color-muted)]">ไม่เกิน 240 ตัวอักษร</p>
          <label class="block text-sm font-bold" for="faq-answer">คำตอบ
            <textarea id="faq-answer" v-model="form.answer" class="admin-field" required maxlength="4000" rows="7" aria-describedby="answer-hint" />
          </label>
          <p id="answer-hint" class="text-xs text-[var(--color-muted)]">{{ form.answer.length.toLocaleString('th-TH') }} / 4,000 ตัวอักษร</p>
          <p v-if="formError" role="alert" class="text-sm text-red-800">{{ formError }}</p>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button type="submit" class="admin-button admin-button-primary">{{ saving ? 'กำลังบันทึก…' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มคำถาม' }}</button>
            <button type="button" class="admin-button" @click="closeEditor">ยกเลิก</button>
          </div>
        </fieldset>
      </form>
    </section>

    <h2 ref="listHeading" tabindex="-1" class="mb-4 text-lg font-bold">รายการคำถาม</h2>
    <p v-if="status === 'pending'" class="admin-panel" role="status">กำลังโหลดคำถาม…</p>
    <div v-else-if="status === 'error'" class="admin-panel" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="admin-button mt-4" @click="refresh">ลองอีกครั้ง</button>
    </div>
    <div v-else-if="!items.length" class="admin-panel">
      <p class="font-bold">ยังไม่มีคำถาม</p>
      <p class="mt-2 text-sm text-[var(--color-muted)]">เลือก “เพิ่มคำถาม” เพื่อสร้างรายการแรก</p>
    </div>
    <ul v-else class="space-y-4">
      <li v-for="item in items" :key="item.id" class="admin-panel">
        <article>
          <p class="text-xs font-bold text-[var(--color-blue)]">{{ categoryLabel(item.category) }}</p>
          <h3 :id="`title-${item.id}`" class="mt-2 font-bold leading-7">{{ item.question }}</h3>
          <p class="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--color-muted)]">{{ item.answer }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button :id="`edit-${item.id}`" type="button" class="admin-button" :disabled="editorOpen || saving" :aria-describedby="`title-${item.id}`" @click="openEditor(item)">แก้ไข</button>
            <button type="button" class="admin-button admin-button-danger" :disabled="editorOpen || saving" :aria-describedby="`title-${item.id}`" @click="remove(item)">ลบ</button>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>
