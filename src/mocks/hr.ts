export type EmployeeStatus = 'active' | 'on-leave' | 'terminated'
export type EmployeeGender = 'male' | 'female'
export type ContractType = 'permanent' | 'contract' | 'probation'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'
export type LeaveType = 'annual' | 'sick' | 'personal' | 'maternity' | 'ordination'

export interface Department {
  id: string
  name: string
  headName: string
  employeeCount: number
}

export interface Employee {
  id: string
  code: string
  name: string
  position: string
  department: string
  gender: EmployeeGender
  status: EmployeeStatus
  contractType: ContractType
  startDate: string
  phone: string
  email: string
  annualLeaveRemaining: number
  annualLeaveTotal: number
}

export interface LeaveRequest {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
  requestedAt: string
  approvedBy: string | null
}

export interface HrEvent {
  id: string
  type: 'new-hire' | 'resign' | 'promote' | 'transfer' | 'contract-end'
  employeeName: string
  detail: string
  date: string
}

export const mockDepartments: Department[] = [
  { id: 'd1', name: 'ฝ่ายรักษาความปลอดภัย', headName: 'สมศักดิ์ แข็งแกร่ง', employeeCount: 24 },
  { id: 'd2', name: 'ฝ่ายลาดตระเวน',         headName: 'วิรัตน์ มั่นคง',     employeeCount: 12 },
  { id: 'd3', name: 'ฝ่ายธุรการ',             headName: 'มาลี ดีใจ',           employeeCount: 8  },
  { id: 'd4', name: 'ฝ่ายควบคุม',             headName: 'ประสิทธิ์ มั่นคง',    employeeCount: 6  },
  { id: 'd5', name: 'ฝ่ายเทคนิค',             headName: 'อานนท์ ใหม่สด',       employeeCount: 5  },
]

