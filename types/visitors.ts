export interface VisitorDay {
  date: string
  visitors: number
}

export interface VisitorStatistics {
  totalVisitors: number
  todayVisitors: number
  asOf: string
  recentDays: VisitorDay[]
}
