<script setup>
import { navigationItems } from '~/data/navigation'

const route = useRoute()
const { handleAnchorClick } = useSmoothScroll()
const { $smoothScroll } = useNuxtApp()
const menu = ref(null)
const isMenuOpen = ref(false)
const activeSection = ref('home')
const primaryItems = navigationItems.filter(item => item.primary)
const homeItem = navigationItems.find(item => item.id === 'home')
const contactItem = navigationItems.find(item => item.id === 'contact')
let sectionElements = []
let resumeScrolling = false

const closeMenu = () => menu.value?.close()

const releaseMenu = () => {
  isMenuOpen.value = false
  document.documentElement.classList.remove('navigation-scroll-lock')
  if (resumeScrolling) $smoothScroll?.instance?.start()
  resumeScrolling = false
}

const openMenu = () => {
  menu.value.showModal()
  isMenuOpen.value = true
  document.documentElement.classList.add('navigation-scroll-lock')
  resumeScrolling = !!$smoothScroll?.instance && !$smoothScroll.instance.isStopped
  $smoothScroll?.instance?.stop()
}

const trapMenuFocus = (event) => {
  if (event.key !== 'Tab') return
  const links = menu.value.querySelectorAll('button, a[href]')
  const first = links[0]
  const last = links[links.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

const handleNavigation = (event, item) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  closeMenu()
  // Unlock synchronously before asking Lenis to scroll to the destination.
  releaseMenu()
  if (route.path !== '/' || !item.href.startsWith('/#')) return
  const target = item.href.slice(1)
  if (handleAnchorClick(event, target)) {
    const element = document.getElementById(item.id)
    element?.setAttribute('tabindex', '-1')
    element?.focus({ preventScroll: true })
  }
}

const updateActiveSection = () => {
  const activationLine = (document.querySelector('.department-navbar')?.offsetHeight ?? 80) + 100
  const active = [...sectionElements].reverse().find(section => section.getBoundingClientRect().top <= activationLine)
  activeSection.value = active?.id ?? 'home'
}

onMounted(() => {
  sectionElements = navigationItems.map(item => document.getElementById(item.id)).filter(Boolean)
  updateActiveSection()
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  window.addEventListener('resize', updateActiveSection, { passive: true })
})

watch(() => route.fullPath, closeMenu)

onBeforeUnmount(() => {
  closeMenu()
  releaseMenu()
  window.removeEventListener('scroll', updateActiveSection)
  window.removeEventListener('resize', updateActiveSection)
})
</script>

<template>
  <nav class="department-navbar sticky top-0 z-30 w-full" aria-label="เมนูหลัก">
    <a class="skip-link" href="#main-content">ข้ามไปยังเนื้อหา</a>
    <div class="site-container navbar-zones">
      <NuxtLink to="/#home" class="department-brand" @click.capture="handleNavigation($event, homeItem)">
        <img src="/images/department-logo.png" alt="" class="h-10 w-10 shrink-0 object-contain md:h-11 md:w-11">
        <span class="min-w-0">
          <span class="block text-sm font-extrabold leading-tight sm:text-base">Computer Programmer</span>
          <span class="mt-1 block text-xs text-white/75">Learn / Build / Create</span>
        </span>
      </NuxtLink>
      <div class="primary-navigation">
        <NuxtLink v-for="item in primaryItems" :key="item.id" :to="item.href" class="nav-link whitespace-nowrap"
          :class="{ 'nav-link-active': route.path === '/' && activeSection === item.id }"
          :aria-current="route.path === '/' && activeSection === item.id ? 'location' : undefined"
          @click.capture="handleNavigation($event, item)">{{ item.label }}</NuxtLink>
      </div>
      <div class="navbar-utilities">
        <NuxtLink to="/#contact" class="contact-link" @click.capture="handleNavigation($event, contactItem)">ติดต่อเรา</NuxtLink>
        <button class="menu-trigger" type="button" aria-haspopup="dialog" :aria-expanded="isMenuOpen" aria-controls="site-menu" @click="openMenu">
          เมนู <span class="menu-lines" aria-hidden="true"><span></span><span></span></span>
        </button>
      </div>
    </div>
  </nav>
  <dialog id="site-menu" ref="menu" class="site-menu" aria-labelledby="menu-title" data-lenis-prevent @close="releaseMenu" @keydown="trapMenuFocus">
    <div class="site-container menu-content">
      <div class="menu-heading">
        <p id="menu-title" class="text-sm font-semibold tracking-wide">Computer Programmer <span class="hidden text-white/60 sm:inline">/ สำรวจแผนก</span></p>
        <button autofocus class="menu-trigger" type="button" @click="closeMenu">ปิดเมนู <span aria-hidden="true">×</span></button>
      </div>
      <div class="menu-layout">
        <div class="menu-intro">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-yellow)]">Learn / Build / Create</p>
          <p class="mt-5 text-3xl font-bold leading-snug lg:text-4xl">เริ่มจากความสนใจ<br>ไปสู่สิ่งที่สร้างได้</p>
          <p class="mt-5 text-sm leading-7 text-white/70">แผนกคอมพิวเตอร์โปรแกรมเมอร์<br>วิทยาลัยเทคนิคนครพนม</p>
        </div>
        <nav aria-label="ทุกส่วนของเว็บไซต์" class="menu-destinations">
          <NuxtLink v-for="(item, index) in navigationItems" :key="item.id" :to="item.href" class="menu-destination" :aria-current="route.path === '/' && activeSection === item.id ? 'location' : undefined" @click.capture="handleNavigation($event, item)">
            <span class="menu-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <span>{{ item.label }}</span><span class="menu-arrow" aria-hidden="true">↗</span>
          </NuxtLink>
        </nav>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.navbar-zones { display: flex; height: var(--navbar-height); align-items: center; justify-content: space-between; gap: 1rem; }
