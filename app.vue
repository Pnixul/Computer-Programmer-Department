<script setup lang="ts">
const route = useRoute()
const isAdmin = computed(() => route.path === '/admin' || route.path.startsWith('/admin/'))
</script>

<template>
  <div>
    <LayoutAppIntro v-if="!isAdmin" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <LayoutAppScrollIndicator v-if="!isAdmin" />
  </div>
</template>
