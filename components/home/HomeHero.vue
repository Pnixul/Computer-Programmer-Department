<script setup>
const { handleAnchorClick } = useSmoothScroll()
</script>

<template>
  <section id="home" class="site-section overflow-hidden">
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

        <img
          class="hero-mascot"
          src="/images/mascot/mascot-hero.png"
          alt=""
          width="1536"
          height="1024"
          draggable="false"
        >
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-mascot {
  justify-self: end;
  width: min(75%, 15rem);
  height: auto;
  aspect-ratio: 27 / 40;
  object-fit: contain;
  object-position: right;
}

@media (max-width: 767px) {
  .hero-mascot {
    justify-self: center;
    /* Center visible artwork: PNG padding is 77px left / 31px right at 1225px wide. */
    transform: translateX(-1.88%);
  }
}

@media (min-width: 768px) {
  .hero-mascot {
    justify-self: center;
    width: min(100%, 21.6rem);
  }
}
</style>
