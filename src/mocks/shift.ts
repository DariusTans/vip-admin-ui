export type ShiftType = 'morning' | 'afternoon' | 'night'
export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave' | 'holiday'
export type PunchStatus = 'on-time' | 'late' | 'early-leave' | 'overtime' | 'absent'

export interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  type: ShiftType
  breakMinutes: number
  color: string
}

export interface ShiftAssignment {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  shiftId: string
  shiftName: string
  shiftType: ShiftType
  date: string
  startTime: string
  endTime: string
}

export interface AttendanceRecord {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  date: string
  shiftName: string
  shiftType: ShiftType
  scheduledIn: string
  scheduledOut: string
  punchIn: string | null
  punchOut: string | null
  workMinutes: number | null
  lateMinutes: number
  overtimeMinutes: number
  status: AttendanceStatus
  punchStatus: PunchStatus
  note: string | null
}

export interface WeeklyHours {
  day: string
  date: string
  scheduled: number
  actual: number
  overtime: number
}

export const mockShifts: Shift[] = [
  { id: 's1', name: 'กะเช้า',   startTime: '06:00', endTime: '14:00', type: 'morning',   breakMinutes: 60, color: 'primary' },
  { id: 's2', name: 'กะบ่าย',   startTime: '14:00', endTime: '22:00', type: 'afternoon', breakMinutes: 60, color: 'warning' },
  { id: 's3', name: 'กะดึก',    startTime: '22:00', endTime: '06:00', type: 'night',     breakMinutes: 60, color: 'secondary' },
  { id: 's4', name: 'กะปกติ',   startTime: '08:00', endTime: '17:00', type: 'morning',   breakMinutes: 60, color: 'success' },
]

