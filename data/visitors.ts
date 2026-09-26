import type { VisitorStatistics } from '~/types/visitors'

// A fixed sample, not a live counter. The last day matches todayVisitors.
export const visitorStatistics: VisitorStatistics = {
  totalVisitors: 12480,
  todayVisitors: 86,
  asOf: '2026-09-26',
  recentDays: [
    { date: '2026-09-20', visitors: 52 },
    { date: '2026-09-21', visitors: 74 },
    { date: '2026-09-22', visitors: 68 },
    { date: '2026-09-23', visitors: 91 },
    { date: '2026-09-24', visitors: 79 },
    { date: '2026-09-25', visitors: 103 },
    { date: '2026-09-26', visitors: 86 },
  ],
}
