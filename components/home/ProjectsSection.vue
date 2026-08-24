<script setup lang="ts">
import { firstProject, otherProjects } from '~/data/projects'

const projects = [
  {
    number: firstProject.number,
    title: firstProject.title,
    meta: 'โปรเจกต์นักเรียน',
    description: firstProject.description,
    technologies: firstProject.technologies,
  },
  ...otherProjects.map(project => ({
    ...project,
    description: 'รายละเอียดแนวคิดและสิ่งที่นักเรียนได้เรียนรู้จากโปรเจกต์',
    technologies: [],
  })),
]

const PROJECT_FOCUS_DURATION_MS = 520
const PROJECT_OPEN_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

type ProjectInteractionPhase = 'choreographing' | 'opening' | 'focused' | 'closing'
type ViewportMode = 'desktop' | 'tablet' | 'mobile'

type ProjectWaypoint = {
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
}

const projectPaths: Record<ViewportMode, ProjectWaypoint[]> = {
  desktop: [
    { x: 0.5, y: 0.82, rotation: 0, scale: 0.7, opacity: 0 },
    { x: 0.61, y: 0.66, rotation: -1.2, scale: 1, opacity: 1 },
    { x: 0.25, y: 0.5, rotation: 1.5, scale: 1, opacity: 1 },
    { x: 0.72, y: 0.3, rotation: -1.4, scale: 1, opacity: 1 },
    { x: 0.46, y: -0.1, rotation: 0.8, scale: 0.9, opacity: 0.55 },
    { x: 0.34, y: -0.55, rotation: 0, scale: 0.78, opacity: 0 },
  ],
  tablet: [
    { x: 0.5, y: 0.82, rotation: 0, scale: 0.7, opacity: 0 },
    { x: 0.61, y: 0.66, rotation: -1, scale: 1, opacity: 1 },
    { x: 0.27, y: 0.5, rotation: 1.2, scale: 1, opacity: 1 },
    { x: 0.69, y: 0.28, rotation: -1.1, scale: 1, opacity: 1 },
    { x: 0.45, y: -0.1, rotation: 0.7, scale: 0.88, opacity: 0.55 },
    { x: 0.36, y: -0.55, rotation: 0, scale: 0.76, opacity: 0 },
  ],
  mobile: [
    { x: 0.5, y: 0.82, rotation: 0, scale: 0.72, opacity: 0 },
    { x: 0.5, y: 0.59, rotation: -0.7, scale: 1, opacity: 1 },
    { x: 0.42, y: 0.38, rotation: 0.8, scale: 1, opacity: 1 },
    { x: 0.56, y: 0.25, rotation: -0.7, scale: 0.96, opacity: 0.92 },
    { x: 0.48, y: -0.18, rotation: 0.5, scale: 0.86, opacity: 0.5 },
    { x: 0.5, y: -0.55, rotation: 0, scale: 0.76, opacity: 0 },
  ],
}

const projectStaggers: Record<ViewportMode, number> = {
  desktop: 1.15,
  tablet: 1.35,
  mobile: 1.8,
}

const scrollScene = ref<HTMLElement | null>(null)
const stickyStage = ref<HTMLElement | null>(null)
const stageCanvas = ref<HTMLElement | null>(null)
const focusSurface = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const stageWidth = ref(1280)
const stageHeight = ref(720)
const viewportMode = ref<ViewportMode>('desktop')
const prefersReducedMotion = ref(false)
const isScrollReady = ref(false)
const isSceneActive = ref(false)
const selectedProjectIndex = ref<number | null>(null)
const projectInteractionPhase = ref<ProjectInteractionPhase>('choreographing')

const isProjectFocusActive = computed(() => projectInteractionPhase.value !== 'choreographing')
const usesStaticPresentation = computed(() => !isScrollReady.value || prefersReducedMotion.value)

let scrollFrameId: number | undefined
let sceneObserver: IntersectionObserver | null = null
let reducedMotionMedia: MediaQueryList | null = null
let isSceneVisible = false
let projectFocusAnimation: Animation | null = null
let projectFocusMotion: HTMLElement | null = null
let projectTrigger: HTMLElement | null = null
let projectReturnOpacity = 1

const clamp = (value: number, minimum = 0, maximum = 1) => {
  return Math.min(Math.max(value, minimum), maximum)
}

