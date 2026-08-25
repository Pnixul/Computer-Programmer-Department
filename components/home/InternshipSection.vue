<script setup lang="ts">
import { internshipGroups } from '~/data/internships'
</script>

<template>
  <section id="internship" class="site-section">
    <div class="site-container">
      <!-- Section Header -->
      <header class="section-header">
        <p class="eyebrow">ฝึกประสบการณ์วิชาชีพ</p>
        <h2 class="section-title">
          <span class="block">ปฏิบัติงานจริง</span>
          <span class="block md:whitespace-nowrap">เรียนรู้จาก<wbr><span class="whitespace-nowrap">สถานประกอบการ</span></span>
        </h2>
        <p class="body-copy mt-5 max-w-3xl">
          นักศึกษาในแผนกคอมพิวเตอร์โปรแกรมเมอร์ได้ฝึกประสบการณ์จากการทำงานจริงในสถานประกอบการต่างๆ เพื่อเรียนรู้ทั้งทักษะวิชาชีพและวัฒนาความเข้าใจของการทำงานในโลกแห่งความเป็นจริง
        </p>
      </header>

      <!-- Internship Pathway Overview: Visual Comparison -->
      <div class="mt-12 md:mt-14 lg:mt-16">
        <div class="grid gap-10 md:grid-cols-2">
          <!-- ปวช. Internship Structure -->
          <article class="border-t border-[var(--color-blue-border)] pt-5">
            <span class="mb-4 block h-0.5 w-8 bg-[var(--color-yellow)]" aria-hidden="true"></span>
            <p class="text-xs font-bold uppercase tracking-widest text-[var(--color-navy)]">
              วุฒิปวช.
            </p>
            <p class="mt-2 text-xl font-bold text-[var(--color-navy)] md:text-2xl">
              ประมาณ 1 ภาคเรียน
            </p>
            <p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              ได้ลงมือทำและเรียนรู้จากการทำงานจริงในสถานประกอบการ ฝึกทักษะวิชาชีพและเข้าใจการทำงานในวัฒนธรรมองค์กร
            </p>
          </article>

          <!-- ปวส. Internship Structure -->
          <article class="border-t border-[var(--color-blue-border)] pt-5">
            <span class="mb-4 block h-0.5 w-8 bg-[var(--color-yellow)]" aria-hidden="true"></span>
            <p class="text-xs font-bold uppercase tracking-widest text-[var(--color-navy)]">
              วุฒิปวส.
            </p>
            <p class="mt-2 text-xl font-bold text-[var(--color-navy)] md:text-2xl">
              ประมาณ 1 ปีการศึกษา
            </p>
            <p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              บูรณาการกับโปรเจกต์และความรับผิดชอบในองค์กร เกาะติดกับการพัฒนาจริงและการเป็นส่วนหนึ่งของทีม
            </p>
          </article>
        </div>

        <!-- Disclaimer Note -->
        <p class="mt-6 text-xs text-[var(--color-muted)]">
          * การฝึกประสบการณ์ไม่ใช่การเชื่อมต่อบังคับ—แต่ละนักศึกษามีประสบการณ์และหลักสูตรที่แตกต่างกัน
        </p>
      </div>

      <!-- Internship Experience Directory -->
      <div class="internship-directory">
        <div class="internship-directory__intro">
          <h3>ประสบการณ์ฝึกงานในสถานที่และบทบาทที่แตกต่างกัน</h3>
          <p>
            นักศึกษาได้เรียนรู้จากสถานที่ฝึกงาน บทบาท และสภาพแวดล้อมการทำงานที่แตกต่างกัน
          </p>
        </div>

        <section
          v-for="group in internshipGroups"
          :key="group.id"
          class="internship-group"
          :aria-labelledby="`${group.id}-title`"
        >
          <header class="internship-group__header">
            <h4 :id="`${group.id}-title`">{{ group.level }}</h4>
            <p>{{ group.duration }}</p>
          </header>

          <ul class="internship-list">
            <li v-for="(entry, entryIndex) in group.entries" :key="entry.id" class="internship-list__item">
              <article class="internship-entry">
                <span class="internship-entry__index" aria-hidden="true">
                  {{ String(entryIndex + 1).padStart(2, '0') }}
                </span>

                <div class="internship-entry__workplace">
                  <p class="internship-entry__label">สถานที่ฝึกงาน</p>
                  <h5>{{ entry.workplace }}</h5>
                </div>

                <div class="internship-entry__details">
                  <p class="internship-entry__label">บทบาท / ลักษณะงาน</p>
                  <p class="internship-entry__role">{{ entry.role }}</p>

                  <p v-if="entry.description" class="internship-entry__description">
                    {{ entry.description }}
                  </p>

                  <div v-if="entry.areas?.length" class="internship-entry__areas">
                    <p class="internship-entry__label">ทักษะและประสบการณ์</p>
                    <ul :aria-label="`ทักษะและประสบการณ์จาก ${entry.workplace}`" class="internship-entry__area-list">
                      <li v-for="area in entry.areas" :key="area">{{ area }}</li>
                    </ul>
                  </div>
                </div>
              </article>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.internship-directory {
  margin-top: clamp(4rem, 8vw, 6rem);
}

