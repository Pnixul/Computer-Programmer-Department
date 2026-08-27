<script setup>
import { learningItems } from '~/data/learning'

const learningLayout = ref(null)
const learningCardStage = ref(null)
const activeIndex = ref(0)
const cardPosition = ref(0)
const cardStageHeight = ref(400)
const cardHeights = ref([])
const endHoldViewportRatio = 0.5

let animationFrameId
let desktopMediaQuery
let learningCardElements = []

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

const updateLearningProgress = () => {
  animationFrameId = undefined

  if (!desktopMediaQuery?.matches || !learningLayout.value || !learningCardStage.value) {
    cardPosition.value = 0
    activeIndex.value = 0
    return
  }

  const stickyTop = Number.parseFloat(window.getComputedStyle(learningCardStage.value).top) || 112
  const layoutRect = learningLayout.value.getBoundingClientRect()
  const scrollDistance = Math.max(1, layoutRect.height - learningCardStage.value.offsetHeight)
  const endHoldDistance = window.innerHeight * endHoldViewportRatio
  const cardTransitionDistance = Math.max(1, scrollDistance - endHoldDistance)
  const progress = clamp((stickyTop - layoutRect.top) / cardTransitionDistance, 0, 1)
  const nextPosition = progress * (learningItems.length - 1)
  const nextStageHeight = learningCardStage.value.offsetHeight
  const nextCardHeights = learningCardElements.map(element => element?.offsetHeight || 220)

  if (cardStageHeight.value !== nextStageHeight) {
    cardStageHeight.value = nextStageHeight
  }

  if (nextCardHeights.some((height, index) => height !== cardHeights.value[index])) {
    cardHeights.value = nextCardHeights
  }

  cardPosition.value = nextPosition
  activeIndex.value = Math.round(nextPosition)
}

const requestLearningProgressUpdate = () => {
  if (animationFrameId !== undefined) return
  animationFrameId = window.requestAnimationFrame(updateLearningProgress)
}

const getCardStyle = (index) => {
  const offset = index - cardPosition.value
  const distance = Math.abs(offset)
  const cardHeight = cardHeights.value[index] || 220
  const previewRatio = 0.15
  const cardTravel = (cardStageHeight.value / 2) + (cardHeight * (0.5 - previewRatio))
  const opacity = distance <= 1
    ? 1 - (distance * 0.28)
    : 0.72 * clamp(1 - ((distance - 1) / 0.45), 0, 1)

  return {
    '--learning-card-y': `${offset * cardTravel}px`,
    '--learning-card-opacity': opacity.toFixed(3),
    '--learning-card-scale': (1 - (Math.min(distance, 1) * 0.025)).toFixed(3),
    '--learning-card-z': String(Math.max(1, 10 - Math.round(distance * 3))),
  }
}

const setLearningCardRef = (element, index) => {
  if (element) learningCardElements[index] = element
}

const getCardState = (index) => {
  if (index === activeIndex.value) return 'active'
  if (index === activeIndex.value - 1) return 'previous'
  if (index === activeIndex.value + 1) return 'next'
  return 'hidden'
}

onMounted(() => {
  desktopMediaQuery = window.matchMedia('(min-width: 768px)')
  window.addEventListener('scroll', requestLearningProgressUpdate, { passive: true })
  window.addEventListener('resize', requestLearningProgressUpdate, { passive: true })
  desktopMediaQuery.addEventListener('change', requestLearningProgressUpdate)
  requestLearningProgressUpdate()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestLearningProgressUpdate)
  window.removeEventListener('resize', requestLearningProgressUpdate)
  desktopMediaQuery?.removeEventListener('change', requestLearningProgressUpdate)

  if (animationFrameId !== undefined) {
    window.cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <section id="curriculum" class="site-section">
    <div class="site-container">
      <header class="section-header">
        <p class="eyebrow">การเรียนการสอน</p>
        <h2 class="section-title">
          เรียนรู้ผ่านการลงมือทำ
        </h2>
        <p class="body-copy mt-5 max-w-3xl">
          เรียนรู้ตั้งแต่พื้นฐานการเขียนโปรแกรม การพัฒนาเว็บไซต์ ไปจนถึงการสร้างโปรเจกต์จริง เพื่อฝึกทักษะการคิด การแก้ปัญหา และเตรียมความพร้อมสำหรับการทำงาน
        </p>
      </header>

      <div
        ref="learningLayout"
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
          <div ref="learningCardStage" class="learning-card-stage">
            <div
              v-for="(item, index) in learningItems"
              :ref="element => setLearningCardRef(element, index)"
              :key="item.number"
              class="learning-card-position"
              :style="getCardStyle(index)"
              :data-card-state="getCardState(index)"
              :aria-hidden="getCardState(index) === 'hidden' ? 'true' : undefined"
            >
              <article
                :data-learning-card="item.number"
                class="surface-card surface-card-hover grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-5"
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
                <div class="hidden h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-blue-border)] bg-[var(--color-blue-soft)] sm:flex">
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
  transform: translateY(0.35rem) scale(0.99);
  transition: opacity 260ms ease-out, transform 260ms ease-out;
}

.learning-visual-slide-active {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@media (min-width: 768px) {
  .learning-scroll-layout {
    --learning-stage-half: clamp(10rem, 23vh, 14rem);
    --learning-stage-height: clamp(20rem, 46vh, 28rem);
    --learning-sticky-top: max(7.5rem, calc(50vh - var(--learning-stage-half)));
    height: 300vh;
  }

  .learning-visual-column {
    top: var(--learning-sticky-top);
    display: flex;
    height: var(--learning-stage-height);
    align-items: center;
  }

  .learning-cards-column {
    height: 100%;
    min-width: 0;
  }

  .learning-card-stage {
    position: sticky;
    top: var(--learning-sticky-top);
    display: block;
    height: var(--learning-stage-height);
    overflow: hidden;
  }

  .learning-card-position {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: var(--learning-card-z);
    width: 100%;
    opacity: var(--learning-card-opacity);
    pointer-events: none;
    transform: translate3d(0, calc(-50% + var(--learning-card-y)), 0) scale(var(--learning-card-scale));
    transform-origin: center;
    transition: opacity 180ms ease-out, transform 90ms linear;
    will-change: opacity, transform;
  }

  .learning-card-position[data-card-state='active'] {
    pointer-events: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .learning-card-position,
  .learning-visual-slide {
    transition: none;
  }
}
</style>
