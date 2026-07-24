<script setup>
const isMenuOpen = ref(false)
const isScrolled = ref(false)
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

const updateScrollState = () => {
  isScrolled.value = window.scrollY > 8
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
  updateScrollState()
  window.addEventListener('resize', updateActiveSection, { passive: true })
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  window.removeEventListener('resize', updateActiveSection)
  window.removeEventListener('scroll', updateScrollState)
})
</script>

<template>
  <nav
    class="sticky top-0 z-30 w-full border-b border-[#E6EAF0] bg-[#FAFBFD]/95 backdrop-blur-md transition-shadow duration-300 ease-out"
    :class="{ 'shadow-[0_8px_24px_rgba(23,32,51,0.08)]': isScrolled }"
  >
    <div class="site-container relative flex h-[72px] items-center justify-between gap-6 py-3 md:h-20 lg:h-[88px]">
      <a
        href="#home"
        class="flex min-w-0 items-center gap-3.5 rounded-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] sm:gap-4"
        @click="closeMenu"
      >
        <img
          src="/images/department-logo.png"
          alt="โลโก้แผนกช่างเขียนโปรแกรมคอมพิวเตอร์"
          class="h-10 w-auto shrink-0 object-contain md:h-11 lg:h-12"
        >
        <div class="min-w-0">
          <p class="truncate text-base font-extrabold leading-tight text-[var(--color-text)] sm:text-lg lg:text-xl">Computer Programmer</p>
          <p class="mt-0.5 truncate text-xs font-medium text-[var(--color-muted)] md:text-sm">Learn / Build / Create</p>
        </div>
      </a>

      <div class="hidden items-center gap-1 md:flex lg:gap-2">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          class="nav-link"
          :class="{ 'nav-link-active': activeSection === item.id }"
          :aria-current="activeSection === item.id ? 'page' : undefined"
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
          :aria-current="activeSection === item.id ? 'page' : undefined"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>
      </div>
    </div>
  </nav>
</template>
