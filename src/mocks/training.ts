export type CourseStatus = 'active' | 'draft' | 'archived'
export type EnrollmentStatus = 'enrolled' | 'in-progress' | 'completed' | 'failed' | 'cancelled'
export type CourseCategory = 'safety' | 'security' | 'fire' | 'first-aid' | 'compliance' | 'technical'

export interface Course {
  id: string
  code: string
  name: string
  category: CourseCategory
  description: string
  durationHours: number
  passingScore: number
  status: CourseStatus
  instructorName: string
  maxEnrollment: number
  enrolledCount: number
  completedCount: number
  createdAt: string
  nextSessionDate: string | null
}

export interface Enrollment {
  id: string
  employeeCode: string
  employeeName: string
  department: string
  courseCode: string
  courseName: string
  category: CourseCategory
  enrolledAt: string
  startedAt: string | null
  completedAt: string | null
  score: number | null
  passingScore: number
  status: EnrollmentStatus
  certificateNo: string | null
  expiresAt: string | null
}

export interface TrainingEvent {
  id: string
  courseCode: string
  courseName: string
  category: CourseCategory
  scheduledDate: string
  startTime: string
  endTime: string
  location: string
  instructorName: string
  enrolledCount: number
  maxEnrollment: number
}

export const mockCourses: Course[] = [
  {
    id: 'c1', code: 'TRN-001', name: 'ความปลอดภัยในการทำงานขั้นพื้นฐาน',
    category: 'safety', description: 'กฎระเบียบและแนวปฏิบัติด้านความปลอดภัยในสถานที่ทำงาน',
    durationHours: 6, passingScore: 70, status: 'active',
    instructorName: 'สมศักดิ์ แข็งแกร่ง', maxEnrollment: 30, enrolledCount: 24, completedCount: 18,
    createdAt: '2026-01-10', nextSessionDate: '2026-06-20',
  },
  {
    id: 'c2', code: 'TRN-002', name: 'การรักษาความปลอดภัยขั้นสูง',
    category: 'security', description: 'เทคนิคการรักษาความปลอดภัย การตรวจสอบผู้เข้าออก และการจัดการเหตุฉุกเฉิน',
    durationHours: 12, passingScore: 80, status: 'active',
    instructorName: 'วิรัตน์ มั่นคง', maxEnrollment: 20, enrolledCount: 16, completedCount: 10,
    createdAt: '2026-02-01', nextSessionDate: '2026-06-25',
  },
  {
    id: 'c3', code: 'TRN-003', name: 'การดับเพลิงขั้นต้น',
    category: 'fire', description: 'การใช้อุปกรณ์ดับเพลิง การอพยพ และการป้องกันอัคคีภัย',
    durationHours: 4, passingScore: 75, status: 'active',
    instructorName: 'ประสิทธิ์ มั่นคง', maxEnrollment: 25, enrolledCount: 22, completedCount: 20,
    createdAt: '2026-01-15', nextSessionDate: '2026-07-05',
  },
  {
    id: 'c4', code: 'TRN-004', name: 'การปฐมพยาบาลเบื้องต้น',
    category: 'first-aid', description: 'CPR การห้ามเลือด และการปฐมพยาบาลเบื้องต้น',
    durationHours: 8, passingScore: 70, status: 'active',
    instructorName: 'มาลี ดีใจ', maxEnrollment: 20, enrolledCount: 14, completedCount: 12,
    createdAt: '2026-03-01', nextSessionDate: '2026-06-28',
  },
  {
    id: 'c5', code: 'TRN-005', name: 'กฎหมายแรงงานและระเบียบปฏิบัติ',
    category: 'compliance', description: 'ข้อกฎหมายด้านแรงงาน สิทธิ์และหน้าที่ของพนักงาน',
    durationHours: 3, passingScore: 60, status: 'active',
    instructorName: 'กัญญา แก้วใส', maxEnrollment: 50, enrolledCount: 38, completedCount: 35,
    createdAt: '2026-02-15', nextSessionDate: null,
  },
  {
    id: 'c6', code: 'TRN-006', name: 'การใช้ระบบควบคุมการเข้าออก',
    category: 'technical', description: 'การใช้งานและดูแลระบบ Access Control และกล้อง CCTV',
    durationHours: 6, passingScore: 75, status: 'draft',
    instructorName: 'อานนท์ ใหม่สด', maxEnrollment: 15, enrolledCount: 0, completedCount: 0,
    createdAt: '2026-05-20', nextSessionDate: '2026-07-15',
  },
]

