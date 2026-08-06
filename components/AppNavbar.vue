<script setup>
const isMenuOpen = ref(false)
const activeSection = ref('home')

const navItems = [
  { label: 'หน้าหลัก', href: '#home', id: 'home' },
  { label: 'เกี่ยวกับแผนก', href: '#about', id: 'about' },
  { label: 'การเรียนการสอน', href: '#curriculum', id: 'curriculum' },
  { label: 'ผลงานนักศึกษา', href: '#projects', id: 'projects' },
  { label: 'ฝึกประสบการณ์วิชาชีพ', href: '#internship', id: 'internship' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
  { label: 'ติดต่อเรา', href: '#contact', id: 'contact' }
]

const closeMenu = () => {
  isMenuOpen.value = false
}

let sectionObserver
let sectionElements = []

const updateActiveSection = () => {
  if (!sectionElements.length) {
    return
  }

  const navHeight = document.querySelector('nav')?.offsetHeight ?? 80
  const activationLine = navHeight + (window.innerHeight - navHeight) * 0.32

  const active = sectionElements.find((section) => {
    const rect = section.getBoundingClientRect()
    return rect.top <= activationLine && rect.bottom > activationLine
  })

  if (active?.id) {
    activeSection.value = active.id
    return
  }

  const nearest = sectionElements
    .map((section) => {
      const rect = section.getBoundingClientRect()
      return {
        id: section.id,
        distance: Math.abs(rect.top - activationLine)
      }
    })
    .sort((a, b) => a.distance - b.distance)[0]

  if (nearest?.id) {
    activeSection.value = nearest.id
  }
}

onMounted(() => {
  sectionElements = navItems
    .map((item) => document.getElementById(item.id))
    .filter(Boolean)

  sectionObserver = new IntersectionObserver(
    () => updateActiveSection(),
    {
      rootMargin: '-80px 0px -45% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    }
  )

  sectionElements.forEach((section) => sectionObserver.observe(section))
  updateActiveSection()
  window.addEventListener('resize', updateActiveSection, { passive: true })
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  window.removeEventListener('resize', updateActiveSection)
})
</script>

<template>
  <nav
    class="department-navbar sticky top-0 z-30 w-full"
    aria-label="Primary navigation"
  >
    <div class="site-container relative flex h-[72px] items-center justify-between gap-6 py-2 md:h-[76px] lg:h-20">
      <a
        href="#home"
        class="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F4C542]/50 sm:gap-3.5"
        @click="closeMenu"
      >
        <img
          src="/images/department-logo.png"
          alt="โลโก้แผนกช่างเขียนโปรแกรมคอมพิวเตอร์"
          class="h-10 w-10 shrink-0 rounded-full border border-white/20 object-cover shadow-[0_4px_12px_rgba(16,30,64,0.22)] md:h-11 md:w-11"
        >
        <div class="min-w-0">
          <p class="truncate text-base font-extrabold leading-tight text-white sm:text-lg lg:text-xl">Computer Programmer</p>
          <p class="mt-0.5 truncate text-xs font-medium text-white/70 md:text-sm">Learn / Build / Create</p>
        </div>
      </a>

      <div class="desktop-navigation hidden shrink-0 items-center gap-0 xl:flex 2xl:gap-1">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          class="nav-link nav-link-desktop whitespace-nowrap"
          :class="{
            'nav-link-active': activeSection === item.id,
            'nav-link-contact': item.id === 'contact'
          }"
          :aria-current="activeSection === item.id ? 'page' : undefined"
        >
          {{ item.label }}
        </a>
      </div>

      <button
        class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-px hover:border-white/40 hover:bg-white/[0.12] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F4C542]/50 xl:hidden"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        @click="isMenuOpen = !isMenuOpen"
      >
        Menu
      </button>

      <div
        v-show="isMenuOpen"
        id="mobile-navigation"
        class="absolute left-5 right-5 top-[calc(100%+8px)] rounded-2xl border border-white/15 bg-[#35518E]/[0.98] p-2 shadow-[0_20px_48px_rgba(16,30,64,0.28)] backdrop-blur-xl xl:hidden"
      >
        <a
          v-for="item in navItems"
          :key="`mobile-${item.id}`"
          :href="item.href"
          class="nav-link flex w-full justify-start px-4 py-3"
          :class="{ 'nav-link-active': activeSection === item.id }"
          :aria-current="activeSection === item.id ? 'page' : undefined"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@media (min-width: 1280px) {
  .nav-link-desktop {
    padding-right: 0.625rem;
    padding-left: 0.625rem;
    font-size: 13px;
  }

  .nav-link-desktop.nav-link-active:not(.nav-link-contact) {
    margin-right: 0.125rem;
    margin-left: 0.125rem;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }

  .nav-link-contact {
    margin-left: 0.375rem;
    padding-right: 0.875rem;
    padding-left: 0.875rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 5px 14px rgba(16, 30, 64, 0.12);
  }

  .nav-link-contact:hover {
    border-color: rgba(255, 255, 255, 0.48);
    background: rgba(255, 255, 255, 0.15);
  }

  .nav-link-contact.nav-link-active {
    border-color: rgba(244, 197, 66, 0.65);
    background: rgba(255, 255, 255, 0.12);
  }
}

@media (min-width: 1536px) {
  .nav-link-desktop {
    padding-right: 0.75rem;
    padding-left: 0.75rem;
    font-size: 0.875rem;
  }

  .nav-link-desktop.nav-link-active:not(.nav-link-contact) {
    padding-right: 0.625rem;
    padding-left: 0.625rem;
  }

  .nav-link-contact {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}
</style>
