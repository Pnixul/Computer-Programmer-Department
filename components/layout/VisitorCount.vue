<script setup lang="ts">
const { data: statistics, status } = useVisitorStatistics()
const formatCount = (value: number) => value.toLocaleString('th-TH')
</script>

<template>
  <p class="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs leading-6 md:justify-start" aria-live="polite">
    <template v-if="status === 'success' && statistics">
      <span>ผู้เข้าชมทั้งหมด {{ formatCount(statistics.totalVisitors) }} ครั้ง</span>
      <span>วันนี้ {{ formatCount(statistics.todayVisitors) }} ครั้ง</span>
      <span class="text-white/70">ข้อมูลตัวอย่าง</span>
    </template>
    <span v-else-if="status === 'pending'">กำลังโหลดสถิติผู้เข้าชม…</span>
    <span v-else>ยังไม่สามารถแสดงสถิติผู้เข้าชมได้</span>
  </p>
</template>