const smoothstep = (value: number) => {
  const progress = clamp(value)
  return progress * progress * (3 - (2 * progress))
}

const interpolate = (start: number, end: number, progress: number) => {
  return start + ((end - start) * progress)
}

const getProjectPathState = (index: number) => {
  const path = projectPaths[viewportMode.value]
  const finalWaypointIndex = path.length - 1
  const stagger = projectStaggers[viewportMode.value]
  const timelineLength = finalWaypointIndex + ((projects.length - 1) * stagger)
  const pathPosition = (scrollProgress.value * timelineLength) - (index * stagger)

  if (pathPosition <= 0) {
    return { ...path[0], pathPosition }
  }

  if (pathPosition >= finalWaypointIndex) {
    return { ...path[finalWaypointIndex], pathPosition }
  }

  const waypointIndex = Math.floor(pathPosition)
  const waypointProgress = smoothstep(pathPosition - waypointIndex)
  const currentWaypoint = path[waypointIndex]
  const nextWaypoint = path[waypointIndex + 1]

  return {
    x: interpolate(currentWaypoint.x, nextWaypoint.x, waypointProgress),
    y: interpolate(currentWaypoint.y, nextWaypoint.y, waypointProgress),
    rotation: interpolate(currentWaypoint.rotation, nextWaypoint.rotation, waypointProgress),
    scale: interpolate(currentWaypoint.scale, nextWaypoint.scale, waypointProgress),
    opacity: interpolate(currentWaypoint.opacity, nextWaypoint.opacity, waypointProgress),
    pathPosition,
  }
}

const projectIntroductionStyle = computed(() => {
  if (usesStaticPresentation.value) return undefined

  const fadeProgress = smoothstep((scrollProgress.value - 0.015) / 0.12)

  return {
    opacity: (1 - fadeProgress).toFixed(3),
    visibility: fadeProgress > 0.995 ? 'hidden' : 'visible',
  }
})

const isProjectAvailable = (index: number) => {
  if (usesStaticPresentation.value) return true

  const state = getProjectPathState(index)
  const finalWaypointIndex = projectPaths[viewportMode.value].length - 1

  return state.pathPosition > 0.55
    && state.pathPosition < finalWaypointIndex - 0.35
    && state.opacity > 0.48
}

const getProjectSheetStyle = (index: number) => {
  if (usesStaticPresentation.value) return undefined

  const state = getProjectPathState(index)
  const translateX = state.x * stageWidth.value
  const translateY = state.y * stageHeight.value
  const isInteractive = isProjectAvailable(index)
    && projectInteractionPhase.value === 'choreographing'

  return {
    zIndex: String(10 + Math.round(clamp(state.y, 0, 1) * 10)),
    opacity: state.opacity.toFixed(4),
    pointerEvents: isInteractive ? 'auto' : 'none',
    transform: `translate3d(calc(-50% + ${translateX.toFixed(2)}px), calc(-50% + ${translateY.toFixed(2)}px), 0) scale(${state.scale.toFixed(4)}) rotate(${state.rotation.toFixed(3)}deg)`,
  }
}

const isProjectHidden = (index: number) => {
  if (usesStaticPresentation.value) return false
  return getProjectPathState(index).opacity < 0.02
}

const getProjectItem = (index: number) => {
  return stageCanvas.value?.querySelector<HTMLElement>(`[data-project-index="${index}"]`) ?? null
}

const getProjectCard = (index: number) => {
  return getProjectItem(index)?.querySelector<HTMLElement>('.project-card') ?? null
}

const getProjectMotion = (index: number) => {
  return getProjectItem(index)?.querySelector<HTMLElement>('.project-card-motion') ?? null
}

const getCurrentTransformMetrics = (element: HTMLElement) => {
  const transform = getComputedStyle(element).transform

  if (transform === 'none') {
    return { rotation: 0, scaleX: 1, scaleY: 1 }
  }

  try {
    const matrix = new DOMMatrixReadOnly(transform)
    return {
      rotation: Math.atan2(matrix.b, matrix.a) * (180 / Math.PI),
      scaleX: Math.hypot(matrix.a, matrix.b),
      scaleY: Math.hypot(matrix.c, matrix.d),
    }
  }
  catch {
    return { rotation: 0, scaleX: 1, scaleY: 1 }
  }
}

