<script setup>
import { faqCategories, faqItems } from '~/data/faq'

const selectedCategory = ref('learning')
const openQuestion = ref(null)

const filteredFaqItems = computed(() => {
  if (selectedCategory.value === 'all') return faqItems
  return faqItems.filter(item => item.category === selectedCategory.value)
})

const selectedCategoryLabel = computed(() => {
  if (selectedCategory.value === 'all') return 'คำถามทั้งหมด'
  return faqCategories.find(category => category.id === selectedCategory.value)?.label
})

const getCategoryLabel = categoryId => (
  faqCategories.find(category => category.id === categoryId)?.label
)

const getQuestionIndex = item => faqItems.indexOf(item)

const selectCategory = (categoryId) => {
  if (selectedCategory.value === categoryId) return

  selectedCategory.value = categoryId
  openQuestion.value = null
}

const toggleItem = (question) => {
  openQuestion.value = openQuestion.value === question ? null : question
}
</script>

<template>
  <section class="site-section pt-10 sm:pt-12 md:pt-16 lg:pt-20">
    <div id="faq" class="site-container section-scroll-anchor">
      <div class="mx-auto max-w-[1080px]">
        <header class="faq-section-header section-header mx-auto text-center">
          <p class="eyebrow">FAQ</p>
          <h2 class="section-title">
            คำถามที่พบบ่อย
          </h2>
          <p class="body-copy mx-auto mt-5 max-w-3xl">
            รวมคำถามที่ผู้สนใจเข้าศึกษามักสอบถามเกี่ยวกับแผนกคอมพิวเตอร์โปรแกรมเมอร์
          </p>
        </header>

        <div role="group" aria-label="เลือกหัวข้อคำถาม">
          <div class="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            <button
              v-for="category in faqCategories"
              :key="category.id"
              class="faq-category-card flex min-h-16 items-center gap-2.5 rounded-2xl px-2.5 py-2.5 text-left sm:min-h-40 sm:flex-col sm:items-start sm:gap-0 sm:p-5 lg:min-h-0 lg:flex-row lg:items-center lg:gap-3 lg:px-4 lg:py-3"
              :class="{ 'faq-category-card-active': selectedCategory === category.id }"
              type="button"
              :aria-pressed="selectedCategory === category.id"
              aria-controls="faq-list"
              @click="selectCategory(category.id)"
            >
              <span class="faq-category-icon" aria-hidden="true">
                <svg
                  class="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    v-for="path in category.iconPaths"
                    :key="path"
                    :d="path"
                  />
                </svg>
              </span>
              <span class="faq-category-title min-w-0 text-sm font-bold leading-5 text-[var(--color-text)] sm:mt-4 sm:text-lg sm:leading-tight lg:mt-0 lg:text-base">
                {{ category.label }}
              </span>
              <span class="mt-1.5 hidden text-sm leading-6 text-[var(--color-muted)] sm:block lg:hidden">
                {{ category.description }}
              </span>
            </button>
          </div>

          <div class="mt-3 flex justify-end sm:mt-4">
            <button
              class="faq-show-all inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-bold"
              :class="{ 'faq-show-all-active': selectedCategory === 'all' }"
              type="button"
              :aria-pressed="selectedCategory === 'all'"
              aria-controls="faq-list"
              @click="selectCategory('all')"
            >
              ดูทั้งหมด
              <span class="ml-2 text-xs font-semibold opacity-70">{{ faqItems.length }}</span>
            </button>
          </div>
        </div>

        <div id="faq-list" class="mt-5 sm:mt-10">
          <div class="mb-4 flex items-end justify-between gap-4">
            <h3 class="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
              {{ selectedCategoryLabel }}
            </h3>
            <p class="shrink-0 text-sm font-semibold text-[var(--color-muted)]">
              {{ filteredFaqItems.length }} คำถาม
            </p>
          </div>

          <Transition name="faq-list" mode="out-in">
            <div
              :key="selectedCategory"
              class="grid items-start gap-3 sm:gap-4 lg:grid-cols-2"
            >
              <article
                v-for="item in filteredFaqItems"
                :key="item.question"
                class="faq-item rounded-[18px]"
                :class="{ 'faq-item-active': openQuestion === item.question }"
              >
                <h4>
                  <button
                    :id="`faq-question-${getQuestionIndex(item)}`"
                    class="faq-trigger flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:gap-6 sm:px-5 sm:py-6 lg:py-4"
                    type="button"
                    :aria-expanded="openQuestion === item.question"
                    :aria-controls="`faq-answer-${getQuestionIndex(item)}`"
                    @click="toggleItem(item.question)"
                  >
                    <span>
                      <span
                        v-if="selectedCategory === 'all'"
                        class="mb-1.5 block text-xs font-bold text-[var(--color-blue)]"
                      >
                        {{ getCategoryLabel(item.category) }}
                      </span>
                      <span class="block text-[15px] font-bold leading-7 text-[var(--color-text)] sm:text-base md:text-lg">
                        {{ item.question }}
                      </span>
                    </span>
                    <span class="faq-icon" aria-hidden="true">
                      {{ openQuestion === item.question ? '−' : '+' }}
                    </span>
                  </button>
                </h4>

                <div
                  :id="`faq-answer-${getQuestionIndex(item)}`"
                  class="faq-answer-grid"
                  :class="{ 'faq-answer-grid-open': openQuestion === item.question }"
                  role="region"
                  :aria-labelledby="`faq-question-${getQuestionIndex(item)}`"
                  :aria-hidden="openQuestion !== item.question"
                >
                  <div class="min-h-0 overflow-hidden">
                    <div class="px-5 pb-5 sm:px-6 sm:pb-6">
                      <div class="border-t border-[var(--color-border)] pt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                        <p>{{ item.answer }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-category-card {
  position: relative;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 2px 8px rgba(23, 32, 51, 0.035);
  transition: border-color 200ms ease, background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}

