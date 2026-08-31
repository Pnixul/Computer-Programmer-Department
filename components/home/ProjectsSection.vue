<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { firstProject, otherProjects } from '~/data/projects'

const projects = [
  {
    number: firstProject.number,
    title: firstProject.title,
    meta: 'โปรเจกต์ของผู้เรียน',
    description: firstProject.description,
    technologies: firstProject.technologies,
  },
  ...otherProjects.map(project => ({
    ...project,
    description: 'รายละเอียดแนวคิดและสิ่งที่ผู้เรียนได้เรียนรู้จากโปรเจกต์',
    technologies: [],
  })),
]

type HangingPreset = {
  lineLeft: number
  lineRight: number
  tilt: number
  verticalOffset: number
  perspective: number
  edgeDepth: number
}

const hangingPresets: HangingPreset[] = [
  { lineLeft: 122, lineRight: 128, tilt: 0.8, verticalOffset: 2, perspective: -0.45, edgeDepth: 8 },
  { lineLeft: 142, lineRight: 136, tilt: -0.7, verticalOffset: 14, perspective: 0.5, edgeDepth: 9 },
  { lineLeft: 112, lineRight: 116, tilt: 0.45, verticalOffset: -4, perspective: -0.3, edgeDepth: 7 },
  { lineLeft: 134, lineRight: 126, tilt: -0.9, verticalOffset: 9, perspective: 0.55, edgeDepth: 10 },
  { lineLeft: 118, lineRight: 123, tilt: 0.6, verticalOffset: 5, perspective: -0.4, edgeDepth: 8 },
]

const scrollScene = ref<HTMLElement | null>(null)
const stickyStage = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const stageWidth = ref(1280)
const isDesktop = ref(false)
const isScrollReady = ref(false)
const prefersReducedMotion = ref(false)

let scrollFrameId: number | undefined
let desktopMedia: MediaQueryList | null = null
let reducedMotionMedia: MediaQueryList | null = null

const clamp = (value: number, minimum = 0, maximum = 1) => {
  return Math.min(Math.max(value, minimum), maximum)
}

const smoothstep = (value: number) => {
  const progress = clamp(value)
  return progress * progress * (3 - (2 * progress))
}

const activePosition = computed(() => scrollProgress.value * projects.length)
const activeProjectIndex = computed(() => {
  return Math.min(projects.length - 1, Math.round(activePosition.value))
})
const usesStaticPresentation = computed(() => {
  return !isScrollReady.value || !isDesktop.value || prefersReducedMotion.value
})

const getPreset = (index: number) => {
  return hangingPresets[index % hangingPresets.length] ?? hangingPresets[0]!
}

const getProjectStyle = (index: number): CSSProperties => {
  const preset = getPreset(index)

  if (usesStaticPresentation.value) {
    return {
      '--line-left': `${preset.lineLeft}px`,
      '--line-right': `${preset.lineRight}px`,
      '--board-tilt': `${preset.tilt}deg`,
      '--board-perspective': `${preset.perspective}deg`,
      '--edge-depth': `${preset.edgeDepth}px`,
      '--project-y': `${preset.verticalOffset}px`,
    } as CSSProperties
  }

  const offset = index - activePosition.value
  const distance = Math.abs(offset)
  const focus = 1 - clamp(distance)
  const direction = offset === 0 ? 0 : Math.sign(offset)
  const spacing = clamp(stageWidth.value * 0.48, 470, 650)
  const introductionClearance = (1 - smoothstep(activePosition.value / 0.78))
    * clamp(stageWidth.value * 0.18, 150, 260)
  const horizontalPosition = (offset * spacing) + introductionClearance
  const settlingOffset = (1 - focus) * -7
  const enteringTilt = direction * (1 - focus) * 0.55
  const scale = 0.965 + (focus * 0.035)

  return {
    '--line-left': `${preset.lineLeft}px`,
    '--line-right': `${preset.lineRight}px`,
    '--project-x': `${horizontalPosition.toFixed(2)}px`,
    '--project-y': `${(preset.verticalOffset + settlingOffset).toFixed(2)}px`,
    '--project-scale': scale.toFixed(4),
    '--board-tilt': `${(preset.tilt + enteringTilt).toFixed(3)}deg`,
    '--board-perspective': `${preset.perspective}deg`,
    '--edge-depth': `${preset.edgeDepth}px`,
    '--project-z': String(20 + Math.round(focus * 10)),
  } as CSSProperties
}

