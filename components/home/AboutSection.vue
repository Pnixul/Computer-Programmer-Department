<template>
  <section id="about" class="site-section site-section-alt about-section">
    <div class="site-container about-layout">
      <header>
        <p class="section-kicker">เกี่ยวกับแผนก</p>
        <h2 class="subsection-title">
          รู้จักแผนกคอมพิวเตอร์โปรแกรมเมอร์
        </h2>
        <p class="body-copy mt-4 max-w-3xl">
          เรียนรู้ทั้งการเขียนโปรแกรม การพัฒนาเว็บไซต์ ฐานข้อมูล ระบบคอมพิวเตอร์ และเครือข่าย พร้อมฝึกทักษะผ่านการลงมือทำและโปรเจกต์ระหว่างเรียน
        </p>
      </header>

        <ul class="about-principles">
          <li>
            <div class="accent-icon rounded-full" aria-hidden="true">01</div>
            <div>
              <h3 class="text-lg font-bold text-[var(--color-text)]">เรียนผ่านการลงมือทำ</h3>
              <p class="mt-1 text-base leading-7 text-[var(--color-muted)]">ฝึกผ่านงานและโปรเจกต์ระหว่างเรียน เพื่อนำสิ่งที่เรียนมาใช้จริง</p>
            </div>
          </li>

          <li>
            <div class="accent-icon rounded-full" aria-hidden="true">02</div>
            <div>
              <h3 class="text-lg font-bold text-[var(--color-text)]">ได้เรียนรู้จากการฝึกงาน</h3>
              <p class="mt-1 text-base leading-7 text-[var(--color-muted)]">ในชั้นปีสุดท้าย ผู้เรียนสามารถเลือกออกฝึกงานเพื่อเรียนรู้การทำงานและเก็บเกี่ยวประสบการณ์จากสถานประกอบการ</p>
            </div>
          </li>

          <li>
            <div class="accent-icon rounded-full" aria-hidden="true">03</div>
            <div>
              <h3 class="text-lg font-bold text-[var(--color-text)]">ไม่มีพื้นฐานก็เริ่มได้</h3>
              <p class="mt-1 text-base leading-7 text-[var(--color-muted)]">ไม่จำเป็นต้องมีพื้นฐานการเขียนโปรแกรมมาก่อน หากสนใจคอมพิวเตอร์และพร้อมเรียนรู้ ก็สามารถเริ่มไปพร้อมกันได้</p>
            </div>
          </li>
        </ul>
    </div>
  </section>
</template>

<style scoped>
.about-section { border-bottom: 1px solid var(--color-border); }
.about-layout { display: grid; gap: 2.5rem; }
.about-principles li { display: flex; align-items: start; gap: 1rem; padding: 1.5rem 0; border-top: 1px solid var(--color-border); }
.about-principles .accent-icon { width: 2rem; height: 2rem; border: 0; background: transparent; justify-content: start; }
@media (min-width: 1024px) {
  .about-layout { grid-template-columns: 1fr 1fr; gap: 5rem; }
  .about-section { padding-block: 4rem; }
}
</style>
