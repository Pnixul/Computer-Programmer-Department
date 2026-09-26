<script setup lang="ts">
import { newsItems } from '~/data/news'
</script>

<template>
  <section id="news" class="site-section site-section-alt news-section" aria-labelledby="news-title">
    <div class="site-container">
      <header class="news-heading">
        <div>
          <p class="section-kicker">ความเคลื่อนไหวในแผนก</p>
          <h2 id="news-title" class="subsection-title">ข่าวและกิจกรรม</h2>
          <p class="mt-3 text-sm leading-7 text-[var(--color-muted)]">เรื่องราวระหว่างทาง ทั้งในห้องเรียนและนอกห้องเรียน</p>
        </div>
        <NuxtLink to="/news" class="news-all">ดูข่าวและกิจกรรมทั้งหมด <span aria-hidden="true">↗</span></NuxtLink>
      </header>
      <p class="mb-5 text-xs text-[var(--color-muted)]">ตัวอย่างข่าวและกิจกรรม · ข้อมูลสมมติเพื่อแสดงรูปแบบเว็บไซต์</p>
      <NewsList :items="newsItems.slice(0, 3)" />
    </div>
  </section>
</template>

<style scoped>
.news-section { border-top: 1px solid var(--color-border); }
.news-heading { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; }
.news-all { display: inline-flex; min-height: 44px; align-items: center; gap: 1.5rem; border-bottom: 1px solid var(--color-navy); color: var(--color-navy); font-size: 0.875rem; font-weight: 700; }
.news-all:focus-visible { outline: 3px solid var(--color-yellow); outline-offset: 4px; }
</style>
