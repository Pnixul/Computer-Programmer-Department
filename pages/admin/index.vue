<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'ภาพรวม | จัดการเว็บไซต์แผนก' })
const { data: statistics, status, refresh } = useVisitorStatistics()
const formatCount = (value: number) => value.toLocaleString('th-TH')
const formatDate = (value: string) => new Intl.DateTimeFormat('th-TH', {
  day: 'numeric', month: 'short', timeZone: 'UTC',
}).format(new Date(`${value}T00:00:00Z`))
const largestDay = computed(() => Math.max(1, ...statistics.value?.recentDays.map(day => day.visitors) ?? []))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold sm:text-3xl">ภาพรวมเว็บไซต์</h1>
    <p class="mb-6 mt-2 text-[var(--color-muted)]">สถิติการเข้าชมเว็บไซต์แผนก · ข้อมูลตัวอย่าง</p>
    <p v-if="status === 'pending'" class="admin-panel" role="status">กำลังโหลดสถิติ…</p>
    <div v-else-if="status === 'error'" class="admin-panel" role="alert">
      <p>ไม่สามารถโหลดสถิติได้</p>
      <button type="button" class="admin-button mt-4" @click="refresh()">ลองอีกครั้ง</button>
    </div>
    <template v-else-if="statistics">
      <dl class="grid gap-6 border-y border-[var(--color-border)] py-6 sm:grid-cols-2">
        <div>
          <dt class="text-sm text-[var(--color-muted)]">ผู้เข้าชมทั้งหมด</dt>
          <dd class="mt-2 text-3xl font-bold tabular-nums text-[var(--color-navy)]">{{ formatCount(statistics.totalVisitors) }} <span class="text-sm font-normal">ครั้ง</span></dd>
        </div>
        <div>
          <dt class="text-sm text-[var(--color-muted)]">ผู้เข้าชมวันนี้</dt>
          <dd class="mt-2 text-3xl font-bold tabular-nums text-[var(--color-navy)]">{{ formatCount(statistics.todayVisitors) }} <span class="text-sm font-normal">ครั้ง</span></dd>
        </div>
      </dl>
      <section class="py-6" aria-labelledby="visitor-trend-title">
        <h2 id="visitor-trend-title" class="text-lg font-bold">การเข้าชมย้อนหลัง 7 วัน</h2>
        <p class="mt-1 text-sm leading-7 text-[var(--color-muted)]">ข้อมูลตัวอย่าง ณ {{ formatDate(statistics.asOf) }} · จำนวนครั้งที่เข้าชม ไม่ใช่จำนวนบุคคลที่ไม่ซ้ำกัน</p>
        <ul v-if="statistics.recentDays.length" class="mt-5 space-y-4">
          <li v-for="day in statistics.recentDays" :key="day.date" class="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 text-sm">
            <time :datetime="day.date">{{ formatDate(day.date) }}</time>
            <div class="h-3 overflow-hidden rounded-full bg-[var(--color-blue-soft)]" aria-hidden="true">
              <div class="h-full rounded-full bg-[var(--color-blue)]" :style="{ width: `${day.visitors / largestDay * 100}%` }" />
            </div>
            <span class="text-right tabular-nums">{{ formatCount(day.visitors) }}<span class="sr-only"> ครั้ง</span></span>
          </li>
        </ul>
        <p v-else class="mt-4 text-[var(--color-muted)]">ยังไม่มีข้อมูลการเข้าชมรายวัน</p>
      </section>
    </template>
    <p v-else class="admin-panel">ยังไม่มีข้อมูลสถิติผู้เข้าชม</p>
    <section class="admin-panel mt-6">
      <h2 class="text-lg font-bold">คำถามที่พบบ่อย</h2>
      <p class="mb-4 mt-2 text-sm leading-7 text-[var(--color-muted)]">เพิ่มและปรับปรุงคำตอบที่แสดงในหน้าเว็บไซต์</p>
      <NuxtLink to="/admin/faq" class="admin-button">จัดการ FAQ</NuxtLink>
    </section>
  </div>
</template>
