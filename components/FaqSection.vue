<script setup>
const faqCategories = [
  {
    id: 'learning',
    label: 'การเรียน',
    description: 'เรียนอะไรบ้าง และเรียนแบบไหน',
    iconPaths: [
      'm8 9-3 3 3 3',
      'm16 9 3 3-3 3',
      'm14 5-4 14'
    ]
  },
  {
    id: 'internship',
    label: 'การฝึกงาน',
    description: 'การฝึกงานและประสบการณ์การทำงาน',
    iconPaths: [
      'M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z',
      'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
      'M2 12h20',
      'M12 12v3'
    ]
  },
  {
    id: 'future',
    label: 'หลังเรียนจบ',
    description: 'การทำงานและการเรียนต่อ',
    iconPaths: [
      'm22 10-10-5-10 5 10 5 10-5Z',
      'M6 12v5c3 2 9 2 12 0v-5',
      'M22 10v6'
    ]
  },
  {
    id: 'admission',
    label: 'การสมัครเรียน',
    description: 'การสมัครและติดตามข่าวสาร',
    iconPaths: [
      'M9 4h6a2 2 0 0 1 2 2H7a2 2 0 0 1 2-2Z',
      'M9 2h6v4H9z',
      'M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2',
      'M8 12h8',
      'M8 16h8'
    ]
  }
]

const faqItems = [
  {
    category: 'learning',
    question: 'แผนกคอมพิวเตอร์โปรแกรมเมอร์เรียนอะไรบ้าง?',
    answer: 'เรียนรู้ตั้งแต่พื้นฐานการเขียนโปรแกรม การพัฒนาเว็บไซต์ ฐานข้อมูล ระบบคอมพิวเตอร์ และเครือข่าย พร้อมฝึกทักษะผ่านงานและโปรเจกต์ระหว่างเรียน'
  },
  {
    category: 'learning',
    question: 'ไม่เคยเขียนโปรแกรมมาก่อนเรียนได้ไหม?',
    answer: 'ได้ ไม่จำเป็นต้องมีพื้นฐานการเขียนโปรแกรมมาก่อน หากสนใจคอมพิวเตอร์และพร้อมเรียนรู้ สามารถเริ่มเรียนรู้พื้นฐานไปพร้อมกันได้'
  },
  {
    category: 'learning',
    question: 'ระหว่างเรียนมีโปรเจกต์ให้ทำไหม?',
    answer: 'มี นักเรียนจะได้ฝึกนำความรู้ที่เรียนมาใช้ผ่านงานและโปรเจกต์ในแต่ละช่วงของการเรียน เพื่อฝึกการคิด การแก้ปัญหา และการลงมือทำจริง'
  },
  {
    category: 'learning',
    question: 'การเรียนเน้นทฤษฎีหรือการปฏิบัติ?',
    answer: 'มีทั้งการเรียนพื้นฐานทางทฤษฎีและการฝึกปฏิบัติ โดยเน้นให้นักเรียนได้ทดลองและนำความรู้ไปใช้ผ่านงานและโปรเจกต์'
  },
  {
    category: 'internship',
    question: 'มีการฝึกงานหรือไม่?',
    answer: 'มี ในชั้นปีสุดท้ายนักเรียนสามารถเลือกออกฝึกงาน เพื่อเรียนรู้การทำงานและเก็บประสบการณ์จากสถานประกอบการ'
  },
  {
    category: 'internship',
    question: 'ฝึกงานในชั้นปีไหน?',
    answer: 'การฝึกงานอยู่ในช่วงชั้นปีที่ 3 ซึ่งเป็นช่วงที่นักเรียนสามารถนำความรู้และทักษะที่สะสมจากการเรียนไปใช้ในสภาพแวดล้อมการทำงานจริง'
  },
  {
    category: 'future',
    question: 'เรียนจบแล้วสามารถทำงานอะไรได้บ้าง?',
    answer: 'ความรู้และทักษะที่ได้สามารถนำไปต่อยอดในสายงานด้านการพัฒนาเว็บไซต์ การพัฒนาโปรแกรม งานด้าน IT การทดสอบซอฟต์แวร์ และงานด้านเทคโนโลยีอื่น ๆ ที่เกี่ยวข้อง'
  },
  {
    category: 'future',
    question: 'สามารถเรียนต่อด้านไหนได้บ้าง?',
    answer: 'สามารถนำพื้นฐานจากสาขาไปต่อยอดการศึกษาในสาขาที่เกี่ยวข้องกับคอมพิวเตอร์และเทคโนโลยี เช่น เทคโนโลยีสารสนเทศ วิทยาการคอมพิวเตอร์ วิศวกรรมคอมพิวเตอร์ หรือสาขาอื่นที่เกี่ยวข้อง โดยขึ้นอยู่กับคุณสมบัติและเงื่อนไขของแต่ละสถานศึกษา'
  },
  {
    category: 'admission',
    question: 'สมัครเรียนได้อย่างไร?',
    answer: 'รายละเอียดและขั้นตอนการสมัครอาจแตกต่างกันในแต่ละปีการศึกษา แนะนำให้ติดตามประกาศรับสมัครอย่างเป็นทางการของวิทยาลัยเทคนิคนครพนม'
  },
  {
    category: 'admission',
    question: 'เปิดรับสมัครช่วงไหน?',
    answer: 'ช่วงเวลารับสมัครอาจเปลี่ยนแปลงในแต่ละปี ควรตรวจสอบประกาศล่าสุดจากช่องทางอย่างเป็นทางการของวิทยาลัยเพื่อให้ได้ข้อมูลที่ถูกต้อง'
  },
  {
    category: 'admission',
    question: 'ติดตามข่าวการรับสมัครได้จากที่ไหน?',
    answer: 'สามารถติดตามข่าวสารและประกาศเกี่ยวกับการรับสมัครผ่านช่องทางประชาสัมพันธ์อย่างเป็นทางการของวิทยาลัยเทคนิคนครพนม'
  }
]

