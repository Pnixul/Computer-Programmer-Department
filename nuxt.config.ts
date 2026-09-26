// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // Accept existing Next-style local env names; NUXT_* remains the runtime override.
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
  },
  css: ['lenis/dist/lenis.css', '~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
