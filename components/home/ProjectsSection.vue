<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { firstProject, otherProjects } from '~/data/projects'

const { handleAnchorClick } = useSmoothScroll()

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
  momentum: number
}

const hangingPresets: HangingPreset[] = [
  { lineLeft: 122, lineRight: 128, tilt: 0.8, verticalOffset: 2, perspective: -0.45, edgeDepth: 8, momentum: 0.82 },
  { lineLeft: 142, lineRight: 136, tilt: -0.7, verticalOffset: 14, perspective: 0.5, edgeDepth: 9, momentum: 0.96 },
  { lineLeft: 112, lineRight: 116, tilt: 0.45, verticalOffset: -4, perspective: -0.3, edgeDepth: 7, momentum: 0.72 },
  { lineLeft: 134, lineRight: 126, tilt: -0.9, verticalOffset: 9, perspective: 0.55, edgeDepth: 10, momentum: 1.04 },
  { lineLeft: 118, lineRight: 123, tilt: 0.6, verticalOffset: 5, perspective: -0.4, edgeDepth: 8, momentum: 0.88 },
]

const LAST_PROJECT_POSITION = projects.length - 1
const FINAL_PROJECT_HOLD = 0.33
const CONCLUSION_TRANSITION = 0.88
const CONCLUSION_HOLD = 0.46
const CONCLUSION_START = LAST_PROJECT_POSITION + FINAL_PROJECT_HOLD
const CONCLUSION_END = CONCLUSION_START + CONCLUSION_TRANSITION
const TIMELINE_DURATION = CONCLUSION_END + CONCLUSION_HOLD
const SCROLL_DISTANCE_PER_UNIT = 78
const projectScrollDistance = `${(TIMELINE_DURATION * SCROLL_DISTANCE_PER_UNIT).toFixed(1)}svh`

const scrollScene = ref<HTMLElement | null>(null)
const stickyStage = ref<HTMLElement | null>(null)
const introduction = ref<HTMLElement | null>(null)
const conclusion = ref<HTMLElement | null>(null)
const progressFill = ref<HTMLElement | null>(null)
const activeProjectIndex = ref(0)
const isConclusionScene = ref(false)
const isConclusionInteractive = ref(false)
const isDesktop = ref(false)
const isScrollReady = ref(false)
const prefersReducedMotion = ref(false)

let scrollFrameId: number | undefined
let resizeFrameId: number | undefined
let motionFrameId: number | undefined
let desktopMedia: MediaQueryList | null = null
let reducedMotionMedia: MediaQueryList | null = null
let projectElements: HTMLElement[] = []
let stageWidth = 1280
let sceneTop = 0
let sceneScrollDistance = 1
let navbarHeight = 0
let targetTimelinePosition = 0
let motionTimelinePosition = 0
let motionVelocity = 0
let lastMotionTime = 0
let previousExhibitionPosition = 0

const clamp = (value: number, minimum = 0, maximum = 1) => {
  return Math.min(Math.max(value, minimum), maximum)
}

const smoothstep = (value: number) => {
  const progress = clamp(value)
  return progress * progress * (3 - (2 * progress))
}

const usesStaticPresentation = computed(() => {
  return !isScrollReady.value || !isDesktop.value || prefersReducedMotion.value
})

const getPreset = (index: number) => {
  return hangingPresets[index % hangingPresets.length] ?? hangingPresets[0]!
}

const getProjectStyle = (index: number): CSSProperties => {
  const preset = getPreset(index)

  return {
    '--line-left': `${preset.lineLeft}px`,
    '--line-right': `${preset.lineRight}px`,
    '--project-y': `${preset.verticalOffset}px`,
    '--board-tilt': `${preset.tilt}deg`,
    '--board-perspective': `${preset.perspective}deg`,
    '--edge-depth': `${preset.edgeDepth}px`,
  } as CSSProperties
}

const mapTimelineToExhibition = (timelinePosition: number) => {
  if (timelinePosition <= LAST_PROJECT_POSITION) {
    return Math.max(-0.05, timelinePosition)
  }

  if (timelinePosition < CONCLUSION_START) return LAST_PROJECT_POSITION

  const conclusionProgress = smoothstep(
    (timelinePosition - CONCLUSION_START) / CONCLUSION_TRANSITION,
  )
  return LAST_PROJECT_POSITION + conclusionProgress
}

const setProjectVariable = (element: HTMLElement, property: string, value: string) => {
  element.style.setProperty(property, value)
}