export const mockEmployees: Employee[] = [
  { id: 'e1', code: 'EMP-001', name: 'สมชาย รักษาดี',    position: 'หัวหน้าเจ้าหน้าที่', department: 'ฝ่ายรักษาความปลอดภัย', gender: 'male',   status: 'active',     contractType: 'permanent',  startDate: '2020-03-01', phone: '081-001-0001', email: 'somchai@vip.com',   annualLeaveRemaining: 8,  annualLeaveTotal: 10 },
  { id: 'e2', code: 'EMP-002', name: 'กัญญา แก้วใส',      position: 'เจ้าหน้าที่ธุรการ', department: 'ฝ่ายธุรการ',             gender: 'female', status: 'active',     contractType: 'permanent',  startDate: '2021-06-15', phone: '081-002-0002', email: 'kanya@vip.com',     annualLeaveRemaining: 10, annualLeaveTotal: 10 },
  { id: 'e3', code: 'EMP-003', name: 'วิชัย สุขสันต์',    position: 'เจ้าหน้าที่รักษา', department: 'ฝ่ายรักษาความปลอดภัย', gender: 'male',   status: 'on-leave',   contractType: 'permanent',  startDate: '2019-01-10', phone: '081-003-0003', email: 'wichai@vip.com',    annualLeaveRemaining: 3,  annualLeaveTotal: 10 },
  { id: 'e4', code: 'EMP-004', name: 'อรุณี วงศ์ทอง',    position: 'เจ้าหน้าที่ลาดตระเวน', department: 'ฝ่ายลาดตระเวน',      gender: 'female', status: 'active',     contractType: 'contract',   startDate: '2023-02-01', phone: '081-004-0004', email: 'arunee@vip.com',    annualLeaveRemaining: 6,  annualLeaveTotal: 7  },
  { id: 'e5', code: 'EMP-005', name: 'ธนกร พิทักษ์',      position: 'ช่างเทคนิค',          department: 'ฝ่ายเทคนิค',            gender: 'male',   status: 'active',     contractType: 'permanent',  startDate: '2022-09-01', phone: '081-005-0005', email: 'thanakorn@vip.com', annualLeaveRemaining: 5,  annualLeaveTotal: 10 },
  { id: 'e6', code: 'EMP-006', name: 'นิภา ศรีทอง',       position: 'เจ้าหน้าที่ควบคุม',  department: 'ฝ่ายควบคุม',            gender: 'female', status: 'active',     contractType: 'probation',  startDate: '2026-04-01', phone: '081-006-0006', email: 'nipa@vip.com',      annualLeaveRemaining: 0,  annualLeaveTotal: 3  },
  { id: 'e7', code: 'EMP-007', name: 'บุญมี ซื่อสัตย์',   position: 'เจ้าหน้าที่รักษา', department: 'ฝ่ายรักษาความปลอดภัย', gender: 'male',   status: 'active',     contractType: 'contract',   startDate: '2024-01-15', phone: '081-007-0007', email: 'boonmee@vip.com',   annualLeaveRemaining: 4,  annualLeaveTotal: 7  },
  { id: 'e8', code: 'EMP-008', name: 'สุดา มีสุข',         position: 'เจ้าหน้าที่ธุรการ', department: 'ฝ่ายธุรการ',             gender: 'female', status: 'terminated', contractType: 'contract',   startDate: '2022-05-01', phone: '081-008-0008', email: 'suda@vip.com',      annualLeaveRemaining: 0,  annualLeaveTotal: 7  },
]

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'l1', employeeCode: 'EMP-003', employeeName: 'วิชัย สุขสันต์',  department: 'ฝ่ายรักษาความปลอดภัย', leaveType: 'sick',     startDate: '2026-06-13', endDate: '2026-06-17', days: 3, reason: 'ป่วยไข้หวัด',       status: 'approved', requestedAt: '2026-06-12T08:00:00', approvedBy: 'สมชาย รักษาดี' },
  { id: 'l2', employeeCode: 'EMP-004', employeeName: 'อรุณี วงศ์ทอง',   department: 'ฝ่ายลาดตระเวน',       leaveType: 'annual',   startDate: '2026-06-20', endDate: '2026-06-21', days: 2, reason: 'ธุระส่วนตัว',       status: 'pending',  requestedAt: '2026-06-14T09:30:00', approvedBy: null },
  { id: 'l3', employeeCode: 'EMP-007', employeeName: 'บุญมี ซื่อสัตย์', department: 'ฝ่ายรักษาความปลอดภัย', leaveType: 'personal', startDate: '2026-06-18', endDate: '2026-06-18', days: 1, reason: 'งานบวช',            status: 'pending',  requestedAt: '2026-06-14T11:00:00', approvedBy: null },
  { id: 'l4', employeeCode: 'EMP-002', employeeName: 'กัญญา แก้วใส',    department: 'ฝ่ายธุรการ',           leaveType: 'annual',   startDate: '2026-06-10', endDate: '2026-06-10', days: 1, reason: 'ท่องเที่ยว',        status: 'approved', requestedAt: '2026-06-08T10:00:00', approvedBy: 'มาลี ดีใจ' },
  { id: 'l5', employeeCode: 'EMP-005', employeeName: 'ธนกร พิทักษ์',    department: 'ฝ่ายเทคนิค',           leaveType: 'sick',     startDate: '2026-06-05', endDate: '2026-06-05', days: 1, reason: 'ปวดหัว',            status: 'rejected', requestedAt: '2026-06-05T07:00:00', approvedBy: 'อานนท์ ใหม่สด' },
]

export const mockHrEvents: HrEvent[] = [
  { id: 'ev1', type: 'new-hire',      employeeName: 'นิภา ศรีทอง',       detail: 'เริ่มงานตำแหน่งเจ้าหน้าที่ควบคุม ฝ่ายควบคุม', date: '2026-04-01' },
  { id: 'ev2', type: 'promote',       employeeName: 'สมชาย รักษาดี',     detail: 'เลื่อนตำแหน่งจากเจ้าหน้าที่ → หัวหน้าเจ้าหน้าที่', date: '2026-05-01' },
  { id: 'ev3', type: 'contract-end',  employeeName: 'สุดา มีสุข',         detail: 'สัญญาจ้างสิ้นสุด ฝ่ายธุรการ', date: '2026-06-01' },
  { id: 'ev4', type: 'transfer',      employeeName: 'อรุณี วงศ์ทอง',     detail: 'โอนย้ายจากฝ่ายรักษาความปลอดภัย → ฝ่ายลาดตระเวน', date: '2026-06-10' },
]

export const mockHrStats = {
  totalEmployees: 55,
  active: 48,
  onLeave: 4,
  terminated: 3,
  pendingLeave: 2,
  newHireThisMonth: 1,
  contractEndingSoon: 2,
}
