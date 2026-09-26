<script setup>
import { learningItems } from '~/data/learning'

const activeIndex = ref(0)
let observer
const visibleCards = new Map()

onMounted(() => {
  // Cards stay in normal document flow; only the companion visual changes.
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const index = Number(entry.target.dataset.learningIndex)
      if (entry.isIntersecting) visibleCards.set(index, entry.intersectionRatio)
      else visibleCards.delete(index)
    }
    const closest = [...visibleCards].sort((a, b) => b[1] - a[1])[0]
    if (closest) activeIndex.value = closest[0]
  }, { rootMargin: '-20% 0px -35% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] })

  document.querySelectorAll('[data-learning-index]').forEach(card => observer.observe(card))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section id="curriculum" class="site-section">
    <div class="site-container">
      <header class="section-header">
        <p class="section-kicker">การเรียนการสอน</p>
        <h2 class="section-title">
          เรียนรู้ผ่านการลงมือทำ
        </h2>
        <p class="body-copy mt-5 max-w-3xl">
          เรียนรู้ตั้งแต่พื้นฐานการเขียนโปรแกรม การพัฒนาเว็บไซต์ ไปจนถึงการสร้างโปรเจกต์จริง เพื่อฝึกทักษะการคิด การแก้ปัญหา และเตรียมความพร้อมสำหรับการทำงาน
        </p>
      </header>

      <div
        class="learning-scroll-layout grid gap-10 md:grid-cols-[42fr_58fr] lg:grid-cols-[45fr_55fr] lg:gap-14 xl:gap-16"
      >
        <div
          class="learning-visual-column hidden md:sticky md:block md:self-start"
          data-learning-visual
          :data-active-card="learningItems[activeIndex].number"
        >
          <div
            class="media-placeholder md:aspect-[4/3]"
            :aria-label="learningItems[activeIndex].visual"
          >
            <div
              v-for="(item, index) in learningItems"
              :key="item.number"
              class="learning-visual-slide"
              :class="{ 'learning-visual-slide-active': index === activeIndex }"
              :aria-hidden="index === activeIndex ? undefined : 'true'"
            >
              <p class="media-placeholder-text">
                {{ item.visual }}
              </p>
            </div>
          </div>
        </div>

        <div class="learning-cards-column" data-learning-cards>
          <div class="learning-card-stage">
            <div
              v-for="(item, index) in learningItems"
              :key="item.number"
              class="learning-card-position"
              :data-learning-index="index"
            >
              <article
                :data-learning-card="item.number"
                class="surface-card grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-5 md:grid-cols-[auto_1fr] xl:grid-cols-[auto_1fr_auto]"
              >
                <p class="text-3xl font-extrabold leading-none text-[var(--color-navy)] md:text-4xl">
                  {{ item.number }}
                </p>
                <div>
                  <h3 class="text-xl font-bold leading-tight text-[var(--color-text)] md:text-2xl">
                    {{ item.title }}
                  </h3>
                  <p class="mt-3 text-base leading-7 text-[var(--color-muted)] md:leading-8">
                    {{ item.description }}
                  </p>
                </div>
                <div class="hidden h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-blue-border)] bg-[var(--color-blue-soft)] sm:flex md:hidden xl:flex">
                  <svg
                    class="h-6 w-6 text-[var(--color-blue)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path
                      v-for="path in item.iconPaths"
                      :key="path"
                      :d="path"
                    />
                  </svg>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learning-card-stage {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.learning-card-position {
  position: static;
}

.learning-visual-slide {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease-out;
}

.learning-visual-slide-active {
  opacity: 1;
}

.learning-cards-column {
  min-width: 0;
}

@media (min-width: 768px) {
  .learning-visual-column {
    top: calc(var(--navbar-height) + 2rem);
  }
}

@media (max-height: 600px) {
  .learning-visual-column {
    position: static;
  }
}

@media (prefers-reduced-motion: reduce) {
  .learning-visual-slide {
    transition: none;
  }

  .learning-visual-column {
    position: static;
  }
}
</style>