const getFocusTransformForProjectItem = (
  projectItem: HTMLElement,
  projectMotion: HTMLElement,
  surfaceRect: DOMRect,
) => {
  const itemRect = projectItem.getBoundingClientRect()
  const itemTransform = getCurrentTransformMetrics(projectItem)
  const itemCenterX = itemRect.left + itemRect.width / 2
  const itemCenterY = itemRect.top + itemRect.height / 2
  const surfaceCenterX = surfaceRect.left + surfaceRect.width / 2
  const surfaceCenterY = surfaceRect.top + surfaceRect.height / 2
  const translateX = itemCenterX - surfaceCenterX
  const translateY = itemCenterY - surfaceCenterY
  const scaleX = projectItem.offsetWidth * itemTransform.scaleX / projectMotion.offsetWidth
  const scaleY = projectItem.offsetHeight * itemTransform.scaleY / projectMotion.offsetHeight

  return `translate3d(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px), 0) scale(${scaleX}, ${scaleY}) rotate(${itemTransform.rotation}deg)`
}

const waitForAnimation = async (animation: Animation) => {
  try {
    await animation.finished
    return true
  }
  catch {
    return false
  }
}

const focusCloseControl = () => {
  focusSurface.value
    ?.querySelector<HTMLButtonElement>('.project-card__close')
    ?.focus({ preventScroll: true })
}

const openProject = async (index: number) => {
  if (
    projectInteractionPhase.value !== 'choreographing'
    || !focusSurface.value
    || !isProjectAvailable(index)
  ) return

  const projectItem = getProjectItem(index)
  const projectMotion = getProjectMotion(index)
  const projectCard = getProjectCard(index)

  if (!projectItem || !projectMotion || !projectCard) return

  const firstRect = projectCard.getBoundingClientRect()
  const startingRotation = getCurrentTransformMetrics(projectItem).rotation

  projectReturnOpacity = Number.parseFloat(getComputedStyle(projectItem).opacity) || 1
  projectFocusMotion = projectMotion
  projectTrigger = projectCard
  selectedProjectIndex.value = index
  projectInteractionPhase.value = 'opening'

  await nextTick()

  const surfaceRect = focusSurface.value?.getBoundingClientRect()

  if (!surfaceRect || !projectMotion.isConnected) {
    selectedProjectIndex.value = null
    projectInteractionPhase.value = 'choreographing'
    projectFocusMotion = null
    projectTrigger = null
    return
  }

  const targetWidth = projectMotion.offsetWidth
  const targetHeight = projectMotion.offsetHeight
  const targetCenterX = surfaceRect.left + surfaceRect.width / 2
  const targetCenterY = surfaceRect.top + surfaceRect.height / 2
  const firstCenterX = firstRect.left + firstRect.width / 2
  const firstCenterY = firstRect.top + firstRect.height / 2
  const translateX = firstCenterX - targetCenterX
  const translateY = firstCenterY - targetCenterY
  const scaleX = firstRect.width / targetWidth
  const scaleY = firstRect.height / targetHeight
  const targetTransform = 'translate3d(-50%, -50%, 0) scale(1) rotate(0deg)'
  const openingFrames: Keyframe[] = prefersReducedMotion.value
    ? [
        { transform: targetTransform, opacity: 0.82 },
        { transform: targetTransform, opacity: 1 },
      ]
    : [
        {
          transform: `translate3d(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px), 0) scale(${scaleX}, ${scaleY}) rotate(${startingRotation}deg)`,
          opacity: projectReturnOpacity,
        },
        { transform: targetTransform, opacity: 1 },
      ]

  const openingAnimation = projectMotion.animate(openingFrames, {
    duration: prefersReducedMotion.value ? 140 : PROJECT_FOCUS_DURATION_MS,
    easing: PROJECT_OPEN_EASING,
    fill: 'both',
  })
  projectFocusAnimation = openingAnimation

  const didFinish = await waitForAnimation(openingAnimation)

  if (
    !didFinish
    || projectInteractionPhase.value !== 'opening'
    || projectFocusAnimation !== openingAnimation
  ) return

  openingAnimation.cancel()
  projectFocusAnimation = null
  projectInteractionPhase.value = 'focused'
  await nextTick()
  focusCloseControl()
}