const introductionStyle = computed<CSSProperties>(() => {
  if (usesStaticPresentation.value) return {}

  const exitProgress = smoothstep(activePosition.value / 0.9)
  const horizontalShift = exitProgress * clamp(stageWidth.value * 0.54, 520, 760)
  const verticalShift = exitProgress * -16

  return {
    '--introduction-x': `${horizontalShift.toFixed(2)}px`,
    '--introduction-y': `${verticalShift.toFixed(2)}px`,
  } as CSSProperties
})

const conclusionStyle = computed<CSSProperties>(() => {
  if (usesStaticPresentation.value) return {}

  const offset = projects.length - activePosition.value
  const spacing = clamp(stageWidth.value * 0.48, 470, 650)

  return {
    '--conclusion-x': `${(offset * spacing).toFixed(2)}px`,
  } as CSSProperties
})

const updateProjectProgress = () => {
  scrollFrameId = undefined

  if (!scrollScene.value || !stickyStage.value) return

  stageWidth.value = stickyStage.value.offsetWidth
  isDesktop.value = desktopMedia?.matches ?? false
  prefersReducedMotion.value = reducedMotionMedia?.matches ?? false

  if (usesStaticPresentation.value) {
    scrollProgress.value = 0
    return
  }

  const sceneRect = scrollScene.value.getBoundingClientRect()
  const navbarHeight = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'),
  ) || 0
  const scrollDistance = Math.max(1, scrollScene.value.offsetHeight - stickyStage.value.offsetHeight)

  scrollProgress.value = clamp((navbarHeight - sceneRect.top) / scrollDistance)
}

const requestProjectProgressUpdate = () => {
  if (scrollFrameId !== undefined) return
  scrollFrameId = window.requestAnimationFrame(updateProjectProgress)
}

onMounted(async () => {
  desktopMedia = window.matchMedia('(min-width: 1024px)')
  reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
  isDesktop.value = desktopMedia.matches
  prefersReducedMotion.value = reducedMotionMedia.matches
  isScrollReady.value = true

  await nextTick()

  window.addEventListener('scroll', requestProjectProgressUpdate, { passive: true })
  window.addEventListener('resize', requestProjectProgressUpdate, { passive: true })
  desktopMedia.addEventListener('change', requestProjectProgressUpdate)
  reducedMotionMedia.addEventListener('change', requestProjectProgressUpdate)
  requestProjectProgressUpdate()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestProjectProgressUpdate)
  window.removeEventListener('resize', requestProjectProgressUpdate)
  desktopMedia?.removeEventListener('change', requestProjectProgressUpdate)
  reducedMotionMedia?.removeEventListener('change', requestProjectProgressUpdate)

  if (scrollFrameId !== undefined) {
    window.cancelAnimationFrame(scrollFrameId)
  }
})
</script>