export const mockShiftAssignments: ShiftAssignment[] = [
  // Week of June 9-15, 2026 — สมชาย
  { id: 'sa1',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',  department: 'ฝ่ายรักษาความปลอดภัย', shiftId: 's1', shiftName: 'กะเช้า',  shiftType: 'morning',   date: '2026-06-09', startTime: '06:00', endTime: '14:00' },
  { id: 'sa2',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',  department: 'ฝ่ายรักษาความปลอดภัย', shiftId: 's1', shiftName: 'กะเช้า',  shiftType: 'morning',   date: '2026-06-10', startTime: '06:00', endTime: '14:00' },
  { id: 'sa3',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',  department: 'ฝ่ายรักษาความปลอดภัย', shiftId: 's1', shiftName: 'กะเช้า',  shiftType: 'morning',   date: '2026-06-11', startTime: '06:00', endTime: '14:00' },
  { id: 'sa4',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',  department: 'ฝ่ายรักษาความปลอดภัย', shiftId: 's1', shiftName: 'กะเช้า',  shiftType: 'morning',   date: '2026-06-12', startTime: '06:00', endTime: '14:00' },
  { id: 'sa5',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',  department: 'ฝ่ายรักษาความปลอดภัย', shiftId: 's1', shiftName: 'กะเช้า',  shiftType: 'morning',   date: '2026-06-13', startTime: '06:00', endTime: '14:00' },
  // วิรัตน์ — กะบ่าย
  { id: 'sa6',  employeeCode: 'EMP-002', employeeName: 'กัญญา แก้วใส',   department: 'ฝ่ายธุรการ',             shiftId: 's4', shiftName: 'กะปกติ', shiftType: 'morning',   date: '2026-06-09', startTime: '08:00', endTime: '17:00' },
  { id: 'sa7',  employeeCode: 'EMP-002', employeeName: 'กัญญา แก้วใส',   department: 'ฝ่ายธุรการ',             shiftId: 's4', shiftName: 'กะปกติ', shiftType: 'morning',   date: '2026-06-10', startTime: '08:00', endTime: '17:00' },
  { id: 'sa8',  employeeCode: 'EMP-002', employeeName: 'กัญญา แก้วใส',   department: 'ฝ่ายธุรการ',             shiftId: 's4', shiftName: 'กะปกติ', shiftType: 'morning',   date: '2026-06-11', startTime: '08:00', endTime: '17:00' },
  { id: 'sa9',  employeeCode: 'EMP-003', employeeName: 'วิชัย สุขสันต์', department: 'ฝ่ายรักษาความปลอดภัย', shiftId: 's2', shiftName: 'กะบ่าย', shiftType: 'afternoon', date: '2026-06-09', startTime: '14:00', endTime: '22:00' },
  { id: 'sa10', employeeCode: 'EMP-003', employeeName: 'วิชัย สุขสันต์', department: 'ฝ่ายรักษาความปลอดภัย', shiftId: 's2', shiftName: 'กะบ่าย', shiftType: 'afternoon', date: '2026-06-10', startTime: '14:00', endTime: '22:00' },
  { id: 'sa11', employeeCode: 'EMP-004', employeeName: 'อรุณี วงศ์ทอง',  department: 'ฝ่ายลาดตระเวน',          shiftId: 's3', shiftName: 'กะดึก',  shiftType: 'night',     date: '2026-06-09', startTime: '22:00', endTime: '06:00' },
  { id: 'sa12', employeeCode: 'EMP-004', employeeName: 'อรุณี วงศ์ทอง',  department: 'ฝ่ายลาดตระเวน',          shiftId: 's3', shiftName: 'กะดึก',  shiftType: 'night',     date: '2026-06-10', startTime: '22:00', endTime: '06:00' },
  { id: 'sa13', employeeCode: 'EMP-005', employeeName: 'ธนกร พิทักษ์',   department: 'ฝ่ายเทคนิค',             shiftId: 's4', shiftName: 'กะปกติ', shiftType: 'morning',   date: '2026-06-09', startTime: '08:00', endTime: '17:00' },
  { id: 'sa14', employeeCode: 'EMP-005', employeeName: 'ธนกร พิทักษ์',   department: 'ฝ่ายเทคนิค',             shiftId: 's4', shiftName: 'กะปกติ', shiftType: 'morning',   date: '2026-06-10', startTime: '08:00', endTime: '17:00' },
  { id: 'sa15', employeeCode: 'EMP-006', employeeName: 'นิภา ศรีทอง',    department: 'ฝ่ายควบคุม',             shiftId: 's1', shiftName: 'กะเช้า',  shiftType: 'morning',   date: '2026-06-09', startTime: '06:00', endTime: '14:00' },
  { id: 'sa16', employeeCode: 'EMP-007', employeeName: 'บุญมี ซื่อสัตย์',department: 'ฝ่ายรักษาความปลอดภัย', shiftId: 's2', shiftName: 'กะบ่าย', shiftType: 'afternoon', date: '2026-06-09', startTime: '14:00', endTime: '22:00' },
]

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',   department: 'ฝ่ายรักษาความปลอดภัย', date: '2026-06-15', shiftName: 'กะเช้า',  shiftType: 'morning',   scheduledIn: '06:00', scheduledOut: '14:00', punchIn: '05:58', punchOut: '14:02', workMinutes: 484, lateMinutes: 0, overtimeMinutes: 2,  status: 'present', punchStatus: 'on-time',     note: null },
  { id: 'a2',  employeeCode: 'EMP-002', employeeName: 'กัญญา แก้วใส',    department: 'ฝ่ายธุรการ',             date: '2026-06-15', shiftName: 'กะปกติ', shiftType: 'morning',   scheduledIn: '08:00', scheduledOut: '17:00', punchIn: '08:12', punchOut: '17:00', workMinutes: 528, lateMinutes: 12, overtimeMinutes: 0,  status: 'late',    punchStatus: 'late',        note: 'รถติด' },
  { id: 'a3',  employeeCode: 'EMP-003', employeeName: 'วิชัย สุขสันต์',  department: 'ฝ่ายรักษาความปลอดภัย', date: '2026-06-15', shiftName: 'กะบ่าย', shiftType: 'afternoon', scheduledIn: '14:00', scheduledOut: '22:00', punchIn: null,    punchOut: null,    workMinutes: null,lateMinutes: 0, overtimeMinutes: 0,  status: 'leave',   punchStatus: 'absent',      note: 'ลาป่วย' },
  { id: 'a4',  employeeCode: 'EMP-004', employeeName: 'อรุณี วงศ์ทอง',   department: 'ฝ่ายลาดตระเวน',          date: '2026-06-15', shiftName: 'กะดึก',  shiftType: 'night',     scheduledIn: '22:00', scheduledOut: '06:00', punchIn: '22:05', punchOut: '06:00', workMinutes: 475, lateMinutes: 5,  overtimeMinutes: 0,  status: 'present', punchStatus: 'on-time',     note: null },
  { id: 'a5',  employeeCode: 'EMP-005', employeeName: 'ธนกร พิทักษ์',    department: 'ฝ่ายเทคนิค',             date: '2026-06-15', shiftName: 'กะปกติ', shiftType: 'morning',   scheduledIn: '08:00', scheduledOut: '17:00', punchIn: '07:55', punchOut: '19:30', workMinutes: 695, lateMinutes: 0, overtimeMinutes: 150, status: 'present', punchStatus: 'overtime',    note: null },
  { id: 'a6',  employeeCode: 'EMP-006', employeeName: 'นิภา ศรีทอง',     department: 'ฝ่ายควบคุม',             date: '2026-06-15', shiftName: 'กะเช้า',  shiftType: 'morning',   scheduledIn: '06:00', scheduledOut: '14:00', punchIn: '06:01', punchOut: '13:30', workMinutes: 449, lateMinutes: 0, overtimeMinutes: 0,  status: 'present', punchStatus: 'early-leave', note: 'ธุระด่วน' },
  { id: 'a7',  employeeCode: 'EMP-007', employeeName: 'บุญมี ซื่อสัตย์', department: 'ฝ่ายรักษาความปลอดภัย', date: '2026-06-15', shiftName: 'กะบ่าย', shiftType: 'afternoon', scheduledIn: '14:00', scheduledOut: '22:00', punchIn: '14:00', punchOut: '22:00', workMinutes: 480, lateMinutes: 0, overtimeMinutes: 0,  status: 'present', punchStatus: 'on-time',     note: null },
  // June 14
  { id: 'a8',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',   department: 'ฝ่ายรักษาความปลอดภัย', date: '2026-06-14', shiftName: 'กะเช้า',  shiftType: 'morning',   scheduledIn: '06:00', scheduledOut: '14:00', punchIn: '06:00', punchOut: '14:00', workMinutes: 480, lateMinutes: 0, overtimeMinutes: 0,  status: 'present', punchStatus: 'on-time',     note: null },
  { id: 'a9',  employeeCode: 'EMP-002', employeeName: 'กัญญา แก้วใส',    department: 'ฝ่ายธุรการ',             date: '2026-06-14', shiftName: 'กะปกติ', shiftType: 'morning',   scheduledIn: '08:00', scheduledOut: '17:00', punchIn: '07:58', punchOut: '17:00', workMinutes: 542, lateMinutes: 0, overtimeMinutes: 0,  status: 'present', punchStatus: 'on-time',     note: null },
  { id: 'a10', employeeCode: 'EMP-005', employeeName: 'ธนกร พิทักษ์',    department: 'ฝ่ายเทคนิค',             date: '2026-06-14', shiftName: 'กะปกติ', shiftType: 'morning',   scheduledIn: '08:00', scheduledOut: '17:00', punchIn: null,    punchOut: null,    workMinutes: null,lateMinutes: 0, overtimeMinutes: 0,  status: 'absent',  punchStatus: 'absent',      note: 'ขาดงาน' },
]

export const mockWeeklyHours: WeeklyHours[] = [
  { day: 'จ',  date: '09/06', scheduled: 48, actual: 46, overtime: 0 },
  { day: 'อ',  date: '10/06', scheduled: 48, actual: 48, overtime: 2 },
  { day: 'พ',  date: '11/06', scheduled: 48, actual: 47, overtime: 1 },
  { day: 'พฤ', date: '12/06', scheduled: 48, actual: 45, overtime: 0 },
  { day: 'ศ',  date: '13/06', scheduled: 48, actual: 50, overtime: 4 },
  { day: 'ส',  date: '14/06', scheduled: 24, actual: 22, overtime: 0 },
  { day: 'อา', date: '15/06', scheduled: 24, actual: 23, overtime: 3 },
]

export const mockShiftStats = {
  totalEmployees: 55,
  presentToday: 42,
  lateToday: 5,
  absentToday: 3,
  onLeaveToday: 5,
  overtimeThisWeek: 18,
  missedPunchToday: 2,
  shiftsToday: { morning: 20, afternoon: 18, night: 17 },
}
