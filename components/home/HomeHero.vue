<script setup>
const { handleAnchorClick } = useSmoothScroll()
</script>

<template>
  <main id="home" class="site-section overflow-hidden">
    <div class="site-container">
      <div class="grid items-center gap-8 sm:gap-10 md:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <section class="max-w-3xl">
          <div class="eyebrow">
            แผนกคอมพิวเตอร์โปรแกรมเมอร์
          </div>

          <h1 class="max-w-[760px] text-[1.75rem] font-bold leading-[1.3] text-[var(--color-text)] sm:text-4xl sm:leading-[1.28] md:text-5xl lg:text-[3.25rem] lg:leading-[1.25]">
            ชอบ<span class="text-[#326BC4]">คอมพิวเตอร์</span><br>
            และอยากลอง<br>
            <span class="text-[#326BC4]">สร้างอะไร</span>ด้วยตัวเองไหม?
          </h1>

          <p class="body-copy mt-6 max-w-[660px] sm:mt-7 lg:mt-8">
            เรียนรู้การเขียนโปรแกรม การพัฒนาเว็บไซต์ และทักษะด้านเทคโนโลยี ผ่านการลงมือทำและประสบการณ์จริง
          </p>

          <div class="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <a href="#about" class="btn-primary min-h-11 px-5 py-2.5 sm:min-h-12 sm:px-7 sm:py-3" @click="handleAnchorClick($event, '#about')">
              รู้จักแผนกของเรา
            </a>
            <a href="#projects" class="btn-secondary min-h-11 px-5 py-2.5 sm:min-h-12 sm:px-7 sm:py-3" @click="handleAnchorClick($event, '#projects')">
              ดูผลงานผู้เรียน
            </a>
          </div>
        </section>

        <section class="hidden justify-center md:flex md:justify-end" aria-label="พื้นที่สำหรับภาพประกอบของแผนก">
          <div class="surface-card w-full max-w-[540px] p-3 sm:p-5 lg:max-w-[560px]">
            <div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]">
              <div class="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2.5 sm:px-4 sm:py-3">
                <span class="h-2.5 w-2.5 rounded-full bg-[var(--color-yellow)]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-[var(--color-blue-border)]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-[var(--color-navy)]"></span>
              </div>
              <div class="grid aspect-[4/3] place-items-center p-4 sm:aspect-[5/4] sm:p-7">
                <div class="w-full space-y-3 rounded-2xl border border-[var(--color-blue-border)] bg-white p-4 shadow-[0_12px_28px_rgba(23,32,51,0.06)] sm:space-y-4 sm:p-5">
                  <div class="h-3 w-2/3 rounded-full bg-[var(--color-navy)]"></div>
                  <div class="h-3 w-5/6 rounded-full bg-[var(--color-blue-soft)]"></div>
                  <div class="h-3 w-1/2 rounded-full bg-[var(--color-blue-soft)]"></div>
                  <div class="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
                    <div class="h-14 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] sm:h-16"></div>
                    <div class="h-14 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] sm:h-16"></div>
                    <div class="h-14 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] sm:h-16"></div>
                  </div>
                  <p class="pt-1 text-center text-sm font-bold text-[var(--color-muted)] sm:pt-2">
                    พื้นที่สำหรับภาพประกอบ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
