<script setup>
const openIndex = ref(0)

const faqItems = [
  {
    question: 'แผนกคอมพิวเตอร์โปรแกรมเมอร์ได้เรียนอะไรบ้าง?',
    answer: {
      intro: 'ภายในแผนกจะได้เรียนรู้เกี่ยวกับ',
      bullets: [
        'การเขียนโปรแกรม',
        'การพัฒนาเว็บไซต์และแอปพลิเคชัน',
        'การจัดการฐานข้อมูล',
        'การประกอบและดูแลระบบคอมพิวเตอร์'
      ]
    }
  },
  {
    question: 'ต้องมีพื้นฐานการเขียนโปรแกรมมาก่อนไหม?',
    answer: {
      intro: 'ไม่จำเป็น เพราะหลักสูตรเริ่มสอนตั้งแต่พื้นฐาน',
      bullets: [
        'เริ่มเรียนได้แม้ไม่มีประสบการณ์',
        'ฝึกปฏิบัติควบคู่กับการเรียน',
        'พัฒนาทักษะไปตามลำดับ'
      ]
    }
  },
  {
    question: 'มีการฝึกประสบการณ์วิชาชีพหรือฝึกงานไหม?',
    answer: {
      intro: 'มี โดยหลักสูตรกำหนดให้มีการฝึกประสบการณ์วิชาชีพ เพื่อเรียนรู้การทำงานจริงในสถานประกอบการ',
      bullets: []
    }
  },
  {
    question: 'เรียนจบแล้วสามารถทำงานอะไรได้บ้าง?',
    answer: {
      intro: 'สามารถนำความรู้ไปต่อยอดได้หลายสายงาน เช่น',
      bullets: [
        'นักพัฒนาเว็บไซต์',
        'นักพัฒนาโปรแกรม',
        'เจ้าหน้าที่ไอที',
        'ผู้ทดสอบซอฟต์แวร์',
        'ศึกษาต่อในสาขาที่เกี่ยวข้อง'
      ]
    }
  },
  {
    question: 'ระหว่างเรียนจะได้ลงมือทำโปรเจกต์จริงบ้างไหม?',
    answer: {
      intro: 'ภายในหลักสูตรมีการฝึกปฏิบัติผ่าน',
      bullets: [
        'โปรเจกต์ตามรายวิชา',
        'กิจกรรมภายในหลักสูตร',
        'การฝึกทักษะจากสถานการณ์จริง'
      ]
    }
  },
  {
    question: 'สมัครเรียนได้อย่างไร?',
    answer: {
      intro: 'สามารถติดตามรายละเอียดได้ผ่าน',
      bullets: [
        'Facebook งานประชาสัมพันธ์ วิทยาลัยเทคนิคนครพนม',
        'ช่องทางประชาสัมพันธ์ของวิทยาลัย'
      ]
    }
  }
]

const toggleItem = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="site-section pt-10 sm:pt-12 md:pt-16 lg:pt-20">
    <div class="site-container">
      <div class="mx-auto max-w-[1080px]">
        <header class="section-header mx-auto text-center">
          <h2 class="section-title">
            คำถามที่พบบ่อย
          </h2>
          <p class="body-copy mx-auto mt-5 max-w-3xl">
            รวมคำถามที่ผู้สนใจเข้าศึกษามักสอบถามเกี่ยวกับแผนกคอมพิวเตอร์โปรแกรมเมอร์
          </p>
        </header>

        <div class="grid items-start gap-3 sm:gap-4 lg:grid-cols-2">
          <article
            v-for="(item, index) in faqItems"
            :key="item.question"
            class="faq-item rounded-[18px]"
            :class="{ 'faq-item-active': openIndex === index }"
          >
            <h3>
              <button
                :id="`faq-question-${index}`"
                class="faq-trigger flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:gap-6 sm:px-5 sm:py-6"
                type="button"
                :aria-expanded="openIndex === index"
                :aria-controls="`faq-answer-${index}`"
                @click="toggleItem(index)"
              >
                <span class="text-[15px] font-bold leading-7 text-[var(--color-text)] sm:text-base md:text-lg">
                  {{ item.question }}
                </span>
                <span class="faq-icon" aria-hidden="true">
                  {{ openIndex === index ? '−' : '+' }}
                </span>
              </button>
            </h3>

            <div
              :id="`faq-answer-${index}`"
              class="faq-answer-grid"
              :class="{ 'faq-answer-grid-open': openIndex === index }"
              role="region"
              :aria-labelledby="`faq-question-${index}`"
              :aria-hidden="openIndex !== index"
            >
              <div class="min-h-0 overflow-hidden">
                <div class="px-5 pb-5 sm:px-6 sm:pb-6">
                  <div class="border-t border-[var(--color-border)] pt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                    <p>{{ item.answer.intro }}</p>
                    <ul
                      v-if="item.answer.bullets.length"
                      class="mt-3 space-y-1.5 leading-[1.7]"
                    >
                      <li
                        v-for="bullet in item.answer.bullets"
                        :key="bullet"
                        class="flex items-start gap-2.5"
                      >
                        <span
                          class="shrink-0 font-bold text-[var(--color-navy)]"
                          aria-hidden="true"
                        >▸</span>
                        <span>{{ bullet }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

@media (prefers-reduced-motion: reduce) {
  .faq-item,
  .faq-trigger,
  .faq-icon,
  .faq-answer-grid {
    transition-duration: 0.01ms;
  }
}
</style>
