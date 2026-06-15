export interface Visitor {
  id: string
  name: string
  company: string
  purpose: string
  host: string
  checkIn: string
  checkOut: string | null
  status: 'checked-in' | 'checked-out' | 'pending'
  floor: string
}

export const mockVisitors: Visitor[] = [
  { id: '1', name: 'สมชาย ใจดี', company: 'ABC Co., Ltd.', purpose: 'ประชุมงาน', host: 'นายวิชัย สุขสันต์', checkIn: '2026-06-15T09:00:00', checkOut: null, status: 'checked-in', floor: 'ชั้น 3' },
  { id: '2', name: 'สมหญิง รักงาน', company: 'XYZ Corp.', purpose: 'ส่งเอกสาร', host: 'นางสาวมาลี ดีใจ', checkIn: '2026-06-15T08:30:00', checkOut: '2026-06-15T09:15:00', status: 'checked-out', floor: 'ชั้น 1' },
  { id: '3', name: 'John Smith', company: 'Global Ltd.', purpose: 'Site Visit', host: 'Mr. David Lee', checkIn: '2026-06-15T10:00:00', checkOut: null, status: 'pending', floor: 'ชั้น 5' },
  { id: '4', name: 'อรุณี วงศ์ทอง', company: 'ไทยนวัตกรรม จำกัด', purpose: 'นำเสนอผลิตภัณฑ์', host: 'นายประสิทธิ์ มั่นคง', checkIn: '2026-06-15T10:30:00', checkOut: null, status: 'checked-in', floor: 'ชั้น 2' },
  { id: '5', name: 'พิชัย ศรีสุข', company: 'TechStart Co.', purpose: 'สัมภาษณ์งาน', host: 'นางสาวกัญญา แก้วใส', checkIn: '2026-06-15T11:00:00', checkOut: null, status: 'checked-in', floor: 'ชั้น 4' },
  { id: '6', name: 'Kenji Tanaka', company: 'Nippon Industries', purpose: 'Business Meeting', host: 'Mr. Somchai Jaidee', checkIn: '2026-06-15T07:45:00', checkOut: '2026-06-15T08:50:00', status: 'checked-out', floor: 'ชั้น 6' },
  { id: '7', name: 'วรรณา เพชรรัตน์', company: 'บ.สวัสดิการ จำกัด', purpose: 'ตรวจสอบบัญชี', host: 'นายอานนท์ ใหม่สด', checkIn: '2026-06-15T09:15:00', checkOut: '2026-06-15T11:30:00', status: 'checked-out', floor: 'ชั้น 7' },
  { id: '8', name: 'กิตติ นาคสุวรรณ', company: 'Blue Ocean Co.', purpose: 'ส่งพัสดุ', host: '-', checkIn: '2026-06-15T12:00:00', checkOut: null, status: 'pending', floor: 'ชั้น 1' },
]

export const mockStats = {
  totalToday: 24,
  checkedIn: 8,
  checkedOut: 14,
  pending: 2,
  totalThisWeek: 112,
  totalThisMonth: 438,
  peakHour: '10:00 - 11:00',
}

export const mockHourlyData = [
  { hour: '07:00', count: 2 },
  { hour: '08:00', count: 5 },
  { hour: '09:00', count: 8 },
  { hour: '10:00', count: 12 },
  { hour: '11:00', count: 9 },
  { hour: '12:00', count: 4 },
  { hour: '13:00', count: 6 },
  { hour: '14:00', count: 7 },
  { hour: '15:00', count: 5 },
  { hour: '16:00', count: 3 },
  { hour: '17:00', count: 1 },
]