export const mockEnrollments: Enrollment[] = [
  { id: 'en1',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',   department: 'ฝ่ายรักษาความปลอดภัย', courseCode: 'TRN-001', courseName: 'ความปลอดภัยในการทำงานขั้นพื้นฐาน', category: 'safety',     enrolledAt: '2026-05-01', startedAt: '2026-05-10', completedAt: '2026-05-10', score: 88, passingScore: 70, status: 'completed', certificateNo: 'CERT-2026-001', expiresAt: '2027-05-10' },
  { id: 'en2',  employeeCode: 'EMP-001', employeeName: 'สมชาย รักษาดี',   department: 'ฝ่ายรักษาความปลอดภัย', courseCode: 'TRN-002', courseName: 'การรักษาความปลอดภัยขั้นสูง',        category: 'security',   enrolledAt: '2026-05-15', startedAt: '2026-06-01', completedAt: null,         score: null, passingScore: 80, status: 'in-progress', certificateNo: null, expiresAt: null },
  { id: 'en3',  employeeCode: 'EMP-002', employeeName: 'กัญญา แก้วใส',    department: 'ฝ่ายธุรการ',            courseCode: 'TRN-005', courseName: 'กฎหมายแรงงานและระเบียบปฏิบัติ',     category: 'compliance', enrolledAt: '2026-04-01', startedAt: '2026-04-10', completedAt: '2026-04-10', score: 92, passingScore: 60, status: 'completed', certificateNo: 'CERT-2026-002', expiresAt: '2027-04-10' },
  { id: 'en4',  employeeCode: 'EMP-003', employeeName: 'วิชัย สุขสันต์',  department: 'ฝ่ายรักษาความปลอดภัย', courseCode: 'TRN-003', courseName: 'การดับเพลิงขั้นต้น',               category: 'fire',       enrolledAt: '2026-03-01', startedAt: '2026-03-15', completedAt: '2026-03-15', score: 78, passingScore: 75, status: 'completed', certificateNo: 'CERT-2026-003', expiresAt: '2027-03-15' },
  { id: 'en5',  employeeCode: 'EMP-003', employeeName: 'วิชัย สุขสันต์',  department: 'ฝ่ายรักษาความปลอดภัย', courseCode: 'TRN-001', courseName: 'ความปลอดภัยในการทำงานขั้นพื้นฐาน', category: 'safety',     enrolledAt: '2026-05-01', startedAt: '2026-05-10', completedAt: '2026-05-10', score: 65, passingScore: 70, status: 'failed',    certificateNo: null, expiresAt: null },
  { id: 'en6',  employeeCode: 'EMP-004', employeeName: 'อรุณี วงศ์ทอง',   department: 'ฝ่ายลาดตระเวน',         courseCode: 'TRN-004', courseName: 'การปฐมพยาบาลเบื้องต้น',            category: 'first-aid',  enrolledAt: '2026-04-15', startedAt: '2026-05-05', completedAt: '2026-05-05', score: 82, passingScore: 70, status: 'completed', certificateNo: 'CERT-2026-004', expiresAt: '2027-05-05' },
  { id: 'en7',  employeeCode: 'EMP-005', employeeName: 'ธนกร พิทักษ์',    department: 'ฝ่ายเทคนิค',            courseCode: 'TRN-001', courseName: 'ความปลอดภัยในการทำงานขั้นพื้นฐาน', category: 'safety',     enrolledAt: '2026-05-01', startedAt: null,         completedAt: null,         score: null, passingScore: 70, status: 'enrolled',    certificateNo: null, expiresAt: null },
  { id: 'en8',  employeeCode: 'EMP-006', employeeName: 'นิภา ศรีทอง',     department: 'ฝ่ายควบคุม',            courseCode: 'TRN-003', courseName: 'การดับเพลิงขั้นต้น',               category: 'fire',       enrolledAt: '2026-04-01', startedAt: '2026-04-20', completedAt: '2026-04-20', score: 90, passingScore: 75, status: 'completed', certificateNo: 'CERT-2026-005', expiresAt: '2027-04-20' },
  { id: 'en9',  employeeCode: 'EMP-007', employeeName: 'บุญมี ซื่อสัตย์', department: 'ฝ่ายรักษาความปลอดภัย', courseCode: 'TRN-002', courseName: 'การรักษาความปลอดภัยขั้นสูง',        category: 'security',   enrolledAt: '2026-05-15', startedAt: '2026-06-01', completedAt: null,         score: null, passingScore: 80, status: 'in-progress', certificateNo: null, expiresAt: null },
  { id: 'en10', employeeCode: 'EMP-007', employeeName: 'บุญมี ซื่อสัตย์', department: 'ฝ่ายรักษาความปลอดภัย', courseCode: 'TRN-004', courseName: 'การปฐมพยาบาลเบื้องต้น',            category: 'first-aid',  enrolledAt: '2026-04-15', startedAt: '2026-05-05', completedAt: '2026-05-05', score: 74, passingScore: 70, status: 'completed', certificateNo: 'CERT-2026-006', expiresAt: '2027-05-05' },
]

export const mockTrainingEvents: TrainingEvent[] = [
  { id: 'te1', courseCode: 'TRN-001', courseName: 'ความปลอดภัยในการทำงานขั้นพื้นฐาน', category: 'safety',    scheduledDate: '2026-06-20', startTime: '08:00', endTime: '15:00', location: 'ห้องอบรม A', instructorName: 'สมศักดิ์ แข็งแกร่ง', enrolledCount: 18, maxEnrollment: 30 },
  { id: 'te2', courseCode: 'TRN-004', courseName: 'การปฐมพยาบาลเบื้องต้น',            category: 'first-aid', scheduledDate: '2026-06-28', startTime: '09:00', endTime: '17:00', location: 'ห้องอบรม B', instructorName: 'มาลี ดีใจ',           enrolledCount: 12, maxEnrollment: 20 },
  { id: 'te3', courseCode: 'TRN-002', courseName: 'การรักษาความปลอดภัยขั้นสูง',        category: 'security',  scheduledDate: '2026-06-25', startTime: '08:00', endTime: '20:00', location: 'ห้องฝึกอบรมหลัก', instructorName: 'วิรัตน์ มั่นคง',   enrolledCount: 14, maxEnrollment: 20 },
  { id: 'te4', courseCode: 'TRN-003', courseName: 'การดับเพลิงขั้นต้น',               category: 'fire',      scheduledDate: '2026-07-05', startTime: '08:00', endTime: '12:00', location: 'ลานฝึกกลางแจ้ง',   instructorName: 'ประสิทธิ์ มั่นคง',  enrolledCount: 20, maxEnrollment: 25 },
]

export const mockTrainingStats = {
  totalCourses: 6,
  activeCourses: 5,
  totalEnrollments: 55,
  completedThisMonth: 12,
  inProgressCount: 8,
  passRate: 87,
  certificatesIssued: 24,
  expiringSoon: 3,
}