const selectedCategory = ref('learning')
const openQuestion = ref(faqItems[0].question)

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
  openQuestion.value = categoryId === 'all'
    ? faqItems[0].question
    : faqItems.find(item => item.category === categoryId)?.question
}

const toggleItem = (question) => {
  openQuestion.value = openQuestion.value === question ? null : question
}
</script>

<template>
  <section id="faq" class="site-section pt-10 sm:pt-12 md:pt-16 lg:pt-20">
    <div class="site-container">
      <div class="mx-auto max-w-[1080px]">
        <header class="section-header mx-auto text-center">
          <p class="eyebrow">FAQ</p>
          <h2 class="section-title">
            คำถามที่พบบ่อย
          </h2>
          <p class="body-copy mx-auto mt-5 max-w-3xl">
            รวมคำถามที่ผู้สนใจเข้าศึกษามักสอบถามเกี่ยวกับแผนกคอมพิวเตอร์โปรแกรมเมอร์
          </p>
        </header>

        <div role="group" aria-label="เลือกหัวข้อคำถาม">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              v-for="category in faqCategories"
              :key="category.id"
              class="faq-category-card flex min-h-36 flex-col items-start rounded-2xl p-5 text-left sm:min-h-40"
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
              <span class="mt-4 text-lg font-bold leading-tight text-[var(--color-text)]">
                {{ category.label }}
              </span>
              <span class="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
                {{ category.description }}
              </span>
            </button>
          </div>

          <div class="mt-4 flex justify-end">
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

        <div id="faq-list" class="mt-8 sm:mt-10">
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
                    class="faq-trigger flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:gap-6 sm:px-5 sm:py-6"
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
  box-shadow: 0 8px 24px rgba(23, 32, 51, 0.045);
  transition: border-color 200ms ease, background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}

.faq-category-card:hover {
  border-color: var(--color-blue-border);
  box-shadow: 0 12px 30px rgba(36, 59, 107, 0.09);
  transform: translateY(-2px);
}

.faq-category-card:focus-visible,
.faq-show-all:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.faq-category-card-active {
  border-color: var(--color-navy);
  background: var(--color-blue-soft);
  box-shadow: 0 14px 34px rgba(36, 59, 107, 0.12);
}

.faq-category-card-active::after {
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
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-blue-border);
  border-radius: 0.875rem;
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
