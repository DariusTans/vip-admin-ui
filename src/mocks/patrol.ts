export type PatrolStatus = 'on-duty' | 'off-duty' | 'break'
export type RoundStatus = 'completed' | 'in-progress' | 'missed' | 'upcoming'
export type IncidentSeverity = 'low' | 'medium' | 'high'

export interface Guard {
  id: string
  name: string
  code: string
  zone: string
  status: PatrolStatus
  shift: 'morning' | 'afternoon' | 'night'
  lastSeen: string
  roundsToday: number
  roundsTarget: number
  phone: string
}

export interface PatrolRound {
  id: string
  guardName: string
  guardCode: string
  zone: string
  checkpoint: string
  scheduledAt: string
  completedAt: string | null
  status: RoundStatus
  note: string | null
}

export interface Incident {
  id: string
  reportedBy: string
  zone: string
  description: string
  severity: IncidentSeverity
  reportedAt: string
  resolvedAt: string | null
  isResolved: boolean
}

export const mockGuards: Guard[] = [
  { id: 'g1', name: 'สมศักดิ์ แข็งแกร่ง', code: 'G-001', zone: 'โซน A (ประตูหน้า)', status: 'on-duty', shift: 'morning', lastSeen: '2026-06-15T11:45:00', roundsToday: 4, roundsTarget: 6, phone: '081-111-1111' },
  { id: 'g2', name: 'วิรัตน์ มั่นคง', code: 'G-002', zone: 'โซน B (อาคาร 1-3)', status: 'on-duty', shift: 'morning', lastSeen: '2026-06-15T11:50:00', roundsToday: 5, roundsTarget: 6, phone: '081-222-2222' },
  { id: 'g3', name: 'ประเสริฐ ตื่นตัว', code: 'G-003', zone: 'โซน C (ที่จอดรถ)', status: 'break', shift: 'morning', lastSeen: '2026-06-15T11:00:00', roundsToday: 3, roundsTarget: 6, phone: '081-333-3333' },
  { id: 'g4', name: 'อำนาจ กล้าหาญ', code: 'G-004', zone: 'โซน D (โกดัง)', status: 'on-duty', shift: 'afternoon', lastSeen: '2026-06-15T11:55:00', roundsToday: 2, roundsTarget: 4, phone: '081-444-4444' },
  { id: 'g5', name: 'บุญมี ซื่อสัตย์', code: 'G-005', zone: 'โซน E (หลังอาคาร)', status: 'off-duty', shift: 'night', lastSeen: '2026-06-15T07:00:00', roundsToday: 0, roundsTarget: 5, phone: '081-555-5555' },
  { id: 'g6', name: 'ธนกร พิทักษ์', code: 'G-006', zone: 'โซน A (ประตูหน้า)', status: 'on-duty', shift: 'morning', lastSeen: '2026-06-15T11:48:00', roundsToday: 4, roundsTarget: 6, phone: '081-666-6666' },
]

export const mockRounds: PatrolRound[] = [
  { id: 'r1', guardName: 'สมศักดิ์ แข็งแกร่ง', guardCode: 'G-001', zone: 'โซน A', checkpoint: 'CP-A1 ประตูหน้า', scheduledAt: '2026-06-15T10:00:00', completedAt: '2026-06-15T10:05:00', status: 'completed', note: null },
  { id: 'r2', guardName: 'วิรัตน์ มั่นคง', guardCode: 'G-002', zone: 'โซน B', checkpoint: 'CP-B1 ล็อบบี้', scheduledAt: '2026-06-15T10:15:00', completedAt: '2026-06-15T10:18:00', status: 'completed', note: null },
  { id: 'r3', guardName: 'ประเสริฐ ตื่นตัว', guardCode: 'G-003', zone: 'โซน C', checkpoint: 'CP-C1 ทางเข้าจอดรถ', scheduledAt: '2026-06-15T10:30:00', completedAt: null, status: 'missed', note: 'ไม่มีการ scan' },
  { id: 'r4', guardName: 'สมศักดิ์ แข็งแกร่ง', guardCode: 'G-001', zone: 'โซน A', checkpoint: 'CP-A2 รั้วด้านข้าง', scheduledAt: '2026-06-15T11:00:00', completedAt: '2026-06-15T11:03:00', status: 'completed', note: null },
  { id: 'r5', guardName: 'อำนาจ กล้าหาญ', guardCode: 'G-004', zone: 'โซน D', checkpoint: 'CP-D1 ประตูโกดัง', scheduledAt: '2026-06-15T11:30:00', completedAt: '2026-06-15T11:35:00', status: 'completed', note: null },
  { id: 'r6', guardName: 'วิรัตน์ มั่นคง', guardCode: 'G-002', zone: 'โซน B', checkpoint: 'CP-B2 ชั้น 3', scheduledAt: '2026-06-15T11:45:00', completedAt: null, status: 'in-progress', note: null },
  { id: 'r7', guardName: 'สมศักดิ์ แข็งแกร่ง', guardCode: 'G-001', zone: 'โซน A', checkpoint: 'CP-A1 ประตูหน้า', scheduledAt: '2026-06-15T12:00:00', completedAt: null, status: 'upcoming', note: null },
  { id: 'r8', guardName: 'ธนกร พิทักษ์', guardCode: 'G-006', zone: 'โซน A', checkpoint: 'CP-A3 ป้อมยาม', scheduledAt: '2026-06-15T12:15:00', completedAt: null, status: 'upcoming', note: null },
]

export const mockIncidents: Incident[] = [
  { id: 'i1', reportedBy: 'G-003 ประเสริฐ', zone: 'โซน C', description: 'พบประตูโรงเก็บของเปิดค้างโดยไม่มีผู้รับผิดชอบ', severity: 'medium', reportedAt: '2026-06-15T09:15:00', resolvedAt: '2026-06-15T09:45:00', isResolved: true },
  { id: 'i2', reportedBy: 'G-001 สมศักดิ์', zone: 'โซน A', description: 'พบบุคคลต้องสงสัยบริเวณรั้วด้านข้าง ไม่มีบัตรผ่าน', severity: 'high', reportedAt: '2026-06-15T10:30:00', resolvedAt: null, isResolved: false },
  { id: 'i3', reportedBy: 'G-002 วิรัตน์', zone: 'โซน B', description: 'ไฟฉุกเฉินชั้น 2 ไม่ทำงาน', severity: 'low', reportedAt: '2026-06-15T11:00:00', resolvedAt: null, isResolved: false },
]

export const mockPatrolStats = {
  guardsOnDuty: 4,
  guardsTotal: 6,
  roundsCompleted: 14,
  roundsTotal: 20,
  missedRounds: 1,
  incidents: 3,
  incidentsOpen: 2,
  checkpointsTotal: 12,
}

export const ZONES = ['โซน A (ประตูหน้า)', 'โซน B (อาคาร 1-3)', 'โซน C (ที่จอดรถ)', 'โซน D (โกดัง)', 'โซน E (หลังอาคาร)']
