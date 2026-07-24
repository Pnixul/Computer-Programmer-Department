<script setup>
const isMenuOpen = ref(false)
const activeSection = ref('home')

const navItems = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Learning', href: '#curriculum', id: 'curriculum' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Internship', href: '#internship', id: 'internship' },
  { label: 'Contact', href: '#contact', id: 'contact' }
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

  const navHeight = document.querySelector('nav')?.offsetHeight ?? 88
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
      rootMargin: '-88px 0px -45% 0px',
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
  <nav class="sticky top-0 z-30 w-full border-b border-[var(--color-border)] bg-white/95 shadow-[0_8px_28px_rgba(23,32,51,0.04)] backdrop-blur">
    <div class="site-container relative flex h-[72px] items-center justify-between gap-6 py-3 md:h-20 lg:h-[88px]">
      <a
        href="#home"
        class="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)]"
        @click="closeMenu"
      >
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(36,59,107,0.20)] lg:h-14 lg:w-14">
          CP
        </div>
        <div class="min-w-0">
          <p class="truncate text-base font-extrabold text-[var(--color-text)] sm:text-lg lg:text-xl">Computer Programmer</p>
          <p class="truncate text-xs font-medium text-[var(--color-muted)] md:text-sm">Learn / Build / Create</p>
        </div>
      </a>

      <div class="hidden items-center gap-1 md:flex lg:gap-2">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          class="nav-link"
          :class="{ 'nav-link-active': activeSection === item.id }"
        >
          {{ item.label }}
        </a>
      </div>

      <button
        class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-navy)] px-4 py-2 text-sm font-bold text-[var(--color-navy)] transition-[border-color,color,transform,opacity] duration-200 ease-out hover:-translate-y-px hover:border-[var(--color-blue)] hover:text-[var(--color-blue)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] md:hidden"
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
        class="absolute left-5 right-5 top-[calc(100%+10px)] rounded-2xl border border-[var(--color-border)] bg-white p-2 shadow-[0_20px_48px_rgba(23,32,51,0.14)] md:hidden"
      >
        <a
          v-for="item in navItems"
          :key="`mobile-${item.id}`"
          :href="item.href"
          class="nav-link flex w-full justify-start px-4 py-3"
          :class="{ 'nav-link-active': activeSection === item.id }"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>
      </div>
    </div>
  </nav>
</template>