const closeProject = async () => {
  if (projectInteractionPhase.value !== 'focused' || selectedProjectIndex.value === null) return

  const closingIndex = selectedProjectIndex.value
  const returningItem = getProjectItem(closingIndex)
  const returningMotion = projectFocusMotion
  const returningCard = projectTrigger
  const surfaceRect = focusSurface.value?.getBoundingClientRect()

  if (!returningItem || !returningMotion || !surfaceRect) return

  projectInteractionPhase.value = 'closing'

  const focusedTransform = 'translate3d(-50%, -50%, 0) scale(1) rotate(0deg)'
  const destinationTransform = getFocusTransformForProjectItem(
    returningItem,
    returningMotion,
    surfaceRect,
  )
  const closingFrames: Keyframe[] = prefersReducedMotion.value
    ? [
        { transform: focusedTransform, opacity: 1 },
        { transform: focusedTransform, opacity: projectReturnOpacity },
      ]
    : [
        { transform: focusedTransform, opacity: 1 },
        { transform: destinationTransform, opacity: projectReturnOpacity },
      ]

  const closingAnimation = returningMotion.animate(closingFrames, {
    duration: prefersReducedMotion.value ? 140 : PROJECT_FOCUS_DURATION_MS,
    easing: PROJECT_OPEN_EASING,
    fill: 'both',
  })
  projectFocusAnimation = closingAnimation

  const didFinish = await waitForAnimation(closingAnimation)

  if (
    !didFinish
    || projectInteractionPhase.value !== 'closing'
    || projectFocusAnimation !== closingAnimation
  ) return

  closingAnimation.cancel()
  projectFocusAnimation = null
  projectFocusMotion = null

  selectedProjectIndex.value = null
  projectInteractionPhase.value = 'choreographing'
  await nextTick()

  if (returningCard?.isConnected) {
    returningCard.focus({ preventScroll: true })
  }

  projectTrigger = null
}

const resolveViewportMode = (): ViewportMode => {
  if (window.innerWidth >= 1024) return 'desktop'
  if (window.innerWidth >= 768) return 'tablet'
  return 'mobile'
}

const updateProjectProgress = () => {
  scrollFrameId = undefined

  if (!scrollScene.value || !stickyStage.value || !stageCanvas.value) return

  const canvasRect = stageCanvas.value.getBoundingClientRect()
  stageWidth.value = canvasRect.width
  stageHeight.value = canvasRect.height
  viewportMode.value = resolveViewportMode()

  if (usesStaticPresentation.value) {
    scrollProgress.value = 1
    return
  }

  if (projectInteractionPhase.value !== 'choreographing') return

  const stickyTop = Number.parseFloat(getComputedStyle(stickyStage.value).top) || 0
  const sceneRect = scrollScene.value.getBoundingClientRect()
  const scrollDistance = Math.max(1, sceneRect.height - stickyStage.value.offsetHeight)

  scrollProgress.value = clamp((stickyTop - sceneRect.top) / scrollDistance)
}

function requestProjectProgressUpdate(force = false) {
  if ((!force && !isSceneVisible) || scrollFrameId !== undefined) return
  scrollFrameId = window.requestAnimationFrame(updateProjectProgress)
}

const handleScroll = () => {
  requestProjectProgressUpdate()
}

const handleResize = () => {
  requestProjectProgressUpdate(true)
}

const handleReducedMotionChange = () => {
  prefersReducedMotion.value = reducedMotionMedia?.matches ?? false
  void nextTick(() => requestProjectProgressUpdate(true))
}

const handleProjectKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    void closeProject()
  }
}

onMounted(async () => {
  reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = reducedMotionMedia.matches
  viewportMode.value = resolveViewportMode()
  isScrollReady.value = true

  await nextTick()

  sceneObserver = new IntersectionObserver(([entry]) => {
    isSceneVisible = entry?.isIntersecting ?? false
    isSceneActive.value = isSceneVisible

    if (isSceneVisible) {
      requestProjectProgressUpdate(true)
    }
  }, {
    rootMargin: '50% 0px',
  })

  if (scrollScene.value) {
    sceneObserver.observe(scrollScene.value)
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('keydown', handleProjectKeydown)
  reducedMotionMedia.addEventListener('change', handleReducedMotionChange)
  requestProjectProgressUpdate(true)
})

onBeforeUnmount(() => {
  projectFocusAnimation?.cancel()
  projectFocusAnimation = null
  projectFocusMotion = null
  sceneObserver?.disconnect()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleProjectKeydown)
  reducedMotionMedia?.removeEventListener('change', handleReducedMotionChange)

  if (scrollFrameId !== undefined) {
    window.cancelAnimationFrame(scrollFrameId)
  }
})
</script>

