<template>
  <main id="home" class="site-section overflow-hidden">
    <div class="site-container">
      <div class="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <section class="max-w-3xl">
          <div class="eyebrow">
            Badge Placeholder
          </div>

          <h1 class="max-w-[760px] text-4xl font-extrabold leading-tight text-[var(--color-text)] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            Main Heading Placeholder
          </h1>

          <p class="body-copy mt-6 max-w-[660px] sm:mt-7 lg:mt-8">
            Paragraph placeholder for the department introduction, student opportunities, and learning focus.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <a href="#curriculum" class="btn-primary">
              Primary Button
            </a>
            <a href="#about" class="btn-secondary">
              Secondary Button
            </a>
          </div>
        </section>

        <section class="flex justify-center md:justify-end" aria-label="Department visual placeholder">
          <div class="surface-card w-full max-w-[540px] p-4 sm:p-5 lg:max-w-[560px]">
            <div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]">
              <div class="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
                <span class="h-2.5 w-2.5 rounded-full bg-[var(--color-yellow)]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-[var(--color-blue-border)]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-[var(--color-navy)]"></span>
              </div>
              <div class="grid aspect-[5/4] place-items-center p-5 sm:p-7">
                <div class="w-full space-y-4 rounded-2xl border border-[var(--color-blue-border)] bg-white p-5 shadow-[0_12px_28px_rgba(23,32,51,0.06)]">
                  <div class="h-3 w-2/3 rounded-full bg-[var(--color-navy)]"></div>
                  <div class="h-3 w-5/6 rounded-full bg-[var(--color-blue-soft)]"></div>
                  <div class="h-3 w-1/2 rounded-full bg-[var(--color-blue-soft)]"></div>
                  <div class="mt-6 grid grid-cols-3 gap-3">
                    <div class="h-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]"></div>
                    <div class="h-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]"></div>
                    <div class="h-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]"></div>
                  </div>
                  <p class="pt-2 text-center text-sm font-bold text-[var(--color-muted)]">
                    Illustration Placeholder
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
