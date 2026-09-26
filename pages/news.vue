<script setup lang="ts">
import { newsItems } from '~/data/news'

useHead({ title: 'ข่าวและกิจกรรม | แผนกคอมพิวเตอร์โปรแกรมเมอร์' })
</script>

<template>
  <LayoutAppNavbar />
  <main id="main-content" class="site-section" tabindex="-1">
    <div class="site-container">
      <NuxtLink to="/#news" class="btn-secondary mb-10">← กลับหน้าหลัก</NuxtLink>
      <header class="section-header">
        <p class="section-kicker">ความเคลื่อนไหวในแผนก</p>
        <h1 class="section-title">ข่าวและกิจกรรม</h1>
        <p class="body-copy mt-4">ตัวอย่างข่าวและกิจกรรม · ข้อมูลสมมติเพื่อแสดงรูปแบบเว็บไซต์</p>
      </header>
      <NewsList :items="newsItems" />
    </div>
  </main>
  <LayoutAppFooter />
</template>
