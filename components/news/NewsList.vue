<script setup lang="ts">
import { formatNewsDate, type NewsItem } from '~/data/news'

defineProps<{ items: NewsItem[] }>()
</script>

<template>
  <ol class="news-list">
    <li v-for="(item, index) in items" :key="item.id">
      <article :id="item.id" class="news-entry" :aria-labelledby="`${item.id}-title`">
        <div class="news-visual" aria-hidden="true">
          <span class="news-visual-index">{{ String(index + 1).padStart(2, '0') }} / CP</span>
          <span>{{ item.visual }}</span>
          <span class="news-visual-caption">Learn / Build / Create</span>
        </div>
        <div class="news-copy">
          <div class="news-meta"><span>{{ item.category }}</span><time :datetime="item.date">{{ formatNewsDate(item.date) }}</time></div>
          <h3 :id="`${item.id}-title`">{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </div>
      </article>
    </li>
  </ol>
</template>

<style scoped>
.news-list { display: grid; gap: 1.75rem; }
.news-entry { display: grid; gap: 1rem; border-top: 1px solid var(--color-blue-border); padding-top: 1.25rem; }
.news-visual { position: relative; display: flex; min-width: 0; aspect-ratio: 16 / 9; align-items: center; justify-content: center; overflow: hidden; padding: 2rem; background: var(--color-navy); color: white; font-size: clamp(1.25rem, 3vw, 2rem); font-weight: 700; }
.news-visual::after { content: ''; position: absolute; right: 0; bottom: 0; width: 25%; height: 4px; background: var(--color-yellow); }
.news-visual-index, .news-visual-caption { position: absolute; left: 1rem; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.12em; }
.news-visual-index { top: 1rem; color: var(--color-yellow); }
.news-visual-caption { bottom: 1rem; color: #ffffffb3; }
.news-meta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5rem 1rem; color: var(--color-navy); font-size: 0.875rem; font-weight: 600; }
.news-meta time { color: var(--color-muted); font-weight: 400; }
.news-copy h3 { margin-top: 0.75rem; font-size: 1.125rem; font-weight: 700; line-height: 1.6; }
.news-copy p { margin-top: 0.5rem; color: var(--color-muted); font-size: 1rem; line-height: 1.85; }
@media (min-width: 768px) {
  .news-list { grid-template-columns: 1fr 1fr; gap: 1.75rem 2.5rem; }
  .news-list > li:first-child { grid-row: span 2; }
  .news-list > li:not(:first-child) .news-visual { display: none; }
  .news-list > li:first-child h3 { font-size: 1.5rem; }
}
@media (max-width: 767px) {
  .news-list > li:not(:first-child) .news-entry { grid-template-columns: 4.5rem 1fr; }
  .news-list > li:not(:first-child) .news-visual { aspect-ratio: 1; padding: 0; }
  .news-list > li:not(:first-child) .news-visual > span:not(.news-visual-index) { display: none; }
  .news-list > li:not(:first-child) .news-visual-index { position: static; font-size: 0.65rem; }
}
</style>
