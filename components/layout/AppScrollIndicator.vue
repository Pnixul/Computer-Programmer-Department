<script setup>
const isVisible = ref(false)
const isScrolling = ref(false)
const isDragging = ref(false)
const thumbHeight = ref(0)
const thumbOffset = ref(0)
const thumbElement = ref(null)
const { scrollTo } = useSmoothScroll()

const thumbStyle = computed(() => ({
  height: `${thumbHeight.value}px`,
  transform: `translate3d(0, ${thumbOffset.value}px, 0)`
}))

let animationFrameId
let scrollingTimer
let resizeObserver
let dragPointerId
let dragStartPointerY = 0
let dragStartScrollTop = 0
let dragMaxScroll = 0
let dragMaxThumbTravel = 0

const getScrollMetrics = () => {
  const root = document.documentElement
  const body = document.body
  const viewportHeight = window.innerHeight || root.clientHeight
  const documentHeight = Math.max(
    root.scrollHeight,
    root.offsetHeight,
    body?.scrollHeight ?? 0,
    body?.offsetHeight ?? 0
  )
  const maxScroll = Math.max(0, documentHeight - viewportHeight)
  const trackHeight = Math.max(0, viewportHeight - 6)

  return { root, viewportHeight, documentHeight, maxScroll, trackHeight }
}

const updateIndicator = () => {
  animationFrameId = undefined

  const { root, viewportHeight, documentHeight, maxScroll, trackHeight } = getScrollMetrics()

  if (viewportHeight <= 0 || maxScroll <= 1) {
    isVisible.value = false
    thumbHeight.value = 0
    thumbOffset.value = 0
    return
  }

  const calculatedHeight = trackHeight * (viewportHeight / documentHeight)
  const nextThumbHeight = Math.min(trackHeight, Math.max(32, calculatedHeight))
  const maxThumbTravel = Math.max(0, trackHeight - nextThumbHeight)
  const scrollTop = Math.min(maxScroll, Math.max(0, window.scrollY || root.scrollTop))

  thumbHeight.value = nextThumbHeight
  thumbOffset.value = (scrollTop / maxScroll) * maxThumbTravel
  isVisible.value = true
}

const scheduleUpdate = () => {
  if (animationFrameId !== undefined) {
    return
  }

  animationFrameId = window.requestAnimationFrame(updateIndicator)
}

const handleScroll = () => {
  isScrolling.value = true
  window.clearTimeout(scrollingTimer)
  scrollingTimer = window.setTimeout(() => {
    isScrolling.value = false
  }, 450)
  scheduleUpdate()
}

const stopDragging = (event) => {
  if (!isDragging.value || (event?.pointerId !== undefined && event.pointerId !== dragPointerId)) {
    return
  }

  if (thumbElement.value?.hasPointerCapture(dragPointerId)) {
    thumbElement.value.releasePointerCapture(dragPointerId)
  }

  isDragging.value = false
  dragPointerId = undefined
  document.documentElement.classList.remove('scroll-indicator-dragging')
  scheduleUpdate()
}

const handlePointerDown = (event) => {
  if (!event.isPrimary || event.button !== 0) {
    return
  }

  updateIndicator()
  const { root, maxScroll, trackHeight } = getScrollMetrics()
  const maxThumbTravel = Math.max(0, trackHeight - thumbHeight.value)

  if (maxScroll <= 1 || maxThumbTravel <= 0) {
    return
  }

  dragPointerId = event.pointerId
  dragStartPointerY = event.clientY
  dragStartScrollTop = Math.min(maxScroll, Math.max(0, window.scrollY || root.scrollTop))
  dragMaxScroll = maxScroll
  dragMaxThumbTravel = maxThumbTravel
  isDragging.value = true
  document.documentElement.classList.add('scroll-indicator-dragging')
  event.currentTarget.setPointerCapture(event.pointerId)
  event.preventDefault()
}

const handlePointerMove = (event) => {
  if (!isDragging.value || event.pointerId !== dragPointerId) {
    return
  }

  const pointerDelta = event.clientY - dragStartPointerY
  const scrollDelta = (pointerDelta / dragMaxThumbTravel) * dragMaxScroll
  const nextScrollTop = Math.min(dragMaxScroll, Math.max(0, dragStartScrollTop + scrollDelta))

  scrollTo(nextScrollTop, { immediate: true, updateHash: false })
  event.preventDefault()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', scheduleUpdate, { passive: true })
  window.visualViewport?.addEventListener('resize', scheduleUpdate, { passive: true })

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(document.documentElement)
    resizeObserver.observe(document.body)
  }

  scheduleUpdate()
})

onBeforeUnmount(() => {
  stopDragging()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', scheduleUpdate)
  window.visualViewport?.removeEventListener('resize', scheduleUpdate)
  resizeObserver?.disconnect()

  if (animationFrameId !== undefined) {
    window.cancelAnimationFrame(animationFrameId)
  }

  window.clearTimeout(scrollingTimer)
})
</script>

<template>
  <div
    v-show="isVisible"
    class="scroll-indicator"
    aria-hidden="true"
  >
    <div
      ref="thumbElement"
      class="scroll-indicator-thumb"
      :class="{
        'scroll-indicator-thumb-active': isScrolling,
        'scroll-indicator-thumb-dragging': isDragging
      }"
      :style="thumbStyle"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
      @lostpointercapture="stopDragging"
    />
  </div>
</template>

<style scoped>
.scroll-indicator {
  position: fixed;
  z-index: 80;
  top: 3px;
  right: 3px;
  bottom: 3px;
  width: 6px;
  pointer-events: none;
}

.scroll-indicator-thumb {
  width: 100%;
  border-radius: 999px;
  background: rgba(53, 81, 142, 0.5);
  cursor: grab;
  pointer-events: auto;
  touch-action: none;
  transition: height 180ms ease, background-color 180ms ease;
  will-change: height, transform;
}

.scroll-indicator-thumb:hover,
.scroll-indicator-thumb-active,
.scroll-indicator-thumb-dragging {
  background: rgba(53, 81, 142, 0.72);
}

.scroll-indicator-thumb-dragging {
  cursor: grabbing;
}

:global(html.scroll-indicator-dragging),
:global(html.scroll-indicator-dragging *) {
  cursor: grabbing !important;
  user-select: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-indicator-thumb {
    transition: none;
  }
}

@media print {
  .scroll-indicator {
    display: none;
  }
}
</style>