<template>
  <section id="projects" class="site-section site-section-alt projects-section">
    <div
      ref="scrollScene"
      class="projects-scroll-scene"
      :class="{ 'projects-scroll-scene-static': usesStaticPresentation }"
    >
      <div ref="stickyStage" class="projects-sticky-stage">
        <div
          ref="stageCanvas"
          class="projects-stage-canvas"
          :class="{
            'projects-stage-canvas-active': isSceneActive,
            'projects-stage-canvas-focused': isProjectFocusActive,
          }"
          :data-scroll-progress="scrollProgress.toFixed(3)"
        >
          <header class="projects-header" :style="projectIntroductionStyle">
            <h2 class="section-title">ผลงานนักเรียน</h2>
            <p class="body-copy">จากการเรียนรู้ สู่การลงมือสร้างจริง</p>
          </header>

          <button
            v-if="selectedProjectIndex !== null"
            type="button"
            class="project-focus-backdrop"
            tabindex="-1"
            aria-label="ปิดรายละเอียดโปรเจกต์"
            @click="closeProject"
          ></button>

          <div id="project-focus-surface" ref="focusSurface" class="project-focus-surface"></div>

          <ul
            class="project-sheets"
            :class="{ 'project-sheets-static': usesStaticPresentation }"
            aria-label="ตัวอย่างผลงานนักเรียน"
            :aria-hidden="isProjectFocusActive ? 'true' : undefined"
          >
            <li
              v-for="(project, index) in projects"
              :key="project.number"
              class="project-sheet"
              :class="{
                'project-sheet-selected': selectedProjectIndex === index,
                'project-sheet-hidden': isProjectHidden(index),
              }"
              :data-project-index="index"
              :style="getProjectSheetStyle(index)"
              :aria-hidden="isProjectHidden(index) ? 'true' : undefined"
            >
              <Teleport to="#project-focus-surface" :disabled="selectedProjectIndex !== index">
                <div
                  class="project-card-motion"
                  :class="{ 'project-card-motion-selected': selectedProjectIndex === index }"
                >
                  <article
                    class="project-card"
                    :class="{ 'project-card-selected': selectedProjectIndex === index }"
                    :tabindex="(isProjectFocusActive && selectedProjectIndex !== index) || !isProjectAvailable(index) ? -1 : 0"
                    :role="selectedProjectIndex === index ? 'dialog' : 'button'"
                    :aria-modal="selectedProjectIndex === index ? 'false' : undefined"
                    :aria-labelledby="`project-title-${project.number}`"
                    :aria-describedby="`project-description-${project.number}`"
                    :aria-haspopup="selectedProjectIndex === index ? undefined : 'dialog'"
                    @click="openProject(index)"
                    @keydown.enter.self.prevent="openProject(index)"
                    @keydown.space.self.prevent="openProject(index)"
                  >
                    <button
                      v-if="selectedProjectIndex === index"
                      type="button"
                      class="project-card__close"
                      :aria-label="`ปิดรายละเอียด ${project.title}`"
                      @click.stop="closeProject"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
                        <path d="m6 6 12 12" />
                        <path d="M18 6 6 18" />
                      </svg>
                    </button>

                    <div
                      class="project-card__visual"
                      :aria-label="`พื้นที่สำหรับภาพประกอบโปรเจกต์ ${project.title}`"
                      role="img"
                    >
                      <p>พื้นที่สำหรับภาพผลงาน</p>
                      <span class="project-card__visual-mark" aria-hidden="true"></span>
                    </div>

                    <div class="project-card__content">
                      <p class="project-card__meta">{{ project.meta }}</p>
                      <h3 :id="`project-title-${project.number}`" class="project-card__title">
                        {{ project.title }}
                      </h3>
                      <p :id="`project-description-${project.number}`" class="project-card__description">
                        {{ project.description }}
                      </p>

                      <ul
                        v-if="project.technologies.length"
                        class="project-card__tags"
                        :aria-label="`เทคโนโลยีที่ใช้ใน ${project.title}`"
                      >
                        <li v-for="technology in project.technologies" :key="technology">
                          {{ technology }}
                        </li>
                      </ul>
                    </div>
                  </article>
                </div>
              </Teleport>
            </li>
          </ul>

          <div class="project-archive" aria-label="คลังผลงานนักเรียน">
            <div class="project-archive__papers" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>

            <div class="project-archive__body">
              <svg
                class="project-archive__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3.5 7.5h6l2-2h9v13h-17z" />
                <path d="M3.5 9.5h17" />
              </svg>

              <div class="project-archive__copy">
                <h3>คลังผลงานนักเรียน</h3>
                <p>รวมโปรเจกต์และผลงานจากการเรียนรู้</p>
              </div>

              <button
                type="button"
                class="project-archive__action"
                aria-label="เปิดคลังผลงาน (หน้ารวมผลงานจะเปิดให้ใช้งานในอนาคต)"
                disabled
              >
                <span>เปิดคลังผลงาน</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
              <!-- Replace this disabled button with a NuxtLink to /projects when that route is available. -->
            </div>
          </div>

          <p v-if="!usesStaticPresentation" class="projects-scroll-hint" aria-hidden="true">
            เลื่อนเพื่อเปิดดูผลงานทีละชิ้น
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
  padding: 0;
}