const applyMotionState = (timelinePosition: number, exhibitionVelocity: number) => {
  const activePosition = mapTimelineToExhibition(timelinePosition)
  const spacing = clamp(stageWidth * 0.48, 470, 650)
  const introductionClearance = (1 - smoothstep(activePosition / 0.78))
    * clamp(stageWidth * 0.18, 150, 260)

  projectElements.forEach((element, index) => {
    const preset = getPreset(index)
    const offset = index - activePosition
    const distance = Math.abs(offset)
    const focus = 1 - clamp(distance)
    const direction = offset === 0 ? 0 : Math.sign(offset)
    const horizontalPosition = (offset * spacing) + introductionClearance
    const settlingOffset = ((1 - focus) * -7)
      - (Math.min(Math.abs(exhibitionVelocity), 5) * focus * 0.32)
    const enteringTilt = direction * (1 - focus) * 0.5
    const momentumTilt = clamp(exhibitionVelocity * preset.momentum * 0.09, -0.72, 0.72)
      * (0.38 + (focus * 0.62))
    const scale = 0.965 + (focus * 0.035)

    setProjectVariable(element, '--project-x', `${horizontalPosition.toFixed(2)}px`)
    setProjectVariable(element, '--project-y', `${(preset.verticalOffset + settlingOffset).toFixed(2)}px`)
    setProjectVariable(element, '--project-scale', scale.toFixed(4))
    setProjectVariable(element, '--board-tilt', `${(preset.tilt + enteringTilt + momentumTilt).toFixed(3)}deg`)
    setProjectVariable(element, '--line-sway', `${(momentumTilt * 0.42).toFixed(3)}deg`)
    setProjectVariable(element, '--project-z', String(20 + Math.round(focus * 10)))
  })

  const exitProgress = smoothstep(activePosition / 0.9)
  const introductionShift = exitProgress * clamp(stageWidth * 0.54, 520, 760)
  introduction.value?.style.setProperty('--introduction-x', `${introductionShift.toFixed(2)}px`)
  introduction.value?.style.setProperty('--introduction-y', `${(exitProgress * -16).toFixed(2)}px`)

  const conclusionOffset = projects.length - activePosition
  const conclusionReveal = smoothstep((activePosition - LAST_PROJECT_POSITION) / 0.72)
  conclusion.value?.style.setProperty('--conclusion-x', `${(conclusionOffset * spacing).toFixed(2)}px`)
  conclusion.value?.style.setProperty('--conclusion-y', `${((1 - conclusionReveal) * 12).toFixed(2)}px`)
  conclusion.value?.style.setProperty('--conclusion-opacity', conclusionReveal.toFixed(3))

  progressFill.value?.style.setProperty(
    'transform',
    `scaleX(${Math.max(0.04, clamp(timelinePosition / CONCLUSION_END)).toFixed(4)})`,
  )

  const nextProjectIndex = Math.min(
    projects.length - 1,
    Math.max(0, Math.round(activePosition)),
  )
  if (activeProjectIndex.value !== nextProjectIndex) {
    activeProjectIndex.value = nextProjectIndex
  }

  const nextConclusionScene = activePosition > LAST_PROJECT_POSITION + 0.42
  if (isConclusionScene.value !== nextConclusionScene) {
    isConclusionScene.value = nextConclusionScene
  }

  const nextConclusionInteractive = conclusionReveal > 0.82
  if (isConclusionInteractive.value !== nextConclusionInteractive) {
    isConclusionInteractive.value = nextConclusionInteractive
  }
}

const resetToStaticPresentation = () => {
  projectElements.forEach((element, index) => {
    const preset = getPreset(index)
    setProjectVariable(element, '--project-x', '0px')
    setProjectVariable(element, '--project-y', `${preset.verticalOffset}px`)
    setProjectVariable(element, '--project-scale', '1')
    setProjectVariable(element, '--board-tilt', `${preset.tilt}deg`)
    setProjectVariable(element, '--line-sway', '0deg')
    setProjectVariable(element, '--project-z', '20')
  })

  introduction.value?.style.setProperty('--introduction-x', '0px')
  introduction.value?.style.setProperty('--introduction-y', '0px')
  conclusion.value?.style.setProperty('--conclusion-x', '0px')
  conclusion.value?.style.setProperty('--conclusion-y', '0px')
  conclusion.value?.style.setProperty('--conclusion-opacity', '1')
  activeProjectIndex.value = 0
  isConclusionScene.value = false
  isConclusionInteractive.value = true
}

const stopMotion = () => {
  if (motionFrameId !== undefined) {
    window.cancelAnimationFrame(motionFrameId)
    motionFrameId = undefined
  }
  lastMotionTime = 0
}

