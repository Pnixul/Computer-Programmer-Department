export interface InternshipStory {
  id: string
  workplace: string
  role: string
  description?: string
  areas?: string[]
}

export interface InternshipGroup {
  id: string
  level: 'ปวช.' | 'ปวส.'
  duration: string
  entries: InternshipStory[]
}

export const internshipGroups: InternshipGroup[] = [
  {
    id: 'vocational-certificate',
    level: 'ปวช.',
    duration: 'ประมาณ 1 ภาคเรียน',
    entries: [
      {
        id: 'botnoi',
        workplace: 'Botnoi',
        role: 'Frontend Developer Intern',
        areas: ['Frontend Development', 'UX/UI', 'Angular', 'TypeScript'],
      },
    ],
  },
  {
    id: 'higher-vocational-certificate',
    level: 'ปวส.',
    duration: 'ประมาณ 1 ปีการศึกษา',
    entries: [
      {
        id: 'higher-vocational-placeholder-1',
        workplace: 'สถานที่ฝึกงาน',
        role: 'บทบาท / ลักษณะงาน',
        description: 'รอข้อมูลประสบการณ์จริง',
        areas: ['ทักษะและประสบการณ์'],
      },
      {
        id: 'higher-vocational-placeholder-2',
        workplace: 'สถานที่ฝึกงาน',
        role: 'บทบาท / ลักษณะงาน',
        description: 'รอข้อมูลประสบการณ์จริง',
        areas: ['ทักษะและประสบการณ์'],
      },
    ],
  },
]