.projects-header {
  position: absolute;
  top: clamp(1.5rem, 4.5vh, 3rem);
  left: 50%;
  z-index: 40;
  width: min(48rem, calc(100% - 3rem));
  text-align: center;
  transform: translateX(-50%);
}

.projects-header .section-title {
  font-size: clamp(1.75rem, 5vw, 3.25rem);
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.projects-header .body-copy {
  max-width: 34rem;
  margin: 0.75rem auto 0;
  color: var(--color-navy);
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 600;
  line-height: 1.7;
}

.projects-scroll-scene {
  position: relative;
  height: 430svh;
}

.projects-sticky-stage {
  position: sticky;
  top: var(--navbar-height);
  height: calc(100svh - var(--navbar-height));
  min-height: 34rem;
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  isolation: isolate;
}

.projects-stage-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.projects-stage-canvas::before {
  position: absolute;
  inset: 2rem clamp(1rem, 3vw, 3rem) 1.5rem;
  border: 1px solid rgba(215, 225, 243, 0.72);
  border-radius: 1rem;
  content: '';
  pointer-events: none;
}

.project-sheets {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-sheet {
  position: absolute;
  top: 0;
  left: 0;
  width: clamp(18rem, 24vw, 21rem);
  height: clamp(19.5rem, 42vh, 22rem);
  opacity: 0;
  transform-origin: center;
  will-change: auto;
}

.projects-stage-canvas-active .project-sheet {
  will-change: transform, opacity;
}

.project-sheet-hidden {
  visibility: hidden;
}

.projects-stage-canvas-focused .project-sheet:not(.project-sheet-selected) {
  opacity: 0.14 !important;
  pointer-events: none !important;
}

.project-card-motion {
  width: 100%;
  height: 100%;
}

.project-focus-backdrop {
  position: fixed;
  top: var(--navbar-height);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 60;
  border: 0;
  padding: 0;
  background: rgba(238, 243, 251, 0.88);
  cursor: pointer;
  animation: project-backdrop-in 220ms ease-out both;
}

.project-focus-surface {
  position: fixed;
  top: var(--navbar-height);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 70;
  pointer-events: none;
}

.project-card-motion-selected {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(42rem, calc(100% - 3rem));
  height: 26rem;
  transform: translate3d(-50%, -50%, 0);
  transform-origin: center;
  will-change: transform, opacity;
}

.project-card {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  border-radius: 1rem;
  background: var(--color-surface);
  box-shadow: 0 14px 34px rgba(23, 32, 51, 0.11);
  cursor: pointer;
  transition:
    box-shadow 220ms ease-out,
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.projects-stage-canvas-focused .project-card {
  transition-property: box-shadow;
}

.project-card:focus-visible {
  outline: 4px solid var(--color-focus);
  outline-offset: 4px;
}

.project-card.project-card-selected {
  width: 100%;
  height: 100%;
  box-shadow: 0 28px 64px rgba(36, 59, 107, 0.18);
  cursor: default;
  pointer-events: auto;
}

.project-card__close {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  z-index: 3;
  display: inline-flex;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-blue-border);
  border-radius: 0.75rem;
  background: var(--color-surface);
  color: var(--color-navy);
  box-shadow: 0 8px 20px rgba(36, 59, 107, 0.1);
}

.project-card__close:hover {
  border-color: var(--color-blue);
  color: var(--color-blue);
}

.project-card__close:focus-visible {
  outline: 4px solid var(--color-focus);
  outline-offset: 2px;
}

.project-card__close svg {
  width: 1.125rem;
  height: 1.125rem;
}

.project-card__visual {
  position: relative;
  display: flex;
  height: clamp(7.5rem, 17vh, 9rem);
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.74), transparent 56%),
    var(--color-blue-soft);
  color: var(--color-muted);
  isolation: isolate;
}