<template>
  <section id="projects" class="site-section site-section-alt projects-section">
    <div
      ref="scrollScene"
      class="projects-exhibition"
      :class="{ 'projects-exhibition-static': usesStaticPresentation }"
      :style="{ '--project-transitions': projects.length }"
    >
      <div ref="stickyStage" class="projects-exhibition__stage">
        <div class="projects-exhibition__ambient" aria-hidden="true"></div>

        <header class="projects-introduction" :style="introductionStyle">
          <p class="eyebrow">Project exhibition</p>
          <h2 class="section-title">ผลงานผู้เรียน</h2>
          <p class="body-copy mt-5 max-w-md">
            จากการเรียนรู้สู่การลงมือสร้างจริง
          </p>
          <div class="projects-introduction__edition" aria-hidden="true">
            <span>Selected projects</span>
            <span>01—{{ String(projects.length).padStart(2, '0') }}</span>
          </div>
        </header>

        <p class="projects-scroll-cue" aria-hidden="true">
          <span class="projects-scroll-cue__line"></span>
          เลื่อนเพื่อชมนิทรรศการ
        </p>

        <ol class="projects-rail" aria-label="ตัวอย่างผลงานผู้เรียน">
          <li
            v-for="(project, index) in projects"
            :id="`project-${project.number}`"
            :key="project.number"
            class="hanging-project"
            :class="{ 'hanging-project-active': !usesStaticPresentation && activeProjectIndex === index && activePosition < projects.length - 0.45 }"
            :style="getProjectStyle(index)"
            :aria-current="!usesStaticPresentation && activeProjectIndex === index ? 'true' : undefined"
          >
            <div class="hanging-project__rig">
              <span class="hanging-line hanging-line-left" aria-hidden="true">
                <span class="hanging-line__ceiling"></span>
                <span class="hanging-line__fastener"></span>
              </span>
              <span class="hanging-line hanging-line-right" aria-hidden="true">
                <span class="hanging-line__ceiling"></span>
                <span class="hanging-line__fastener"></span>
              </span>

              <div class="project-board-shell">
                <span class="project-board__edge project-board__edge-right" aria-hidden="true"></span>
                <span class="project-board__edge project-board__edge-bottom" aria-hidden="true"></span>

                <article class="project-board" :aria-labelledby="`project-title-${project.number}`">
                  <span class="project-board__mount project-board__mount-left" aria-hidden="true"></span>
                  <span class="project-board__mount project-board__mount-right" aria-hidden="true"></span>

                  <div
                    class="project-board__visual"
                    role="img"
                    :aria-label="`พื้นที่สำหรับภาพประกอบโปรเจกต์ ${project.title}`"
                  >
                    <div class="project-board__visual-grid" aria-hidden="true"></div>
                    <span class="project-board__visual-number">{{ project.number }}</span>
                    <p>พื้นที่สำหรับภาพผลงาน</p>
                    <span class="project-board__visual-mark" aria-hidden="true"></span>
                  </div>

                  <div class="project-board__content">
                    <p class="project-board__meta">{{ project.meta }}</p>
                    <h3 :id="`project-title-${project.number}`" class="project-board__title">
                      {{ project.title }}
                    </h3>
                    <p class="project-board__description">
                      {{ project.description }}
                    </p>

                    <ul
                      v-if="project.technologies.length"
                      class="project-board__tags"
                      :aria-label="`เทคโนโลยีที่ใช้ใน ${project.title}`"
                    >
                      <li v-for="technology in project.technologies" :key="technology">
                        {{ technology }}
                      </li>
                    </ul>
                  </div>
                </article>
              </div>
            </div>
          </li>
        </ol>

        <div class="projects-conclusion" :style="conclusionStyle">
          <p class="projects-conclusion__overline">End of selection</p>
          <h3>ยังมีไอเดียอีกมาก<br>ให้คุณได้สำรวจ</h3>
          <p>ดูผลงานและเรื่องราวการเรียนรู้ของผู้เรียนทั้งหมด</p>
          <NuxtLink to="/projects" class="btn-primary projects-conclusion__action">
            <span>ดูโปรเจกต์ทั้งหมด</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </NuxtLink>
        </div>

        <div v-if="!usesStaticPresentation" class="projects-progress" aria-hidden="true">
          <span class="projects-progress__current">
            {{ String(Math.min(projects.length, activeProjectIndex + 1)).padStart(2, '0') }}
          </span>
          <span class="projects-progress__track">
            <span :style="{ transform: `scaleX(${Math.max(0.04, scrollProgress)})` }"></span>
          </span>
          <span>{{ String(projects.length).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
  overflow: clip;
  padding-block: 0;
  background:
    linear-gradient(180deg, rgba(238, 243, 251, 0.3), transparent 16rem),
    var(--color-surface);
}

.projects-exhibition {
  --project-board-width: clamp(22rem, 32vw, 29rem);
  position: relative;
  height: calc(100svh + (var(--project-transitions) * 82svh));
}

.projects-exhibition__stage {
  position: sticky;
  top: var(--navbar-height);
  height: calc(100svh - var(--navbar-height));
  min-height: 39rem;
  overflow: hidden;
  isolation: isolate;
}

.projects-exhibition__ambient {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(36, 59, 107, 0.025) 1px, transparent 1px) 50% 0 / min(8vw, 7rem) 100%,
    linear-gradient(180deg, rgba(23, 32, 51, 0.025), transparent 24%);
  mask-image: linear-gradient(90deg, transparent, black 20%, black 82%, transparent);
}

.projects-exhibition__ambient::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-blue-border) 20%, var(--color-blue-border) 80%, transparent);
}

.projects-introduction {
  --introduction-x: 0px;
  --introduction-y: 0px;
  position: absolute;
  top: 50%;
  left: max(2rem, calc((100vw - 1280px) / 2 + 3rem));
  z-index: 4;
  width: min(34vw, 29rem);
  transform: translate3d(calc(-1 * var(--introduction-x)), calc(-50% + var(--introduction-y)), 0);
  transition: transform 110ms linear;
  will-change: transform;
}

