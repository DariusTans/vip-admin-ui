import { useState } from 'react'
import {
  Clock, Users, AlertCircle, CalendarCheck, Timer,
  TrendingUp, ChevronDown, Search, CheckCircle2,
  XCircle, AlarmClock, Moon, Sun, Sunset,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  mockAttendance, mockShiftStats, mockWeeklyHours, mockShiftAssignments,
  type AttendanceRecord, type ShiftType, type AttendanceStatus, type PunchStatus,
} from '@/mocks/shift'

// ─── Mini components ──────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, variant = 'default', trend,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  trend?: { value: number; up: boolean }
}) {
  const variantCls = {
    default:  'bg-card border border-border',
    primary:  'bg-primary-soft border border-primary/20',
    success:  'bg-success-soft border border-success/20',
    warning:  'bg-warning-soft border border-warning/20',
    danger:   'bg-destructive-soft border border-destructive/20',
  }[variant]

  const iconCls = {
    default:  'bg-muted text-muted-foreground',
    primary:  'bg-primary/10 text-primary',
    success:  'bg-success/10 text-success',
    warning:  'bg-warning/10 text-warning',
    danger:   'bg-destructive/10 text-destructive',
  }[variant]

  return (
    <div className={cn('rounded-xl p-4 flex flex-col gap-2', variantCls)}>
      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-lg', iconCls)}>
          <Icon className="size-4" />
        </div>
        {trend && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium',
            trend.up ? 'text-success' : 'text-destructive')}>
            {trend.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xl font-semibold text-foreground lg:text-2xl">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="hidden text-xs text-muted-foreground/70 mt-0.5 sm:block">{sub}</p>}
      </div>
    </div>
  )
}

function ShiftTypeBadge({ type }: { type: ShiftType }) {
  if (type === 'morning')   return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-soft text-primary">
      <Sun className="size-3" /> กะเช้า
    </span>
  )
  if (type === 'afternoon') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning-soft text-warning">
      <Sunset className="size-3" /> กะบ่าย
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
      <Moon className="size-3" /> กะดึก
    </span>
  )
}

function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const map: Record<AttendanceStatus, { label: string; cls: string }> = {
    present:  { label: 'มาทำงาน',  cls: 'bg-success-soft text-success' },
    late:     { label: 'มาสาย',    cls: 'bg-warning-soft text-warning' },
    absent:   { label: 'ขาดงาน',   cls: 'bg-destructive-soft text-destructive' },
    leave:    { label: 'ลาหยุด',   cls: 'bg-primary-soft text-primary' },
    holiday:  { label: 'วันหยุด',  cls: 'bg-muted text-muted-foreground' },
  }
  const { label, cls } = map[status]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', cls)}>
      {label}
    </span>
  )
}

function PunchStatusBadge({ status }: { status: PunchStatus }) {
  const map: Record<PunchStatus, { label: string; icon: React.ElementType; cls: string }> = {
    'on-time':     { label: 'ตรงเวลา',     icon: CheckCircle2, cls: 'text-success' },
    'late':        { label: 'เข้างานสาย',  icon: AlarmClock,   cls: 'text-warning' },
    'early-leave': { label: 'ออกก่อนเวลา', icon: XCircle,      cls: 'text-destructive' },
    'overtime':    { label: 'ล่วงเวลา',    icon: TrendingUp,   cls: 'text-primary' },
    'absent':      { label: 'ไม่มีข้อมูล', icon: AlertCircle,  cls: 'text-muted-foreground' },
  }
  const { label, icon: Icon, cls } = map[status]
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', cls)}>
      <Icon className="size-3" />
      {label}
    </span>
  )
}