const updateMotion = (timestamp: number) => {
  motionFrameId = undefined

  if (usesStaticPresentation.value) return

  const deltaTime = lastMotionTime
    ? clamp((timestamp - lastMotionTime) / 1000, 1 / 240, 1 / 30)
    : 1 / 60
  lastMotionTime = timestamp

  const displacement = targetTimelinePosition - motionTimelinePosition
  motionVelocity += displacement * 145 * deltaTime
  motionVelocity *= Math.exp(-18 * deltaTime)
  motionVelocity = clamp(motionVelocity, -11, 11)
  motionTimelinePosition += motionVelocity * deltaTime
  motionTimelinePosition = clamp(motionTimelinePosition, -0.06, TIMELINE_DURATION + 0.06)

  const exhibitionPosition = mapTimelineToExhibition(motionTimelinePosition)
  const exhibitionVelocity = (exhibitionPosition - previousExhibitionPosition) / deltaTime
  previousExhibitionPosition = exhibitionPosition
  applyMotionState(motionTimelinePosition, exhibitionVelocity)

  const hasSettled = Math.abs(displacement) < 0.00035 && Math.abs(motionVelocity) < 0.0025
  if (hasSettled) {
    motionTimelinePosition = targetTimelinePosition
    motionVelocity = 0
    previousExhibitionPosition = mapTimelineToExhibition(motionTimelinePosition)
    applyMotionState(motionTimelinePosition, 0)
    lastMotionTime = 0
    return
  }

  motionFrameId = window.requestAnimationFrame(updateMotion)
}

const requestMotionUpdate = () => {
  if (motionFrameId !== undefined || usesStaticPresentation.value) return
  motionFrameId = window.requestAnimationFrame(updateMotion)
}

const updateScrollTarget = () => {
  scrollFrameId = undefined

  if (!scrollScene.value || usesStaticPresentation.value) return

  const progress = clamp((window.scrollY + navbarHeight - sceneTop) / sceneScrollDistance)
  targetTimelinePosition = progress * TIMELINE_DURATION
  requestMotionUpdate()
}

const requestProjectProgressUpdate = () => {
  if (scrollFrameId !== undefined) return
  scrollFrameId = window.requestAnimationFrame(updateScrollTarget)
}

const measureScene = (synchronizeMotion = false) => {
  if (!scrollScene.value || !stickyStage.value) return

  stageWidth = stickyStage.value.offsetWidth
  sceneTop = scrollScene.value.getBoundingClientRect().top + window.scrollY
  sceneScrollDistance = Math.max(1, scrollScene.value.offsetHeight - stickyStage.value.offsetHeight)
  navbarHeight = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'),
  ) || 0

  if (usesStaticPresentation.value) {
    stopMotion()
    resetToStaticPresentation()
    return
  }

  const progress = clamp((window.scrollY + navbarHeight - sceneTop) / sceneScrollDistance)
  targetTimelinePosition = progress * TIMELINE_DURATION

  if (synchronizeMotion) {
    stopMotion()
    motionTimelinePosition = targetTimelinePosition
    motionVelocity = 0
    previousExhibitionPosition = mapTimelineToExhibition(motionTimelinePosition)
    applyMotionState(motionTimelinePosition, 0)
    return
  }

  applyMotionState(motionTimelinePosition, motionVelocity)
  requestMotionUpdate()
}

const requestSceneMeasurement = () => {
  if (resizeFrameId !== undefined) return
  resizeFrameId = window.requestAnimationFrame(() => {
    resizeFrameId = undefined
    measureScene()
  })
}

const handlePresentationChange = async () => {
  isDesktop.value = desktopMedia?.matches ?? false
  prefersReducedMotion.value = reducedMotionMedia?.matches ?? false

  await nextTick()
  measureScene(true)
}

onMounted(async () => {
  desktopMedia = window.matchMedia('(min-width: 1024px)')
  reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
  isDesktop.value = desktopMedia.matches
  prefersReducedMotion.value = reducedMotionMedia.matches
  isScrollReady.value = true

  await nextTick()

  projectElements = stickyStage.value
    ? Array.from(stickyStage.value.querySelectorAll<HTMLElement>('.hanging-project'))
    : []

  window.addEventListener('scroll', requestProjectProgressUpdate, { passive: true })
  window.addEventListener('resize', requestSceneMeasurement, { passive: true })
  window.addEventListener('load', requestSceneMeasurement, { passive: true, once: true })
  desktopMedia.addEventListener('change', handlePresentationChange)
  reducedMotionMedia.addEventListener('change', handlePresentationChange)
  measureScene(true)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestProjectProgressUpdate)
  window.removeEventListener('resize', requestSceneMeasurement)
  window.removeEventListener('load', requestSceneMeasurement)
  desktopMedia?.removeEventListener('change', handlePresentationChange)
  reducedMotionMedia?.removeEventListener('change', handlePresentationChange)

  if (scrollFrameId !== undefined) {
    window.cancelAnimationFrame(scrollFrameId)
  }
  if (resizeFrameId !== undefined) {
    window.cancelAnimationFrame(resizeFrameId)
  }
  stopMotion()
})
</script>