.projects-introduction__edition {
  display: flex;
  justify-content: space-between;
  width: min(100%, 22rem);
  margin-top: clamp(2.25rem, 6vh, 4.5rem);
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.projects-scroll-cue {
  position: absolute;
  bottom: clamp(2rem, 5vh, 3.5rem);
  left: max(2rem, calc((100vw - 1280px) / 2 + 3rem));
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.projects-scroll-cue__line {
  position: relative;
  display: block;
  width: 2.5rem;
  height: 1px;
  overflow: hidden;
  background: var(--color-blue-border);
}

.projects-scroll-cue__line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-blue);
  transform: translateX(-100%);
  animation: scroll-cue 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

.projects-rail {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hanging-project {
  --project-x: 0px;
  --project-y: 0px;
  --project-scale: 1;
  --project-z: 20;
  --board-tilt: 0deg;
  --board-perspective: 0deg;
  --edge-depth: 8px;
  position: absolute;
  top: clamp(0.35rem, 1.5vh, 1rem);
  left: 50%;
  z-index: var(--project-z);
  width: var(--project-board-width);
  height: calc(max(var(--line-left), var(--line-right)) + 31rem);
  transform: translate3d(calc(-50% + var(--project-x)), var(--project-y), 0) scale(var(--project-scale));
  transform-origin: center 15%;
  transition: transform 110ms linear;
  will-change: transform;
}

.hanging-project__rig {
  position: relative;
  width: 100%;
  height: 100%;
}

.hanging-line {
  position: absolute;
  top: 0;
  z-index: 1;
  width: 1px;
  height: var(--line-left);
  background: linear-gradient(180deg, rgba(36, 59, 107, 0.52), rgba(36, 59, 107, 0.8));
  box-shadow: 0 0 0 0.3px rgba(255, 255, 255, 0.8);
  transform-origin: top center;
}

.hanging-line-left {
  left: 21.5%;
  height: var(--line-left);
  transform: rotate(0.18deg);
}

.hanging-line-right {
  right: 21.5%;
  height: var(--line-right);
  transform: rotate(-0.15deg);
}

.hanging-line__ceiling,
.hanging-line__fastener {
  position: absolute;
  left: 50%;
  display: block;
  border-radius: 999px;
  transform: translate(-50%, -50%);
}

.hanging-line__ceiling {
  top: 0;
  width: 5px;
  height: 5px;
  border: 1px solid rgba(36, 59, 107, 0.55);
  background: var(--color-surface);
  box-shadow: 0 1px 2px rgba(23, 32, 51, 0.16);
}

.hanging-line__fastener {
  bottom: -4px;
  width: 6px;
  height: 6px;
  background: var(--color-navy);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.78), 0 2px 4px rgba(23, 32, 51, 0.2);
}

.project-board-shell {
  position: absolute;
  top: max(var(--line-left), var(--line-right));
  left: 0;
  width: 100%;
  transform: perspective(1200px) rotateY(var(--board-perspective)) rotateZ(var(--board-tilt));
  transform-origin: 50% 0;
  transition: transform 120ms linear, filter 260ms ease-out;
  filter: drop-shadow(0 1.25rem 1.25rem rgba(23, 32, 51, 0.1));
  will-change: transform;
}

.project-board-shell::before {
  content: '';
  position: absolute;
  inset: 4px calc(-1 * var(--edge-depth)) calc(-1 * var(--edge-depth)) 5px;
  z-index: -2;
  border: 1px solid #c7cedb;
  border-radius: 0.65rem;
  background: #d9dee8;
}

.project-board__edge {
  position: absolute;
  z-index: -1;
  pointer-events: none;
}

.project-board__edge-right {
  top: 6px;
  right: calc(-1 * var(--edge-depth));
  bottom: calc(-1 * var(--edge-depth) + 4px);
  width: var(--edge-depth);
  border-radius: 0 0.55rem 0.55rem 0;
  background: linear-gradient(90deg, #e6e9ef, #c7ceda);
  clip-path: polygon(0 0, 100% 5px, 100% 100%, 0 calc(100% - var(--edge-depth)));
}

.project-board__edge-bottom {
  right: calc(-1 * var(--edge-depth) + 2px);
  bottom: calc(-1 * var(--edge-depth));
  left: 6px;
  height: var(--edge-depth);
  border-radius: 0 0 0.55rem 0.55rem;
  background: linear-gradient(180deg, #d9dee7, #bec6d4);
  clip-path: polygon(0 0, calc(100% - var(--edge-depth)) 0, 100% 100%, var(--edge-depth) 100%);
}

.project-board {
  position: relative;
  overflow: hidden;
  border: 1px solid #d8dde6;
  border-radius: 0.62rem;
  background: var(--color-surface);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 0.3rem 0.7rem rgba(23, 32, 51, 0.055);
}

.project-board__mount {
  position: absolute;
  top: -1px;
  z-index: 5;
  width: 0.72rem;
  height: 0.34rem;
  border: 1px solid rgba(36, 59, 107, 0.32);
  border-top: 0;
  border-radius: 0 0 999px 999px;
  background: linear-gradient(180deg, #eef1f5, #cbd2dd);
  box-shadow: 0 1px 2px rgba(23, 32, 51, 0.1);
}

.project-board__mount-left {
  left: calc(21.5% - 0.36rem);
}

.project-board__mount-right {
  right: calc(21.5% - 0.36rem);
}

.project-board__visual {
  position: relative;
  display: flex;
  aspect-ratio: 16 / 9;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid var(--color-blue-border);
  background:
    radial-gradient(circle at 80% 18%, rgba(234, 191, 58, 0.19), transparent 24%),
    linear-gradient(145deg, #f5f8fd 0%, #e7eef9 100%);
}

.project-board__visual-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(59, 95, 168, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 95, 168, 0.07) 1px, transparent 1px);
  background-size: 2rem 2rem;
  mask-image: linear-gradient(135deg, black, transparent 76%);
}

.project-board__visual p {
  position: relative;
  z-index: 1;
  color: var(--color-muted);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.project-board__visual-number {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
  color: var(--color-navy);
  font-size: clamp(1.65rem, 3vw, 2.35rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
}

.project-board__visual-mark {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  width: 3.25rem;
  height: 0.28rem;
  border-radius: 999px;
  background: var(--color-yellow);
}

.project-board__content {
  padding: clamp(1.15rem, 2vw, 1.5rem);
}

.project-board__meta {
  color: var(--color-blue);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.project-board__title {
  margin-top: 0.45rem;
  color: var(--color-text);
  font-size: clamp(1.2rem, 1.8vw, 1.55rem);
  font-weight: 800;
  line-height: 1.35;
}

.project-board__description {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 0.65rem;
  color: var(--color-muted);
  font-size: 0.85rem;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.project-board__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.9rem;
  padding: 0;
  list-style: none;
}

.project-board__tags li {
  border: 1px solid var(--color-blue-border);
  border-radius: 999px;
  padding: 0.28rem 0.6rem;
  background: var(--color-blue-soft);
  color: var(--color-navy);
  font-size: 0.64rem;
  font-weight: 700;
}

.hanging-project-active .project-board-shell {
  filter: drop-shadow(0 1.65rem 1.55rem rgba(23, 32, 51, 0.145));
}

.hanging-project-active .project-board {
  border-color: #cbd4e3;
}

.projects-conclusion {
  --conclusion-x: 0px;
  position: absolute;
  top: 50%;
  left: 55%;
  z-index: 25;
  width: min(34rem, 40vw);
  transform: translate3d(calc(-50% + var(--conclusion-x)), -50%, 0);
  transition: transform 110ms linear;
  will-change: transform;
}

.projects-conclusion__overline {
  margin-bottom: 0.8rem;
  color: var(--color-blue);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.projects-conclusion h3 {
  color: var(--color-text);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.22;
  letter-spacing: -0.035em;
}

.projects-conclusion > p:not(.projects-conclusion__overline) {
  max-width: 28rem;
  margin-top: 1rem;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.projects-conclusion__action {
  gap: 0.7rem;
  margin-top: 1.75rem;
}

.projects-conclusion__action svg {
  width: 1.15rem;
  height: 1.15rem;
  transition: transform 200ms ease-out;
}

.projects-conclusion__action:hover svg,
.projects-conclusion__action:focus-visible svg {
  transform: translateX(0.22rem);
}

.projects-progress {
  position: absolute;
  right: max(2rem, calc((100vw - 1280px) / 2 + 3rem));
  bottom: clamp(2rem, 5vh, 3.5rem);
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--color-muted);
  font-size: 0.65rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
}

.projects-progress__current {
  color: var(--color-navy);
}

.projects-progress__track {
  display: block;
  width: clamp(4rem, 8vw, 7rem);
  height: 1px;
  overflow: hidden;
  background: var(--color-blue-border);
}

.projects-progress__track span {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color-blue);
  transform-origin: left center;
}

@keyframes scroll-cue {
  0% { transform: translateX(-100%); }
  48%, 62% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

.projects-exhibition-static {
  height: auto;
  padding-block: 5rem;
}

.projects-exhibition-static .projects-exhibition__stage {
  position: relative;
  top: auto;
  height: auto;
  min-height: 0;
  overflow: visible;
}

.projects-exhibition-static .projects-exhibition__ambient,
.projects-exhibition-static .projects-scroll-cue,
.projects-exhibition-static .projects-progress {
  display: none;
}

.projects-exhibition-static .projects-introduction {
  position: relative;
  top: auto;
  left: auto;
  width: min(100% - 3rem, 72rem);
  margin: 0 auto 4rem;
  transform: none;
}

.projects-exhibition-static .projects-rail {
  position: relative;
  inset: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 3.5rem clamp(2rem, 6vw, 5rem);
  width: min(100% - 3rem, 64rem);
  margin-inline: auto;
}

.projects-exhibition-static .hanging-project {
  position: relative;
  top: auto;
  left: auto;
  width: 100%;
  height: calc(max(var(--line-left), var(--line-right)) + 31rem);
  transform: translate3d(0, var(--project-y), 0);
}

.projects-exhibition-static .projects-conclusion {
  position: relative;
  top: auto;
  left: auto;
  width: min(100% - 3rem, 64rem);
  margin: 5rem auto 0;
  transform: none;
}

@media (max-width: 1279px) {
  .projects-exhibition { --project-board-width: clamp(21.5rem, 35vw, 25rem); }
  .projects-introduction { left: 3rem; width: min(35vw, 25rem); }
  .projects-scroll-cue { left: 3rem; }
  .projects-progress { right: 3rem; }
}

@media (max-width: 1023px) {
  .projects-section { padding-block: 4.5rem; }

  .projects-exhibition,
  .projects-exhibition-static {
    height: auto;
    padding-block: 0;
  }

  .projects-exhibition__stage {
    position: relative;
    top: auto;
    height: auto;
    min-height: 0;
    overflow: visible;
  }

  .projects-exhibition__ambient,
  .projects-scroll-cue,
  .projects-progress { display: none; }

  .projects-introduction {
    position: relative;
    top: auto;
    left: auto;
    width: auto;
    max-width: 42rem;
    margin: 0 auto 3.5rem;
    padding-inline: 1.5rem;
    transform: none;
  }

  .projects-introduction__edition { margin-top: 2rem; }

  .projects-rail {
    position: relative;
    inset: auto;
    display: grid;
    gap: 2.5rem;
    width: min(100% - 2rem, 34rem);
    margin-inline: auto;
  }

  .projects-exhibition-static .projects-rail {
    grid-template-columns: 1fr;
    width: min(100% - 2rem, 34rem);
  }

  .hanging-project {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: calc(max(var(--line-left), var(--line-right)) + 31rem);
    transform: translate3d(0, var(--project-y), 0);
  }

  .projects-conclusion {
    position: relative;
    top: auto;
    left: auto;
    width: min(100% - 3rem, 34rem);
    margin: 4rem auto 0;
    transform: none;
  }
}

@media (max-width: 639px) {
  .projects-section { padding-block: 3.75rem; }
  .projects-introduction { margin-bottom: 2.5rem; padding-inline: 1.25rem; }
  .projects-rail { width: min(100% - 1.5rem, 30rem); gap: 1.75rem; }

  .hanging-project {
    --project-y: 0px !important;
    height: calc(max(var(--line-left), var(--line-right)) + 28rem);
  }

  .hanging-line-left { left: 18%; }
  .hanging-line-right { right: 18%; }
  .project-board__mount-left { left: calc(18% - 0.36rem); }
  .project-board__mount-right { right: calc(18% - 0.36rem); }
  .project-board__content { padding: 1rem; }
  .project-board__description { font-size: 0.8rem; }
  .projects-conclusion { width: min(100% - 2.5rem, 30rem); margin-top: 3rem; }
}

@media (prefers-reduced-motion: reduce) {
  .projects-scroll-cue__line::after {
    animation: none;
    transform: none;
  }

  .projects-introduction,
  .hanging-project,
  .project-board-shell,
  .projects-conclusion,
  .projects-conclusion__action svg {
    transition: none;
  }
}
</style>
