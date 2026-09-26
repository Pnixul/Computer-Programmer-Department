<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'th', class: 'admin-document' },
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
// This layout is an integration point for future server-backed authentication.
// No route hiding or client-side check here provides authorization.
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
        <NuxtLink to="/" class="admin-button">ดูเว็บไซต์</NuxtLink>
      </div>
    </header>
    <div class="site-container grid gap-6 py-6 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
      <nav aria-label="เมนูจัดการเว็บไซต์" class="flex gap-2 self-start lg:sticky lg:top-6 lg:flex-col">
        <NuxtLink to="/admin" class="admin-nav" exact-active-class="admin-nav-active">ภาพรวม</NuxtLink>
        <NuxtLink to="/admin/faq" class="admin-nav" exact-active-class="admin-nav-active">จัดการ FAQ</NuxtLink>
      </nav>
      <main id="admin-main" tabindex="-1" class="min-w-0">
        <p class="mb-6 rounded-xl border border-[var(--color-blue-border)] bg-[var(--color-blue-soft)] p-4 text-sm leading-7 text-[var(--color-navy)]">
          ยังไม่มีระบบเข้าสู่ระบบ · FAQ อ่านข้อมูลจากฐานข้อมูล แต่ยังไม่เปิดให้บันทึกหรือลบจนกว่าจะมีการยืนยันสิทธิ์ผู้ดูแล สถิติผู้เข้าชมยังเป็นข้อมูลตัวอย่าง
        </p>
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
.admin-panel { padding: clamp(1rem, 3vw, 1.5rem); border: 1px solid var(--color-border); border-radius: 1rem; background: white; }
.admin-field { display: block; width: 100%; min-height: 44px; margin-top: 0.5rem; border: 1px solid #98a2b3; border-radius: 0.75rem; padding: 0.75rem; background: white; color: var(--color-text); font-weight: 400; }
textarea.admin-field { resize: vertical; line-height: 1.8; }
@media (min-width: 1024px) { .admin-nav { justify-content: flex-start; } }
@media (prefers-reduced-motion: reduce) { .admin-shell * { transition: none !important; } }
</style>