<template>
  <section id="projects" class="site-section site-section-alt projects-section">
    <div
      ref="scrollScene"
      class="projects-exhibition"
      :class="{ 'projects-exhibition-static': usesStaticPresentation }"
      :style="{ '--project-scroll-distance': projectScrollDistance }"
    >
      <div ref="stickyStage" class="projects-exhibition__stage">
        <div class="projects-exhibition__ambient" aria-hidden="true"></div>

        <header ref="introduction" class="projects-introduction">
          <p class="section-kicker">ผลงานผู้เรียน</p>
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
            :class="{ 'hanging-project-active': !usesStaticPresentation && activeProjectIndex === index && !isConclusionScene }"
            :style="getProjectStyle(index)"
            :aria-current="!usesStaticPresentation && activeProjectIndex === index && !isConclusionScene ? 'true' : undefined"
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

        <div
          ref="conclusion"
          class="projects-conclusion"
          :inert="!usesStaticPresentation && !isConclusionInteractive ? true : undefined"
          :aria-hidden="!usesStaticPresentation && !isConclusionInteractive ? 'true' : undefined"
        >
          <p class="projects-conclusion__overline">จากห้องเรียนสู่โลกการทำงาน</p>
          <h3>สิ่งที่ได้ลงมือสร้าง<br>คือจุดเริ่มต้นของประสบการณ์</h3>
          <p>นำทักษะจากโปรเจกต์ไปเรียนรู้กับสถานประกอบการ</p>
          <a href="#internship" class="btn-primary projects-conclusion__action" @click="handleAnchorClick($event, '#internship')">
            <span>สำรวจประสบการณ์ฝึกงาน</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>

        <div v-if="!usesStaticPresentation" class="projects-progress" aria-hidden="true">
          <span class="projects-progress__current">
            {{ String(Math.min(projects.length, activeProjectIndex + 1)).padStart(2, '0') }}
          </span>
          <span class="projects-progress__track">
            <span ref="progressFill"></span>
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
  height: calc(100svh + var(--project-scroll-distance));
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
  --line-sway: 0deg;
  --edge-depth: 8px;
  position: absolute;
  top: clamp(0.35rem, 1.5vh, 1rem);
  left: 50%;
  z-index: var(--project-z);
  width: var(--project-board-width);
  height: calc(max(var(--line-left), var(--line-right)) + 31rem);
  transform: translate3d(calc(-50% + var(--project-x)), var(--project-y), 0) scale(var(--project-scale));
  transform-origin: center 15%;
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
  transform: rotate(calc(0.18deg + var(--line-sway)));
}

.hanging-line-right {
  right: 21.5%;
  height: var(--line-right);
  transform: rotate(calc(-0.15deg + var(--line-sway)));
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
  transition: filter 260ms ease-out;
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
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.project-board__visual-number {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
  min-width: 3rem;
  border-bottom: 0.22rem solid var(--color-yellow);
  padding: 0.52rem 0.68rem 0.42rem;
  background: var(--color-navy);
  color: #fff;
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.035em;
  text-align: center;
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
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: 0.04em;
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
  font-size: 1rem;
  line-height: 1.8;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
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
  font-size: 0.875rem;
  font-weight: 500;
}

.hanging-project-active .project-board-shell {
  filter: drop-shadow(0 1.65rem 1.55rem rgba(23, 32, 51, 0.145));
}

.hanging-project-active .project-board {
  border-color: #cbd4e3;
}

.projects-conclusion {
  --conclusion-x: 0px;
  --conclusion-y: 0px;
  --conclusion-opacity: 1;
  position: absolute;
  top: 50%;
  left: 55%;
  z-index: 25;
  width: min(34rem, 40vw);
  padding-top: 1.35rem;
  opacity: var(--conclusion-opacity);
  transform: translate3d(calc(-50% + var(--conclusion-x)), calc(-50% + var(--conclusion-y)), 0);
  will-change: transform;
}

.projects-conclusion::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: clamp(4.5rem, 10vw, 7rem);
  height: 0.2rem;
  background: var(--color-yellow);
}

.projects-conclusion::after {
  content: '';
  position: absolute;
  top: 0.08rem;
  right: 0;
  left: clamp(4.5rem, 10vw, 7rem);
  height: 1px;
  background: var(--color-blue-border);
}

.projects-conclusion__overline {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 1rem;
  color: var(--color-blue);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.projects-conclusion__overline::before {
  content: '';
  width: 0.42rem;
  height: 0.42rem;
  border: 1px solid var(--color-navy);
  border-radius: 999px;
  background: var(--color-surface);
  box-shadow: inset 0 0 0 1px var(--color-yellow);
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
  will-change: auto;
}

.projects-exhibition-static .projects-conclusion {
  position: relative;
  top: auto;
  left: auto;
  width: min(100% - 3rem, 64rem);
  margin: 5rem auto 0;
  opacity: 1;
  transform: none;
  will-change: auto;
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
