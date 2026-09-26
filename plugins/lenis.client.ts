import Lenis from 'lenis'
import { shallowRef } from 'vue'

const DESKTOP_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export default defineNuxtPlugin((nuxtApp) => {
  const instance = shallowRef<Lenis | null>(null)
  const router = useRouter()
  const desktopPointer = window.matchMedia(DESKTOP_POINTER_QUERY)
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)

  const destroyInstance = () => {
    instance.value?.destroy()
    instance.value = null
  }

  const syncInstance = () => {
    const path = router.currentRoute.value.path
    const isAdmin = path === '/admin' || path.startsWith('/admin/')
    const shouldEnable = desktopPointer.matches && !reducedMotion.matches && !isAdmin

    if (!shouldEnable) {
      destroyInstance()
      return
    }

    if (instance.value) {
      return
    }

    instance.value = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      anchors: false,
      gestureOrientation: 'vertical',
    })
  }

  const destroy = () => {
    removeRouteHook()
    desktopPointer.removeEventListener('change', syncInstance)
    reducedMotion.removeEventListener('change', syncInstance)
    destroyInstance()
  }

  desktopPointer.addEventListener('change', syncInstance)
  reducedMotion.addEventListener('change', syncInstance)
  const removeRouteHook = router.afterEach(syncInstance)
  syncInstance()

  nuxtApp.vueApp.onUnmount(destroy)
  import.meta.hot?.dispose(destroy)

  return {
    provide: {
      smoothScroll: {
        get instance() {
          return instance.value
        },
      },
    },
  }
})