.internship-directory__intro {
  display: grid;
  gap: 1.25rem;
  border-top: 1px solid var(--color-text);
  padding: 1.5rem 0 3.5rem;
}

.internship-directory__intro h3 {
  max-width: 22ch;
  color: var(--color-text);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.internship-directory__intro p {
  max-width: 38rem;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.internship-group {
  display: grid;
  gap: 2rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.internship-group + .internship-group {
  margin-top: 4.5rem;
}

.internship-group__header {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  justify-content: space-between;
}

.internship-group__header h4 {
  color: var(--color-navy);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1;
}

.internship-group__header p {
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
}

.internship-list {
  min-width: 0;
  border-top: 1px solid var(--color-navy);
}

.internship-list__item {
  border-bottom: 1px solid var(--color-border);
}

.internship-entry {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(1rem, 3vw, 2.5rem);
  align-items: start;
  padding: 2rem 0;
}

.internship-entry__index {
  padding-top: 0.3rem;
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.5;
}

.internship-entry__workplace,
.internship-entry__details {
  min-width: 0;
}

.internship-entry__label {
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.5;
}

.internship-entry__workplace h5 {
  margin-top: 0.5rem;
  overflow-wrap: anywhere;
  color: var(--color-navy);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.internship-entry__role {
  margin-top: 0.5rem;
  overflow-wrap: anywhere;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
}

.internship-entry__description {
  max-width: 65ch;
  margin-top: 0.875rem;
  overflow-wrap: anywhere;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.internship-entry__areas {
  margin-top: 1.25rem;
}

.internship-entry__area-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  color: var(--color-navy);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.6;
}

.internship-entry__area-list li {
  overflow-wrap: anywhere;
}

.internship-entry__area-list li:not(:last-child)::after {
  margin: 0 0.65rem;
  color: var(--color-blue-border);
  content: '/';
}

@media (min-width: 768px) {
  .internship-directory__intro {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.85fr);
    gap: clamp(2rem, 6vw, 6rem);
    padding: 1.75rem 0 4.5rem;
  }

  .internship-directory__intro p {
    justify-self: end;
  }
}

@media (min-width: 1024px) {
  .internship-group {
    grid-template-columns: minmax(11rem, 0.42fr) minmax(0, 1.58fr);
    gap: clamp(2.5rem, 6vw, 6rem);
  }

  .internship-group__header {
    display: block;
  }

  .internship-group__header p {
    margin-top: 0.75rem;
  }
}

@media (max-width: 767px) {
  .internship-group + .internship-group {
    margin-top: 3.5rem;
  }

  .internship-entry {
    grid-template-columns: 2.25rem minmax(0, 1fr);
    gap: 1.5rem 0.75rem;
    padding: 1.75rem 0;
  }

  .internship-entry__index {
    grid-row: 1 / span 2;
  }

  .internship-entry__workplace,
  .internship-entry__details {
    grid-column: 2;
  }
}
</style>
