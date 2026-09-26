export interface NewsItem {
  id: string
  category: string
  date: string
  title: string
  summary: string
  visual: string
}

// Fictional examples only. Keep content separate from its homepage/archive presentation.
export const newsItems: NewsItem[] = [
  {
    id: 'project-showcase',
    category: 'ผลงานและกิจกรรม',
    date: '2026-09-18',
    title: 'จากไอเดียสู่ผลงาน: พื้นที่แลกเปลี่ยนโปรเจกต์ของผู้เรียน',
    summary: 'ตัวอย่างกิจกรรมที่เปิดโอกาสให้ผู้เรียนนำเสนอแนวคิด ทดลองใช้งานผลงาน และแลกเปลี่ยนสิ่งที่ได้เรียนรู้ร่วมกัน',
    visual: 'Build / Share',
  },
  {
    id: 'web-workshop',
    category: 'การเรียนรู้',
    date: '2026-09-10',
    title: 'ลองเขียนเว็บหน้าแรก เริ่มต้นจากสิ่งใกล้ตัว',
    summary: 'ตัวอย่างเวิร์กช็อปฝึกออกแบบและเขียนเว็บไซต์จากหัวข้อที่สนใจ พร้อมฝึกแก้ปัญหาไปทีละขั้น',
    visual: '< Learn />',
  },
  {
    id: 'internship-stories',
    category: 'ประสบการณ์ฝึกงาน',
    date: '2026-09-03',
    title: 'เรื่องเล่าจากการฝึกงาน เตรียมตัวก่อนก้าวสู่สถานประกอบการ',
    summary: 'ตัวอย่างวงพูดคุยแบ่งปันประสบการณ์การทำงานเป็นทีม ทักษะที่ได้ใช้ และสิ่งที่อยากบอกเพื่อนรุ่นน้อง',
    visual: 'Beyond / Class',
  },
  {
    id: 'welcome',
    category: 'กิจกรรมแผนก',
    date: '2026-08-21',
    title: 'รู้จักเพื่อน รู้จักแผนก เริ่มต้นการเรียนรู้ไปด้วยกัน',
    summary: 'ตัวอย่างกิจกรรมพบปะผู้เรียนและทำความรู้จักพื้นที่การเรียนรู้ของแผนกคอมพิวเตอร์โปรแกรมเมอร์',
    visual: 'Hello / World',
  },
]

export const formatNewsDate = (date: string) => new Intl.DateTimeFormat('th-TH', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${date}T00:00:00Z`))