function formatMinutes(min: number | null): string {
  if (min === null) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}ช. ${m}น.` : `${m}น.`
}

// ─── Weekly Hours Bar Chart ──────────────────────────────────────────────────

function WeeklyChart() {
  const [hovered, setHovered] = useState<number | null>(null)
  const maxVal = Math.max(...mockWeeklyHours.map(d => Math.max(d.scheduled, d.actual)))

  return (
    <div className="bg-card border border-border rounded-xl p-4 lg:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">ชั่วโมงทำงานรายสัปดาห์</h3>
          <p className="text-xs text-muted-foreground">9–15 มิ.ย. 2026 · ทั้งองค์กร</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-primary/30" />ตามแผน
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-primary" />จริง
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-warning" />OT
          </span>
        </div>
      </div>

      <div className="relative h-36">
        <svg width="100%" height="100%" viewBox="0 0 560 144" preserveAspectRatio="none">
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <line key={t} x1="0" y1={144 * (1 - t)} x2="560" y2={144 * (1 - t)}
              stroke="currentColor" strokeWidth="0.5" className="text-border" />
          ))}
          {mockWeeklyHours.map((d, i) => {
            const gw = 560 / mockWeeklyHours.length
            const x = i * gw + gw * 0.1
            const bw = gw * 0.25
            const schedH = (d.scheduled / maxVal) * 136
            const actH = (d.actual / maxVal) * 136
            const otH = (d.overtime / maxVal) * 136
            return (
              <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <rect x={x} y={144 - schedH} width={bw} height={schedH} rx="2"
                  className="fill-primary/20" />
                <rect x={x + bw + 2} y={144 - actH} width={bw} height={actH} rx="2"
                  className="fill-primary" />
                {d.overtime > 0 && (
                  <rect x={x + bw + 2} y={144 - actH} width={bw} height={otH} rx="2"
                    className="fill-warning" />
                )}
                {hovered === i && (
                  <g>
                    <rect x={x - 8} y={144 - actH - 48} width={90} height={42} rx="4"
                      className="fill-popover" filter="drop-shadow(0 2px 4px rgb(0 0 0 / 0.15))" />
                    <text x={x - 2} y={144 - actH - 32} fontSize="9" className="fill-muted-foreground">ตามแผน: {d.scheduled}ช.</text>
                    <text x={x - 2} y={144 - actH - 20} fontSize="9" className="fill-foreground" fontWeight="600">จริง: {d.actual}ช.</text>
                    <text x={x - 2} y={144 - actH - 8}  fontSize="9" className="fill-warning">OT: {d.overtime}ช.</text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex">
          {mockWeeklyHours.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <p className="text-[10px] font-medium text-foreground">{d.day}</p>
              <p className="hidden text-[9px] text-muted-foreground sm:block">{d.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Shift Distribution Donut ────────────────────────────────────────────────

function ShiftDonut() {
  const { morning, afternoon, night } = mockShiftStats.shiftsToday
  const total = morning + afternoon + night
  const slices = [
    { label: 'กะเช้า', value: morning,   colorIdx: 0 },
    { label: 'กะบ่าย', value: afternoon, colorIdx: 1 },
    { label: 'กะดึก',  value: night,     colorIdx: 2 },
  ]

  const cx = 56, cy = 56, r = 40, strokeW = 14
  const circ = 2 * Math.PI * r
  let cumulative = 0

  return (
    <div className="bg-card border border-border rounded-xl p-4 lg:p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">การกระจายกะวันนี้</h3>
      <div className="flex items-center gap-6">
        <svg width="112" height="112" viewBox="0 0 112 112" className="shrink-0">
          <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth={strokeW} className="stroke-muted" />
          {slices.map((s, i) => {
            const fraction = s.value / total
            const dash = fraction * circ
            const gap = circ - dash
            const rotateDeg = -90 + (cumulative / circ) * 360
            cumulative += dash
            return (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                strokeWidth={strokeW}
                strokeDasharray={`${dash} ${gap}`}
                strokeLinecap="butt"
                className={cn({
                  'stroke-primary': i === 0,
                  'stroke-warning': i === 1,
                  'stroke-muted-foreground': i === 2,
                })}
                style={{ transform: `rotate(${rotateDeg}deg)`, transformOrigin: `${cx}px ${cy}px` }}
              />
            )
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="700" className="fill-foreground">{total}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" className="fill-muted-foreground">พนักงาน</text>
        </svg>

        <div className="flex flex-col gap-2">
          {slices.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={cn('inline-block w-2.5 h-2.5 rounded-sm shrink-0', {
                'bg-primary': i === 0,
                'bg-warning': i === 1,
                'bg-muted-foreground': i === 2,
              })} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-xs font-semibold text-foreground ml-auto pl-2">{s.value}</span>
              <span className="text-[10px] text-muted-foreground">({Math.round(s.value / total * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Punch Timeline row ──────────────────────────────────────────────────────

function PunchTimeline({ record }: { record: AttendanceRecord }) {
  const isLate = record.lateMinutes > 0
  const isOT   = record.overtimeMinutes > 0

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground w-10 shrink-0">{record.scheduledIn}</span>
      <div className="flex-1 flex items-center gap-1">
        <div className="h-0.5 w-6 bg-border rounded" />
        <div className={cn('size-2.5 rounded-full shrink-0 border-2', {
          'bg-success border-success': record.punchIn && !isLate,
          'bg-warning border-warning': record.punchIn && isLate,
          'bg-muted border-border':    !record.punchIn,
        })} />
        <div className={cn('h-0.5 flex-1 rounded', {
          'bg-success/40': record.workMinutes,
          'bg-border':     !record.workMinutes,
        })} />
        <div className={cn('size-2.5 rounded-full shrink-0 border-2', {
          'bg-success border-success': record.punchOut && !isOT,
          'bg-primary border-primary': record.punchOut && isOT,
          'bg-muted border-border':    !record.punchOut,
        })} />
        <div className="h-0.5 w-6 bg-border rounded" />
      </div>
      <span className="text-muted-foreground w-10 shrink-0 text-right">{record.scheduledOut}</span>
    </div>
  )
}

// ─── Schedule Gantt ──────────────────────────────────────────────────────────

function ScheduleGantt() {
  const today = mockShiftAssignments.filter(a => a.date === '2026-06-09')
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const timeToX = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return ((h * 60 + m) / (24 * 60)) * 100
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 lg:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">ตาราง Shift วันนี้</h3>
          <p className="text-xs text-muted-foreground">จันทร์ 9 มิ.ย. 2026</p>
        </div>
        <button className="text-xs text-primary hover:underline flex items-center gap-1">
          ดูทั้งสัปดาห์ <ChevronDown className="size-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="flex text-[9px] text-muted-foreground mb-1 pl-[7.5rem]">
            {[0, 6, 12, 18, 23].map(h => (
              <div key={h} className="flex-1">{String(h).padStart(2, '0')}:00</div>
            ))}
          </div>
          <div className="h-px bg-border mb-2 ml-30" />

          <div className="space-y-2 overflow-y-auto max-h-60">
            {today.map(a => {
              const startX = timeToX(a.startTime)
              let endX = timeToX(a.endTime)
              if (endX <= startX) endX = 100
              const width = Math.max(endX - startX, 5)

              return (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-medium text-foreground truncate">{a.employeeName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{a.shiftName}</p>
                  </div>
                  <div className="flex-1 relative h-6 bg-muted/20 rounded overflow-hidden">
                    <div className="absolute inset-0 flex">
                      {hours.map(h => (
                        <div key={h} className="flex-1 border-r border-border/20 last:border-r-0" />
                      ))}
                    </div>
                    <div
                      className={cn('absolute top-1 h-4 rounded-sm flex items-center px-1.5 text-[10px] font-medium text-white', {
                        'bg-primary':          a.shiftType === 'morning',
                        'bg-warning':          a.shiftType === 'afternoon',
                        'bg-muted-foreground': a.shiftType === 'night',
                      })}
                      style={{ left: `${startX}%`, width: `${width}%` }}
                    >
                      {width > 8 ? `${a.startTime}–${a.endTime}` : ''}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type TabId = 'overview' | 'attendance' | 'schedule'

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',   label: 'ภาพรวม' },
  { id: 'attendance', label: 'บันทึกเวลา' },
  { id: 'schedule',   label: 'ตาราง Shift' },
]

export function ShiftPage() {
  const [activeTab, setActiveTab]       = useState<TabId>('overview')
  const [searchQ, setSearchQ]           = useState('')
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | 'all'>('all')
  const [filterShift, setFilterShift]   = useState<'all' | 'morning' | 'afternoon' | 'night'>('all')

  const todayRecords = mockAttendance.filter(a => a.date === '2026-06-15')

  const filteredAttendance = mockAttendance.filter(a => {
    const matchQ = searchQ === '' ||
      a.employeeName.includes(searchQ) ||
      a.employeeCode.toLowerCase().includes(searchQ.toLowerCase()) ||
      a.department.includes(searchQ)
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    const matchShift  = filterShift  === 'all' || a.shiftType === filterShift
    return matchQ && matchStatus && matchShift
  })

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground lg:text-2xl">Shift &amp; Time Attendant</h1>
          <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">
            จัดการตาราง Shift และบันทึกเวลาทำงาน · อัปเดต 15 มิ.ย. 2026
          </p>
        </div>
        <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 transition-colors lg:text-sm lg:px-4">
          <CalendarCheck className="size-4" />
          <span className="hidden sm:inline">ส่งออกรายงาน</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="มาทำงานวันนี้"
          value={`${mockShiftStats.presentToday}/${mockShiftStats.totalEmployees}`}
          sub={`${Math.round(mockShiftStats.presentToday / mockShiftStats.totalEmployees * 100)}% ของพนักงานทั้งหมด`}
          icon={Users}
          variant="success"
          trend={{ value: 3, up: true }}
        />
        <StatCard
          label="มาสายวันนี้"
          value={mockShiftStats.lateToday}
          sub="พนักงาน"
          icon={AlarmClock}
          variant="warning"
        />
        <StatCard
          label="ขาดงานวันนี้"
          value={mockShiftStats.absentToday}
          sub="ไม่รวมลาหยุด"
          icon={AlertCircle}
          variant="danger"
        />
        <StatCard
          label="OT สัปดาห์นี้"
          value={`${mockShiftStats.overtimeThisWeek} ช.`}
          sub="ชั่วโมงล่วงเวลารวม"
          icon={Timer}
          variant="primary"
          trend={{ value: 12, up: true }}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-colors lg:px-4',
              activeTab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ShiftDonut />

            {/* Punch summary today */}
            <div className="bg-card border border-border rounded-xl p-4 lg:p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">สรุปการลงเวลาวันนี้</h3>
                  <p className="text-xs text-muted-foreground">15 มิ.ย. 2026</p>
                </div>
                <Clock className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {todayRecords.map(r => (
                  <div key={r.id} className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                    r.status === 'absent' ? 'border-destructive/30 bg-destructive-soft/30' :
                    r.status === 'late'   ? 'border-warning/30 bg-warning-soft/30' :
                    'border-border bg-muted/20',
                  )}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold text-foreground">{r.employeeName}</span>
                        <span className="text-[10px] text-muted-foreground">{r.employeeCode}</span>
                        <ShiftTypeBadge type={r.shiftType} />
                      </div>
                      <PunchTimeline record={r} />
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <PunchStatusBadge status={r.punchStatus} />
                        {r.lateMinutes > 0 && (
                          <span className="text-[10px] text-warning">สาย {r.lateMinutes} น.</span>
                        )}
                        {r.overtimeMinutes > 0 && (
                          <span className="text-[10px] text-primary">OT {formatMinutes(r.overtimeMinutes)}</span>
                        )}
                        {r.note && (
                          <span className="text-[10px] text-muted-foreground italic">หมายเหตุ: {r.note}</span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <AttendanceStatusBadge status={r.status} />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatMinutes(r.workMinutes)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <WeeklyChart />
        </div>
      )}

      {/* ── Attendance ───────────────────────────────────────── */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-40">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="ค้นหาชื่อ, รหัส..."
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as AttendanceStatus | 'all')}
              className="text-sm px-3 py-1.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="present">มาทำงาน</option>
              <option value="late">มาสาย</option>
              <option value="absent">ขาดงาน</option>
              <option value="leave">ลาหยุด</option>
            </select>
            <select
              value={filterShift}
              onChange={e => setFilterShift(e.target.value as typeof filterShift)}
              className="text-sm px-3 py-1.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="all">กะทั้งหมด</option>
              <option value="morning">กะเช้า</option>
              <option value="afternoon">กะบ่าย</option>
              <option value="night">กะดึก</option>
            </select>
          </div>

          {/* Desktop table */}
          <div className="hidden bg-card border border-border rounded-xl overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {['พนักงาน', 'วันที่', 'กะ', 'เข้า', 'ออก', 'ชั่วโมง', 'สาย', 'OT', 'สถานะ'].map(col => (
                      <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-sm text-muted-foreground">
                        ไม่พบข้อมูลที่ตรงกับการค้นหา
                      </td>
                    </tr>
                  ) : filteredAttendance.map(a => (
                    <tr key={a.id} className={cn(
                      'hover:bg-muted/30 transition-colors',
                      a.status === 'absent' && 'bg-destructive-soft/20',
                    )}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-xs">{a.employeeName}</p>
                        <p className="text-[10px] text-muted-foreground">{a.employeeCode} · {a.department}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">{a.date}</td>
                      <td className="px-4 py-3"><ShiftTypeBadge type={a.shiftType} /></td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs font-medium',
                          a.punchIn ? (a.lateMinutes > 0 ? 'text-warning' : 'text-success') : 'text-muted-foreground')}>
                          {a.punchIn ?? '—'}
                        </span>
                        <p className="text-[10px] text-muted-foreground">กำหนด {a.scheduledIn}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs font-medium',
                          a.punchOut ? (a.overtimeMinutes > 0 ? 'text-primary' : 'text-success') : 'text-muted-foreground')}>
                          {a.punchOut ?? '—'}
                        </span>
                        <p className="text-[10px] text-muted-foreground">กำหนด {a.scheduledOut}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground font-medium">{formatMinutes(a.workMinutes)}</td>
                      <td className="px-4 py-3">
                        {a.lateMinutes > 0
                          ? <span className="text-xs text-warning font-medium">{a.lateMinutes} น.</span>
                          : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {a.overtimeMinutes > 0
                          ? <span className="text-xs text-primary font-medium">{formatMinutes(a.overtimeMinutes)}</span>
                          : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3"><AttendanceStatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">แสดง {filteredAttendance.length} รายการ</p>
              <p className="text-xs text-muted-foreground">
                รวมล่วงเวลา: {filteredAttendance.reduce((s, a) => s + a.overtimeMinutes, 0)} น.
              </p>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filteredAttendance.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
            ) : filteredAttendance.map(a => (
              <div key={a.id} className={cn(
                'rounded-xl border bg-card p-4 shadow-sm',
                a.status === 'absent' ? 'border-destructive/30' :
                a.status === 'late'   ? 'border-warning/30' : 'border-border',
              )}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-medium text-foreground text-sm">{a.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{a.employeeCode} · {a.department}</p>
                  </div>
                  <AttendanceStatusBadge status={a.status} />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                  <ShiftTypeBadge type={a.shiftType} />
                  <span>{a.date}</span>
                </div>
                <PunchTimeline record={a} />
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <PunchStatusBadge status={a.punchStatus} />
                  {a.lateMinutes > 0 && <span className="text-xs text-warning">สาย {a.lateMinutes} น.</span>}
                  {a.overtimeMinutes > 0 && <span className="text-xs text-primary">OT {formatMinutes(a.overtimeMinutes)}</span>}
                  <span className="ml-auto text-xs text-muted-foreground">{formatMinutes(a.workMinutes)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Schedule ─────────────────────────────────────────── */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Shift type summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-2 lg:gap-3 lg:p-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Sun className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{mockShiftStats.shiftsToday.morning}</p>
                <p className="text-xs text-muted-foreground">กะเช้า</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-2 lg:gap-3 lg:p-4">
              <div className="p-2 rounded-lg bg-warning/10 shrink-0">
                <Sunset className="size-4 text-warning" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{mockShiftStats.shiftsToday.afternoon}</p>
                <p className="text-xs text-muted-foreground">กะบ่าย</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-2 lg:gap-3 lg:p-4">
              <div className="p-2 rounded-lg bg-muted shrink-0">
                <Moon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{mockShiftStats.shiftsToday.night}</p>
                <p className="text-xs text-muted-foreground">กะดึก</p>
              </div>
            </div>
          </div>

          <ScheduleGantt />

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-4 border-b border-border flex items-center justify-between lg:px-5">
              <h3 className="text-sm font-semibold text-foreground">รายการมอบหมาย Shift</h3>
              <button className="text-xs text-primary hover:underline">+ มอบหมาย Shift ใหม่</button>
            </div>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {['พนักงาน', 'แผนก', 'วันที่', 'กะ', 'เวลา'].map(col => (
                      <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockShiftAssignments.map(a => (
                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground">{a.employeeName}</p>
                        <p className="text-[10px] text-muted-foreground">{a.employeeCode}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{a.department}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{a.date}</td>
                      <td className="px-4 py-3"><ShiftTypeBadge type={a.shiftType} /></td>
                      <td className="px-4 py-3 text-xs text-foreground font-mono">{a.startTime} – {a.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile list */}
            <div className="divide-y divide-border md:hidden">
              {mockShiftAssignments.map(a => (
                <div key={a.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{a.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{a.employeeCode} · {a.department}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <ShiftTypeBadge type={a.shiftType} />
                    <p className="mt-1 text-xs font-mono text-foreground">{a.startTime}–{a.endTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
