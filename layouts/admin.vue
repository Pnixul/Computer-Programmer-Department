<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'th', class: 'admin-document' },
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
const route = useRoute()
const isLogin = computed(() => decodeURI(route.path).toLowerCase().replace(/\/$/, '') === '/admin/login')
const { user, logout } = useAdminAuth()
const loggingOut = ref(false)
const logoutError = ref('')
const signOut = async () => {
  if (loggingOut.value) return
  loggingOut.value = true
  logoutError.value = ''
  try { await logout() }
  catch { logoutError.value = 'ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง' }
  finally { loggingOut.value = false }
}
</script>

<template>
  <div class="admin-shell min-h-screen">
    <a href="#admin-main" class="admin-skip">ข้ามไปยังเนื้อหา</a>
    <header class="border-b border-[var(--color-border)] bg-white">
      <div class="site-container flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
        <div>
          <p class="font-bold text-[var(--color-navy)]">จัดการเว็บไซต์แผนก</p>
          <p class="mt-1 text-sm text-[var(--color-muted)]">คอมพิวเตอร์โปรแกรมเมอร์</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span v-if="!isLogin && user" class="text-sm text-[var(--color-muted)]">{{ user.email }}</span>
          <NuxtLink to="/" class="admin-button">ดูเว็บไซต์</NuxtLink>
          <button v-if="!isLogin" type="button" class="admin-button" :disabled="loggingOut" @click="signOut">{{ loggingOut ? 'กำลังออก…' : 'ออกจากระบบ' }}</button>
        </div>
      </div>
    </header>
    <div class="site-container grid gap-6 py-6 lg:gap-10 lg:py-10" :class="{ 'lg:grid-cols-[12rem_minmax(0,1fr)]': !isLogin }">
      <nav v-if="!isLogin" aria-label="เมนูจัดการเว็บไซต์" class="flex gap-2 self-start lg:sticky lg:top-6 lg:flex-col">
        <NuxtLink to="/admin" class="admin-nav" exact-active-class="admin-nav-active">ภาพรวม</NuxtLink>
        <NuxtLink to="/admin/faq" class="admin-nav" exact-active-class="admin-nav-active">จัดการ FAQ</NuxtLink>
      </nav>
      <main id="admin-main" tabindex="-1" class="min-w-0">
        <p v-if="logoutError" role="alert" class="mb-4 text-sm text-red-800">{{ logoutError }}</p>
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
.admin-document { scroll-behavior: auto; scrollbar-width: auto; }
html.admin-document::-webkit-scrollbar,
html.admin-document body::-webkit-scrollbar { display: block; width: 10px; height: 10px; }
.admin-shell { overflow-wrap: anywhere; }
.admin-shell :where(a, button, input, textarea, select):focus-visible {
  outline: 3px solid var(--color-blue);
  outline-offset: 3px;
}
.admin-skip { position: fixed; top: -6rem; left: 1rem; z-index: 90; padding: 0.75rem; background: white; }
.admin-skip:focus { top: 1rem; }
.admin-nav, .admin-button {
  display: inline-flex; min-height: 44px; align-items: center; justify-content: center;
  border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 0.6rem 1rem;
  background: white; color: var(--color-navy); font-size: 0.875rem; font-weight: 700;
}
.admin-nav { flex: 1; }
.admin-nav:hover, .admin-button:hover { background: var(--color-blue-soft); }
.admin-nav-active, .admin-button-primary { border-color: var(--color-navy); background: var(--color-navy); color: white; }
.admin-nav-active:hover, .admin-button-primary:hover { background: var(--color-blue); color: white; }
.admin-button-danger { color: #a32626; border-color: #e7bcbc; }
.admin-button-danger:hover { background: #fff4f4; }
.admin-button:disabled { opacity: 0.55; cursor: wait; }
.admin-panel { padding-block: 1.5rem; border-block: 1px solid var(--color-border); }
.admin-field { display: block; width: 100%; min-height: 44px; margin-top: 0.5rem; border: 1px solid #98a2b3; border-radius: 0.75rem; padding: 0.75rem; background: white; color: var(--color-text); font-weight: 400; }
textarea.admin-field { resize: vertical; line-height: 1.8; }
@media (min-width: 1024px) { .admin-nav { justify-content: flex-start; } }
@media (prefers-reduced-motion: reduce) { .admin-shell * { transition: none !important; } }
</style>
