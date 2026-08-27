<script setup>
const { handleAnchorClick } = useSmoothScroll()
</script>

<template>
  <footer id="contact" class="w-full bg-[var(--color-navy)] text-white">
    <div class="site-container pb-0 pt-9 sm:pt-10 lg:pt-12">
      <div class="grid gap-7 md:grid-cols-2 md:gap-x-10 md:gap-y-9 lg:grid-cols-[1.25fr_0.75fr_1fr_1.2fr] lg:gap-8 xl:gap-10">
        <section class="order-3 md:order-none" aria-labelledby="footer-department-title">
          <div class="flex items-center gap-3.5">
            <img
              src="/images/department-logo.png"
              alt="โลโก้แผนกคอมพิวเตอร์โปรแกรมเมอร์"
              class="h-14 w-14 shrink-0 object-contain"
            >
            <h2 id="footer-department-title" class="text-xl font-extrabold leading-tight sm:text-2xl">
              แผนกคอมพิวเตอร์โปรแกรมเมอร์
            </h2>
          </div>
          <p class="mt-4 max-w-sm text-sm leading-6 text-[var(--color-blue-soft)]/80">
            วิทยาลัยเทคนิคนครพนม
          </p>
        </section>

        <nav class="order-4 md:order-none" aria-labelledby="footer-links-title">
          <h2 id="footer-links-title" class="text-base font-bold sm:text-lg">ลิงก์ด่วน</h2>
          <ul class="mt-4 space-y-2.5 text-sm text-[var(--color-blue-soft)]/80 sm:text-base">
            <li>
              <a class="inline-flex rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] hover:text-white" href="#about" @click="handleAnchorClick($event, '#about')">เกี่ยวกับแผนก</a>
            </li>
            <li>
              <a class="inline-flex rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] hover:text-white" href="#curriculum" @click="handleAnchorClick($event, '#curriculum')">การเรียนการสอน</a>
            </li>
            <li>
              <a class="inline-flex rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] hover:text-white" href="#projects" @click="handleAnchorClick($event, '#projects')">ผลงานผู้เรียน</a>
            </li>
            <li>
              <a class="inline-flex rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] hover:text-white" href="#faq" @click="handleAnchorClick($event, '#faq')">FAQ</a>
            </li>
          </ul>
        </nav>

        <section class="order-1 md:order-none" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title" class="text-base font-bold sm:text-lg">ติดต่อ</h2>
          <ul class="mt-3 space-y-3 text-sm leading-6 md:mt-4 md:space-y-3.5">
            <li>
              <p class="font-semibold text-white">ที่อยู่</p>
              <p class="mt-0.5 text-[var(--color-blue-soft)]/80">
                270 ถนนเฟื่องนคร ตำบลในเมือง อำเภอเมืองนครพนม จังหวัดนครพนม 48000
              </p>
            </li>
            <li>
              <a
                class="inline-flex rounded font-semibold text-[var(--color-blue-soft)]/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] hover:text-white"
                href="https://www.facebook.com/profile.php?id=61572281923163"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook ของแผนก
              </a>
            </li>
            <li>
              <a
                class="inline-flex rounded font-semibold text-[var(--color-blue-soft)]/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] hover:text-white"
                href="https://www.facebook.com/nkptechs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook ของวิทยาลัย
              </a>
            </li>
          </ul>
        </section>

        <section class="order-2 md:order-none" aria-labelledby="footer-location-title">
          <h2 id="footer-location-title" class="text-base font-bold sm:text-lg">ที่ตั้ง</h2>
          <div class="mt-3 h-32 w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 md:mt-4 md:h-56 md:min-h-56">
            <iframe
              class="pointer-events-none block h-full w-full border-0 md:pointer-events-auto"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58060.016014999106!2d104.70236778259275!3d17.40150685379526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313c093143cfb089%3A0x243098d859cf4a5e!2sNakhon%20Phanom%20Technical%20College!5e0!3m2!1sen!2sth!4v1786379810753!5m2!1sen!2sth"
              title="แผนที่วิทยาลัยเทคนิคนครพนม"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <a
            class="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/30 bg-white/[0.10] px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] hover:border-white/[0.45] hover:bg-white/[0.16] md:min-h-0 md:w-auto md:justify-start md:rounded md:border-0 md:bg-transparent md:p-0 md:font-semibold md:text-[var(--color-blue-soft)]/80 md:hover:bg-transparent md:hover:text-white"
            href="https://maps.app.goo.gl/4TK4ahCbaZwyQstCA"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="เปิดวิทยาลัยเทคนิคนครพนมใน Google Maps"
          >
            เปิดใน Google Maps
          </a>
        </section>
      </div>

      <div class="mt-8 border-t border-white/15 py-3.5 text-center text-sm text-[var(--color-blue-soft)]/70 md:mt-9 md:text-left">
        <p>© 2026 แผนกคอมพิวเตอร์โปรแกรมเมอร์ · วิทยาลัยเทคนิคนครพนม</p>
      </div>
    </div>
  </footer>
</template>
