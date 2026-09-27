<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'เข้าสู่ระบบ | จัดการเว็บไซต์แผนก' })
const { login } = useAdminAuth()
const email = ref('')
const password = ref('')
const pending = ref(false)
const error = ref('')

const submit = async () => {
  if (pending.value) return
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = 'กรุณากรอกอีเมลและรหัสผ่าน'
    return
  }
  pending.value = true
  try {
    await login(email.value.trim(), password.value)
    password.value = ''
    await navigateTo('/admin', { replace: true })
  } catch (cause) {
    const status = (cause as { statusCode?: number }).statusCode
    error.value = status === 401 ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      : status === 403 ? 'บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลเว็บไซต์'
      : status === 429 ? 'ลองเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่'
      : 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองอีกครั้ง'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-md py-6 sm:py-12" aria-labelledby="login-title">
    <h1 id="login-title" class="text-2xl font-bold sm:text-3xl">เข้าสู่ระบบผู้ดูแล</h1>
    <p class="mt-3 leading-7 text-[var(--color-muted)]">ใช้บัญชีที่ได้รับสิทธิ์จัดการเว็บไซต์แผนก</p>
    <form class="mt-8 space-y-5" :aria-busy="pending" @submit.prevent="submit">
      <fieldset :disabled="pending" class="min-w-0 space-y-5">
        <legend class="sr-only">ข้อมูลเข้าสู่ระบบ</legend>
        <label for="admin-email" class="block font-medium">อีเมล
          <input id="admin-email" v-model="email" class="admin-field" type="email" autocomplete="username" required maxlength="254">
        </label>
        <label for="admin-password" class="block font-medium">รหัสผ่าน
          <input id="admin-password" v-model="password" class="admin-field" type="password" autocomplete="current-password" required maxlength="1024">
        </label>
        <p v-if="error" role="alert" class="text-sm leading-7 text-red-800">{{ error }}</p>
        <button type="submit" class="admin-button admin-button-primary w-full">{{ pending ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ' }}</button>
      </fieldset>
    </form>
  </section>
</template>
