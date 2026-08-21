<script setup lang="ts">
import { featuredProject, otherProjects } from '~/data/projects'
</script>

<template>
  <section id="projects" class="site-section site-section-alt">
    <div class="site-container">
      <header class="section-header">
        <p class="eyebrow">Section Label Placeholder</p>
        <h2 class="section-title">
          Student Showcase Heading Placeholder
        </h2>
        <p class="body-copy mt-5 max-w-3xl">
          Short paragraph placeholder for introducing outstanding student projects and the kinds of work students can build.
        </p>
      </header>

      <article class="featured-project">
        <div class="featured-project__visual" aria-label="Featured project image placeholder" role="img">
          <span class="featured-project__visual-index" aria-hidden="true">{{ featuredProject.number }}</span>
          <p>Featured Project Image Placeholder</p>
          <span class="featured-project__visual-mark" aria-hidden="true"></span>
        </div>

        <div class="featured-project__content">
          <p class="project-kicker">
            {{ featuredProject.number }} <span aria-hidden="true">/</span> FEATURED PROJECT
          </p>
          <h3 class="featured-project__title">
            {{ featuredProject.title }}
          </h3>
          <p class="body-copy featured-project__description">
            {{ featuredProject.description }}
          </p>

          <ul class="featured-project__tags" aria-label="Project technologies">
            <li v-for="(technology, index) in featuredProject.technologies" :key="index" class="tag-pill">
              {{ technology }}
            </li>
          </ul>

          <a href="#" class="project-text-link" aria-label="View featured project">
            <span>View project</span>
            <span class="project-text-link__arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </article>

      <div class="project-index">
        <div class="project-index__heading">
          <p>Other Projects</p>
          <p>{{ String(otherProjects.length).padStart(2, '0') }} Selected Works</p>
        </div>

        <ol class="project-list">
          <li v-for="project in otherProjects" :key="project.number" class="project-list__item">
            <a href="#" class="project-row" :aria-label="`View ${project.title}`">
              <span class="project-row__number">{{ project.number }}</span>
              <span class="project-row__details">
                <span class="project-row__title">{{ project.title }}</span>
                <span class="project-row__meta">{{ project.meta }}</span>
              </span>
              <span class="project-row__arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        </ol>
      </div>

      <div class="project-footer-link">
        <a href="#" class="view-all-projects">
          <span>ดูผลงานทั้งหมด</span>
          <span class="view-all-projects__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-project {
  display: grid;
  gap: clamp(2rem, 5vw, 5.5rem);
  align-items: center;
}

.featured-project__visual {
  position: relative;
  display: flex;
  aspect-ratio: 16 / 10;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.75), transparent 52%),
    var(--color-blue-soft);
  color: var(--color-muted);
  isolation: isolate;
}

.featured-project__visual::before {
  position: absolute;
  inset: clamp(1rem, 3vw, 2rem);
  z-index: -1;
  border: 1px solid var(--color-blue-border);
  content: '';
}

.featured-project__visual::after {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(5rem, 16vw, 10rem);
  height: clamp(5rem, 16vw, 10rem);
  background: var(--color-yellow);
  clip-path: polygon(100% 0, 100% 100%, 0 0);
  content: '';
  opacity: 0.92;
}

.featured-project__visual p {
  max-width: 16rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.6;
}

.featured-project__visual-index {
  position: absolute;
  bottom: clamp(1.25rem, 3vw, 2.5rem);
  left: clamp(1.25rem, 3vw, 2.5rem);
  color: var(--color-navy);
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: 800;
  line-height: 0.8;
  opacity: 0.09;
}

.featured-project__visual-mark {
  position: absolute;
  right: clamp(1.25rem, 3vw, 2.5rem);
  bottom: clamp(1.25rem, 3vw, 2.5rem);
  width: clamp(2rem, 4vw, 3.5rem);
  height: 0.25rem;
  background: var(--color-navy);
}

.featured-project__content {
  max-width: 34rem;
}

.project-kicker {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  color: var(--color-navy);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.project-kicker span {
  color: var(--color-yellow);
}

.featured-project__title {
  margin-top: 1.25rem;
  color: var(--color-text);
  font-size: clamp(2rem, 4vw, 3.75rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.08;
}

.featured-project__description {
  margin-top: 1.5rem;
}

.featured-project__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-top: 1.75rem;
}

.project-text-link {
  display: inline-flex;
  gap: 0.8rem;
  align-items: center;
  margin-top: 2.25rem;
  border-bottom: 1px solid var(--color-navy);
  padding-bottom: 0.35rem;
  color: var(--color-navy);
  font-size: 0.9375rem;
  font-weight: 800;
}

.project-text-link:focus-visible,
.project-row:focus-visible,
.view-all-projects:focus-visible {
  border-radius: 0.25rem;
  outline: 4px solid var(--color-focus);
  outline-offset: 4px;
}

.project-text-link__arrow,
.project-row__arrow,
.view-all-projects__arrow {
  transition: transform 180ms ease-out;
}

.project-index {
  margin-top: clamp(4.5rem, 9vw, 8rem);
}

.project-index__heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--color-text);
  padding-bottom: 1rem;
  color: var(--color-navy);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.project-index__heading p:last-child {
  color: var(--color-muted);
  font-weight: 600;
}

.project-list__item {
  border-bottom: 1px solid var(--color-border);
}

.project-row {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  min-height: 8.75rem;
  color: var(--color-text);
}

.project-row__number {
  align-self: start;
  padding-top: 0.55rem;
  color: var(--color-muted);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.project-row__details {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(12rem, 0.75fr);
  gap: 2rem;
  align-items: center;
}

.project-row__title {
  font-size: clamp(1.4rem, 2.5vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
  transition: transform 180ms ease-out, color 180ms ease-out;
}

.project-row__meta {
  color: var(--color-muted);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
}

.project-row__arrow {
  color: var(--color-navy);
  font-size: 1.5rem;
}

.project-footer-link {
  display: flex;
  justify-content: flex-end;
  margin-top: clamp(2.5rem, 5vw, 4rem);
}

.view-all-projects {
  display: inline-flex;
  gap: 1rem;
  align-items: center;
  border-bottom: 2px solid var(--color-yellow);
  padding: 0.5rem 0 0.65rem;
  color: var(--color-navy);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 800;
}

@media (min-width: 768px) {
  .featured-project {
    grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.8fr);
  }
}

@media (hover: hover) and (pointer: fine) {
  .project-text-link:hover .project-text-link__arrow,
  .view-all-projects:hover .view-all-projects__arrow {
    transform: translateX(0.25rem);
  }

  .project-row:hover .project-row__title {
    color: var(--color-blue);
    transform: translateX(0.4rem);
  }

  .project-row:hover .project-row__arrow {
    transform: translate(0.2rem, -0.2rem);
  }
}

@media (max-width: 767px) {
  .featured-project__content {
    max-width: none;
  }

  .project-index__heading p:last-child {
    display: none;
  }

  .project-row {
    grid-template-columns: 2.75rem minmax(0, 1fr) auto;
    gap: 0.75rem;
    min-height: 0;
    padding: 1.75rem 0;
  }

  .project-row__details {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    align-items: flex-start;
  }

  .project-row__number {
    padding-top: 0.3rem;
  }

  .project-row__meta {
    font-size: 0.8125rem;
  }

  .project-footer-link {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-text-link__arrow,
  .project-row__arrow,
  .view-all-projects__arrow,
  .project-row__title {
    transition: none;
  }
}
</style>
