export type SmoothScrollTarget = number | string | HTMLElement

export interface SmoothScrollOptions {
  immediate?: boolean
  offset?: number
  updateHash?: boolean
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const resolveTarget = (target: SmoothScrollTarget) => {
  if (typeof target !== 'string') {
    return target
  }

  try {
    return document.querySelector<HTMLElement>(target)
  }
  catch {
    return null
  }
}

const getTargetOffset = (target: number | HTMLElement) => {
  if (typeof target === 'number') {
    return 0
  }

  const scrollMarginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop)
  return Number.isFinite(scrollMarginTop) ? -scrollMarginTop : 0
}

const getNativeScrollTop = (target: number | HTMLElement, offset: number) => {
  if (typeof target === 'number') {
    return target + offset
  }

  return target.getBoundingClientRect().top + window.scrollY + offset
}

export const useSmoothScroll = () => {
  const { $smoothScroll } = useNuxtApp()

  const scrollTo = (target: SmoothScrollTarget, options: SmoothScrollOptions = {}) => {
    if (!import.meta.client) {
      return false
    }

    const resolvedTarget = resolveTarget(target)

    if (resolvedTarget === null) {
      return false
    }

    const offset = options.offset ?? getTargetOffset(resolvedTarget)
    const immediate = options.immediate ?? false

    if ($smoothScroll.instance) {
      $smoothScroll.instance.scrollTo(resolvedTarget, { offset, immediate })
    }
    else {
      const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches

      window.scrollTo({
        top: getNativeScrollTop(resolvedTarget, offset),
        behavior: immediate || prefersReducedMotion ? 'auto' : 'smooth',
      })
    }

    if (
      options.updateHash !== false
      && typeof target === 'string'
      && target.startsWith('#')
      && window.location.hash !== target
    ) {
      window.history.pushState(null, '', target)
    }

    return true
  }

  const handleAnchorClick = (event: MouseEvent, target: string) => {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return false
    }

    event.preventDefault()
    return scrollTo(target)
  }

  return {
    handleAnchorClick,
    scrollTo,
  }
}