.project-card__visual::before {
  position: absolute;
  inset: 0.75rem;
  z-index: -1;
  border: 1px solid var(--color-blue-border);
  content: '';
}

.project-card__visual p {
  max-width: 10rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5;
}

.project-card__visual-mark {
  position: absolute;
  top: 0;
  right: 0;
  width: 3.75rem;
  height: 0.25rem;
  background: var(--color-yellow);
}

.project-card__content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  padding: 1.25rem 1.4rem 1.4rem;
}

.project-card-selected .project-card__content {
  overflow-y: auto;
  padding: 1.5rem 4.5rem 1.75rem 1.75rem;
  scrollbar-color: var(--color-blue-border) transparent;
  scrollbar-width: thin;
}

.project-card__meta {
  overflow-wrap: anywhere;
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5;
}

.project-card__title {
  margin-top: 0.3rem;
  overflow-wrap: anywhere;
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.project-card__description {
  display: -webkit-box;
  margin-top: 0.45rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.6;
}

.project-card-selected .project-card__description {
  display: block;
  overflow: visible;
  -webkit-line-clamp: initial;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: auto;
  padding-top: 0.65rem;
}

.project-card__tags li {
  border: 1px solid var(--color-blue-border);
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  background: var(--color-blue-soft);
  color: var(--color-navy);
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.3;
}

.project-archive {
  position: absolute;
  top: 82%;
  left: 50%;
  z-index: 30;
  width: min(22rem, calc(100% - 2rem));
  transform: translate3d(-50%, -50%, 0);
}

.project-archive__papers {
  position: absolute;
  right: 1.25rem;
  bottom: calc(100% - 1rem);
  left: 1.25rem;
  height: 3rem;
}

.project-archive__papers span {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2.4rem;
  border: 1px solid var(--color-blue-border);
  border-radius: 0.75rem 0.75rem 0 0;
  background: var(--color-surface);
  box-shadow: 0 5px 16px rgba(23, 32, 51, 0.06);
}

.project-archive__papers span:nth-child(1) {
  transform: translateY(-0.9rem) scaleX(0.86);
}

.project-archive__papers span:nth-child(2) {
  transform: translateY(-0.45rem) scaleX(0.93);
}

.project-archive__body {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.35rem 0.85rem;
  align-items: center;
  min-height: 8.5rem;
  border-radius: 1rem;
  padding: 1.1rem 1.2rem;
  background: var(--color-navy);
  color: var(--color-surface);
  box-shadow: 0 18px 40px rgba(36, 59, 107, 0.2);
}

.project-archive__body::before {
  position: absolute;
  top: 0;
  right: 1.25rem;
  width: 4rem;
  height: 0.25rem;
  background: var(--color-yellow);
  content: '';
}

.project-archive__icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--color-yellow);
}

.project-archive__copy h3 {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.35;
}

.project-archive__copy p {
  margin-top: 0.15rem;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.75rem;
  line-height: 1.55;
}

.project-archive__action {
  display: inline-flex;
  min-height: 2.4rem;
  grid-column: 1 / -1;
  gap: 0.55rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 0.75rem;
  padding: 0.5rem 0.8rem;
  background: var(--color-surface);
  color: var(--color-navy);
  font-size: 0.75rem;
  font-weight: 800;
}

.project-archive__action:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.project-archive__action svg {
  width: 0.95rem;
  height: 0.95rem;
}

.projects-scroll-hint {
  position: absolute;
  bottom: 1.1rem;
  left: 50%;
  z-index: 35;
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  transform: translateX(-50%);
}

.projects-scroll-scene-static {
  height: auto;
}

