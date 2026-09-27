<script setup>
import { learningItems } from '~/data/learning'

const section = ref(null)
const visualColumn = ref(null)
const activeIndex = ref(-1)
const displayedIndex = ref(-1)
let observer

// Decode only the requested illustration; retain the previous one while it loads.
watch(activeIndex, async (index, _, onCleanup) => {
  let cancelled = false
  onCleanup(() => { cancelled = true })
  if (index < 0) return
  const image = new Image()
  image.src = learningItems[index].image
  try {
    await image.decode()
    if (!cancelled) displayedIndex.value = index
  } catch {
    // Keep the last available illustration if an asset cannot load.
  }
})

const observeReadingZone = () => {
  observer?.disconnect()
  if (!window.matchMedia('(min-width: 1024px)').matches) {
    activeIndex.value = -1
    displayedIndex.value = -1
    return
  }
  const navbarHeight = parseFloat(getComputedStyle(visualColumn.value).top) || 0
  const center = (window.innerHeight + navbarHeight) / 2
  observer = new IntersectionObserver((entries) => {
    const distance = entry => Math.abs(entry.boundingClientRect.top + entry.boundingClientRect.height / 2 - center)
    const closest = entries.filter(entry => entry.isIntersecting).sort((a, b) => distance(a) - distance(b))[0]
    if (closest) activeIndex.value = Number(closest.target.dataset.learningIndex)
  }, { rootMargin: `-${center - 1}px 0px -${window.innerHeight - center - 1}px 0px`, threshold: 0 })

  section.value.querySelectorAll('[data-learning-index]').forEach(card => observer.observe(card))
}

onMounted(() => {
  observeReadingZone()
  window.addEventListener('resize', observeReadingZone)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', observeReadingZone)
})
</script>

<template>
  <section id="curriculum" ref="section" class="site-section">
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
        class="learning-scroll-layout grid gap-10 lg:grid-cols-[42fr_58fr] lg:gap-14 xl:gap-16"
      >
        <div
          ref="visualColumn"
          class="learning-visual-column hidden lg:sticky lg:block lg:self-start"
          data-learning-visual
          :data-active-card="learningItems[activeIndex]?.number"
        >
          <div class="learning-illustration">
            <Transition name="learning-visual">
              <img
                v-if="displayedIndex >= 0"
                :key="learningItems[displayedIndex].number"
                class="learning-visual-image"
                :src="learningItems[displayedIndex].image"
                :alt="learningItems[displayedIndex].visual"
                width="1536"
                height="1024"
                decoding="async"
              >
            </Transition>
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
                class="learning-card surface-card"
              >
                <p class="text-3xl font-extrabold leading-none text-[var(--color-navy)] md:text-4xl">
                  {{ item.number }}
                </p>
                <h3 class="min-w-0 text-xl font-bold leading-relaxed text-[var(--color-text)] sm:text-2xl">
                  {{ item.title }}
                </h3>
                <div class="hidden h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-blue-border)] bg-[var(--color-blue-soft)] sm:flex lg:hidden xl:flex">
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
                <p class="learning-card-description text-base text-[var(--color-muted)] sm:text-[17px] lg:text-lg">
                  {{ item.description }}
                </p>
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

.learning-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  align-content: center;
  gap: 1.25rem 1rem;
}

.learning-card-description {
  grid-column: 1 / -1;
  line-height: 1.9;
}

@media (min-width: 640px) {
  .learning-card {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 1.5rem;
    padding: 2rem;
  }
}

.learning-illustration {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  max-height: calc(var(--learning-viewport) * 0.8);
}

.learning-visual-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.learning-visual-enter-active,
.learning-visual-leave-active {
  transition: opacity 180ms ease-out;
}

.learning-visual-enter-from,
.learning-visual-leave-to {
  opacity: 0;
}

.learning-cards-column {
  min-width: 0;
}

@media (min-width: 1024px) {
  .learning-card {
    grid-template-columns: auto minmax(0, 1fr);
  }
}

@media (min-width: 1280px) {
  .learning-card {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
}

/* Center the compact pair below the navbar; spacing belongs to the scroll stage. */
@media (min-width: 1024px) {
  .learning-scroll-layout {
    --learning-viewport: calc(100svh - var(--navbar-height));
  }

  .learning-visual-column {
    top: var(--navbar-height);
    display: flex;
    align-items: center;
    height: var(--learning-viewport);
  }

  .learning-card-stage {
    gap: 0;
    padding-block: calc(var(--learning-viewport) * 0.125);
  }

  .learning-card-position {
    display: grid;
    align-items: center;
    min-height: calc(var(--learning-viewport) * 0.75);
    padding-block: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .learning-visual-enter-active,
  .learning-visual-leave-active {
    transition: none;
  }
}
</style>
