<script setup>
const FILL_DURATION = 2250
const HOLD_DURATION = 250
const EXIT_DURATION = 260

const isVisible = ref(true)
const isFilling = ref(false)
const isLeaving = ref(false)
const { $smoothScroll } = useNuxtApp()

let fillTimer
let exitTimer
let frameId
let activeExitDuration = EXIT_DURATION

const unlockPage = () => {
  document.documentElement.classList.remove('intro-scroll-lock')
  document.body.classList.remove('intro-scroll-lock')
  $smoothScroll?.instance?.start()
  $smoothScroll?.instance?.resize()
}

const startExit = () => {
  isLeaving.value = true

  exitTimer = window.setTimeout(() => {
    isVisible.value = false
    unlockPage()
  }, activeExitDuration)
}

onMounted(() => {
  document.documentElement.classList.add('intro-scroll-lock')
  document.body.classList.add('intro-scroll-lock')
  $smoothScroll?.instance?.stop()

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  activeExitDuration = prefersReducedMotion ? 80 : EXIT_DURATION

  frameId = window.requestAnimationFrame(() => {
    isFilling.value = true

    if (prefersReducedMotion) {
      fillTimer = window.setTimeout(startExit, 80)
      return
    }

    fillTimer = window.setTimeout(startExit, FILL_DURATION + HOLD_DURATION)
  })
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(frameId)
  window.clearTimeout(fillTimer)
  window.clearTimeout(exitTimer)

  if (isVisible.value) {
    unlockPage()
  }
})
</script>

<template>
  <div
    v-if="isVisible"
    class="intro-screen"
    :class="{
      'intro-screen--filling': isFilling,
      'intro-screen--leaving': isLeaving
    }"
    role="status"
    aria-label="Preparing the Computer Programmer department website"
  >
    <div class="intro-title" aria-hidden="true">
      <div class="intro-title__layer intro-title__base">
        <span class="intro-title__word">COMPUTER</span>
        <span class="intro-title__word">PROGRAMMER</span>
      </div>

      <div class="intro-title__layer intro-title__fill">
        <span class="intro-title__word">COMPUTER</span>
        <span class="intro-title__word">PROGRAMMER</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-screen {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 2rem clamp(1.25rem, 4vw, 4rem);
  background: var(--color-navbar);
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 260ms ease-out,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.intro-screen--leaving {
  opacity: 0;
  transform: scale(1.008);
  pointer-events: none;
}

.intro-title {
  position: relative;
  max-width: 100%;
  font-family: ui-monospace, 'Cascadia Code', 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: clamp(2rem, 4.8vw, 4.75rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: clamp(0.06em, 0.38vw, 0.13em);
  text-align: center;
  white-space: nowrap;
}

.intro-title__layer {
  display: block;
}

.intro-title__fill {
  position: absolute;
  inset: 0;
  color: var(--color-yellow);
  clip-path: inset(0 100% 0 0);
  -webkit-text-stroke: 0.5px color-mix(in srgb, var(--color-yellow), white 20%);
  text-shadow:
    1px 1px 0 color-mix(in srgb, var(--color-yellow), var(--color-navy) 38%),
    2px 2px 0 color-mix(in srgb, var(--color-yellow), var(--color-navy) 52%),
    0 8px 18px rgba(23, 32, 51, 0.16);
  transition: clip-path 2250ms cubic-bezier(0.58, 0.02, 0.22, 1);
  transition: clip-path 2250ms linear(
    0,
    0.01 5%,
    0.04 10%,
    0.09 15%,
    0.15 20%,
    0.26 31%,
    0.4 42%,
    0.57 53%,
    0.72 61%,
    0.8 65%,
    0.84 68%,
    0.88 72%,
    0.92 78%,
    0.95 86%,
    0.975 91%,
    0.993 96%,
    1
  );
  will-change: clip-path;
}

.intro-title__base {
  color: rgba(238, 243, 251, 0.34);
  -webkit-text-stroke: 0.75px rgba(255, 255, 255, 0.48);
  text-shadow:
    1px 1px 0 rgba(23, 32, 51, 0.28),
    2px 2px 0 rgba(23, 32, 51, 0.2),
    0 8px 18px rgba(23, 32, 51, 0.12);
}

.intro-screen--filling .intro-title__fill {
  clip-path: inset(0 0 0 0);
}

.intro-title__word + .intro-title__word::before {
  content: ' ';
}

@media (max-width: 639px) {
  .intro-title {
    width: 100%;
    font-size: clamp(2rem, 10.5vw, 3rem);
    line-height: 1.08;
    letter-spacing: clamp(0.05em, 1.3vw, 0.1em);
    white-space: normal;
  }

  .intro-title__word {
    display: block;
  }

  .intro-title__word + .intro-title__word {
    margin-top: 0.18em;
  }

  .intro-title__word + .intro-title__word::before {
    content: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-screen {
    transition-duration: 80ms;
  }

  .intro-screen--leaving {
    transform: none;
  }

  .intro-title__fill {
    transition: none;
  }
}
</style>