.faq-category-card:hover {
  border-color: var(--color-blue-border);
  box-shadow: 0 3px 10px rgba(36, 59, 107, 0.05);
}

.faq-category-card:focus-visible,
.faq-show-all:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.faq-category-card-active {
  border-color: var(--color-navy);
  background: var(--color-blue-soft);
  box-shadow: 0 4px 12px rgba(36, 59, 107, 0.07);
}

.faq-category-card-active::after {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--color-yellow);
  content: '';
}

.faq-category-icon {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 2.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-blue-border);
  border-radius: 0.75rem;
  background: var(--color-blue-soft);
  color: var(--color-blue);
  transition: border-color 200ms ease, background-color 200ms ease, color 200ms ease;
}

.faq-category-card-active .faq-category-icon {
  border-color: var(--color-navy);
  background: var(--color-navy);
  color: var(--color-yellow);
}

.faq-show-all {
  border: 1px solid var(--color-blue-border);
  background: var(--color-surface);
  color: var(--color-navy);
  transition: border-color 200ms ease, background-color 200ms ease, color 200ms ease, box-shadow 200ms ease;
}

.faq-show-all:hover {
  border-color: var(--color-blue);
  color: var(--color-blue);
  box-shadow: 0 8px 20px rgba(36, 59, 107, 0.08);
}

.faq-show-all-active {
  border-color: var(--color-navy);
  background: var(--color-navy);
  color: var(--color-yellow);
}

.faq-show-all-active:hover {
  border-color: var(--color-navy);
  color: var(--color-yellow);
}

.faq-item {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 8px 24px rgba(23, 32, 51, 0.045);
  transition: border-color 250ms ease, box-shadow 250ms ease, transform 250ms ease;
}

.faq-item:hover {
  border-color: var(--color-blue-border);
  box-shadow: 0 12px 30px rgba(36, 59, 107, 0.08);
  transform: translateY(-1px);
}

.faq-item-active {
  border-color: rgba(59, 95, 168, 0.38);
  box-shadow: 0 14px 34px rgba(36, 59, 107, 0.1);
}

.faq-trigger {
  border-radius: 18px;
  transition: background-color 250ms ease;
}

.faq-trigger:hover {
  background: rgba(238, 243, 251, 0.68);
}

.faq-trigger:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.faq-icon {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-blue-border);
  border-radius: 0.75rem;
  background: var(--color-blue-soft);
  color: var(--color-navy);
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1;
  transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease, transform 250ms ease;
}

.faq-item-active .faq-icon {
  border-color: var(--color-navy);
  background: var(--color-navy);
  color: var(--color-yellow);
}

.faq-answer-grid {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 250ms ease, opacity 200ms ease;
}

.faq-answer-grid-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.faq-list-enter-active,
.faq-list-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.faq-list-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.faq-list-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (min-width: 640px) {
  .faq-category-card {
    box-shadow: 0 8px 24px rgba(23, 32, 51, 0.045);
  }

  .faq-category-card:hover {
    box-shadow: 0 12px 30px rgba(36, 59, 107, 0.09);
    transform: translateY(-2px);
  }

  .faq-category-card-active {
    box-shadow: 0 14px 34px rgba(36, 59, 107, 0.12);
  }

  .faq-category-card-active::after {
    display: block;
  }

  .faq-category-icon {
    width: 3rem;
    height: 3rem;
    flex-basis: 3rem;
    border-radius: 0.875rem;
  }
}

@media (max-width: 639px) {
  .faq-section-header {
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .faq-category-card {
    box-shadow: none;
  }

  .faq-category-card:hover {
    border-color: var(--color-blue-border);
    background: var(--color-blue-soft);
    box-shadow: none;
    transform: none;
  }

  .faq-category-card-active,
  .faq-category-card-active:hover {
    border-color: var(--color-navy);
    background: var(--color-navy);
    box-shadow: none;
  }

  .faq-category-card-active::after {
    display: none;
  }

  .faq-category-icon {
    width: 2.5rem;
    height: 2.5rem;
    flex: 0 0 2.5rem;
    border-radius: 0.75rem;
  }

  .faq-category-card-active .faq-category-icon {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }

  .faq-category-card-active .faq-category-title {
    color: var(--color-surface);
  }

  .faq-item {
    box-shadow: 0 2px 8px rgba(23, 32, 51, 0.035);
  }

  .faq-item:hover {
    border-color: var(--color-blue-border);
    box-shadow: 0 3px 10px rgba(36, 59, 107, 0.05);
    transform: none;
  }

  .faq-item-active {
    box-shadow: 0 4px 14px rgba(36, 59, 107, 0.055);
  }

  .faq-icon {
    width: 2.25rem;
    height: 2.25rem;
    flex-basis: 2.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-category-card,
  .faq-category-icon,
  .faq-show-all,
  .faq-item,
  .faq-trigger,
  .faq-icon,
  .faq-answer-grid,
  .faq-list-enter-active,
  .faq-list-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
