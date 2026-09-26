import { visitorStatistics } from '~/data/visitors'
import type { VisitorStatistics } from '~/types/visitors'

export const useVisitorStatistics = () => useAsyncData<VisitorStatistics | null>(
  'visitor-statistics',
  // Replace this reader with GET /api/visitors when the backend is ready.
  async () => ({
    ...visitorStatistics,
    recentDays: visitorStatistics.recentDays.map(day => ({ ...day })),
  }),
)