.department-brand { display: flex; min-width: 0; align-items: center; gap: 0.65rem; color: white; border-radius: 0.5rem; }
.primary-navigation, .contact-link { display: none; }
.navbar-utilities { display: flex; justify-content: end; align-items: center; gap: 1.25rem; }
.menu-trigger { display: inline-flex; min-height: 44px; flex-shrink: 0; align-items: center; justify-content: center; gap: 0.8rem; border: 1px solid #ffffff55; border-radius: 0.75rem; padding: 0.6rem 1rem; color: white; font-size: 0.875rem; font-weight: 700; }
.menu-trigger:hover { background: #ffffff18; }
.menu-lines { display: grid; gap: 5px; }
.menu-lines span { width: 16px; height: 1px; background: currentColor; }
a:focus-visible, button:focus-visible { outline: 3px solid var(--color-yellow); outline-offset: 4px; }
.skip-link { position: absolute; top: 0.5rem; left: 1rem; z-index: 2; padding: 0.75rem; background: white; color: var(--color-navy); transform: translateY(-150%); }
.skip-link:focus { transform: translateY(0); }
.site-menu { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; overflow-y: auto; overscroll-behavior: contain; background: var(--color-navy); color: white; }
.site-menu::backdrop { background: var(--color-navy); }
.menu-content { padding-bottom: 2rem; }
.menu-heading { display: flex; min-height: var(--navbar-height); align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #ffffff30; }
.menu-layout { display: grid; gap: 2rem; padding-top: clamp(1.5rem, 5vw, 4rem); }
.menu-intro { display: none; }
.menu-destinations { display: grid; }
.menu-destination { display: grid; grid-template-columns: 1.5rem 1fr auto; align-items: baseline; gap: 0.75rem; min-height: 52px; border-bottom: 1px solid #ffffff25; padding: 0.8rem 0; font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 600; }
.menu-number { font-size: 0.65rem; color: #ffffff99; font-weight: 500; }
.menu-arrow { color: var(--color-yellow); }
.menu-destination:hover, .menu-destination[aria-current] { color: var(--color-yellow); }
@media (min-width: 768px) {
  .menu-layout { grid-template-columns: 0.85fr 1.15fr; gap: 3rem; }
  .menu-intro { display: block; }
  .contact-link { display: inline-flex; min-height: 44px; align-items: center; font-size: 0.8rem; color: white; }
}
@media (min-width: 1280px) {
  .navbar-zones { display: grid; grid-template-columns: 1fr auto 1fr; }
  .primary-navigation { display: flex; }
  .primary-navigation .nav-link { padding-inline: 0.65rem; font-size: 0.8rem; }
}
@media (prefers-reduced-motion: reduce) { a, button { transition: none; } }
</style>