.projects-scroll-scene-static .projects-sticky-stage {
  position: relative;
  top: auto;
  height: auto;
  min-height: 0;
  overflow: visible;
}

.projects-scroll-scene-static .projects-stage-canvas {
  display: grid;
  width: min(100%, 1280px);
  height: auto;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin: 0 auto;
  overflow: visible;
  padding: 2rem clamp(1.25rem, 4vw, 3rem) 4rem;
}

.projects-scroll-scene-static .projects-stage-canvas::before {
  display: none;
}

.projects-scroll-scene-static .projects-header {
  position: static;
  width: min(48rem, 100%);
  grid-column: 1 / -1;
  justify-self: center;
  margin-bottom: 1.5rem;
  opacity: 1;
  transform: none;
  visibility: visible;
}

.project-sheets-static {
  position: static;
  display: contents;
}

.project-sheets-static .project-sheet {
  position: relative;
  top: auto;
  left: auto;
  width: auto;
  height: 21rem;
  opacity: 1;
  transform: none;
  visibility: visible;
  will-change: auto;
}

.projects-scroll-scene-static .project-archive {
  position: relative;
  top: auto;
  left: auto;
  grid-column: 1 / -1;
  justify-self: center;
  margin-top: 3rem;
  transform: none;
}

@keyframes project-backdrop-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (hover: hover) and (pointer: fine) {
  .projects-stage-canvas:not(.projects-stage-canvas-focused) .project-card:hover,
  .projects-stage-canvas:not(.projects-stage-canvas-focused) .project-card:focus-visible {
    box-shadow: 0 20px 44px rgba(36, 59, 107, 0.17);
    transform: translateY(-0.2rem) scale(1.015);
  }
}

@media (min-width: 768px) {
  .project-card.project-card-selected {
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(16rem, 0.92fr);
  }

  .project-card-selected .project-card__visual {
    height: auto;
  }
}

@media (max-width: 1023px) {
  .projects-scroll-scene {
    height: 370svh;
  }

  .project-sheet {
    width: clamp(16rem, 35vw, 18rem);
    height: clamp(18rem, 40vh, 20rem);
  }

}

@media (max-width: 767px) {
  .projects-header {
    top: 1.25rem;
    width: calc(100% - 2.5rem);
  }

  .projects-header .section-title {
    font-size: clamp(1.75rem, 10vw, 3.25rem);
  }

  .projects-header .body-copy {
    margin-top: 0.5rem;
    font-size: 1rem;
    line-height: 1.6;
  }

  .projects-scroll-scene {
    height: 300svh;
  }

  .projects-sticky-stage {
    min-height: 31rem;
  }

  .projects-stage-canvas::before {
    inset: 1rem 0.75rem;
  }

  .project-sheet {
    top: 0;
    width: min(86vw, 21rem);
    height: min(21rem, 48svh);
  }

  .project-card-motion-selected {
    width: calc(100% - 2rem);
    height: min(28rem, calc(100dvh - var(--navbar-height) - 3rem));
    min-height: 24rem;
  }

  .project-card-selected .project-card__visual {
    height: 9rem;
  }

  .project-card-selected .project-card__content {
    padding: 1.25rem;
  }

  .projects-stage-canvas:not(.projects-stage-canvas-focused) .project-card:hover,
  .projects-stage-canvas:not(.projects-stage-canvas-focused) .project-card:focus-visible {
    transform: none;
  }

  .project-archive {
    top: 82%;
    width: min(18rem, calc(100% - 2rem));
  }

  .project-archive__body {
    min-height: 7.75rem;
    padding: 0.9rem 1rem;
  }

  .projects-scroll-hint {
    bottom: 0.6rem;
    width: 100%;
    text-align: center;
  }

  .projects-scroll-scene-static .projects-stage-canvas {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
    padding: 1rem 1.25rem 3rem;
  }

  .project-sheets-static .project-sheet {
    width: min(100%, 22rem);
    height: 21rem;
    justify-self: center;
  }

  .projects-scroll-scene-static .project-archive {
    grid-column: auto;
    margin-top: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-focus-backdrop {
    animation: none;
  }

  .project-card {
    transition: none;
  }

  .projects-stage-canvas:not(.projects-stage-canvas-focused) .project-card:hover,
  .projects-stage-canvas:not(.projects-stage-canvas-focused) .project-card:focus-visible {
    transform: none;
  }
}
</style>
