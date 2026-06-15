import { useState } from 'react'
import {
  BookOpen, TrendingUp, AlertTriangle,
  Search, CheckCircle2, XCircle, Clock, Calendar,
  ChevronRight, BarChart2, ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  mockCourses, mockEnrollments, mockTrainingEvents, mockTrainingStats,
  type Course, type CourseCategory, type EnrollmentStatus,
} from '@/mocks/training'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<CourseCategory, { label: string; cls: string }> = {
  safety:     { label: 'ความปลอดภัย',   cls: 'bg-success-soft text-success' },
  security:   { label: 'รักษาความปลอดภัย', cls: 'bg-primary-soft text-primary' },
  fire:       { label: 'ดับเพลิง',      cls: 'bg-destructive-soft text-destructive' },
  'first-aid':{ label: 'ปฐมพยาบาล',    cls: 'bg-warning-soft text-warning' },
  compliance: { label: 'กฎหมาย/ระเบียบ', cls: 'bg-muted text-muted-foreground' },
  technical:  { label: 'เทคนิค',        cls: 'bg-secondary text-secondary-foreground' },
}

const ENROLLMENT_STATUS_MAP: Record<EnrollmentStatus, { label: string; cls: string; icon: React.ElementType }> = {
  enrolled:    { label: 'ลงทะเบียน',    cls: 'bg-muted text-muted-foreground',         icon: Calendar },
  'in-progress':{ label: 'กำลังเรียน',  cls: 'bg-primary-soft text-primary',           icon: Clock },
  completed:   { label: 'ผ่านแล้ว',     cls: 'bg-success-soft text-success',           icon: CheckCircle2 },
  failed:      { label: 'ไม่ผ่าน',      cls: 'bg-destructive-soft text-destructive',   icon: XCircle },
  cancelled:   { label: 'ยกเลิก',       cls: 'bg-muted text-muted-foreground',         icon: XCircle },
}

function CategoryBadge({ category }: { category: CourseCategory }) {
  const { label, cls } = CATEGORY_MAP[category]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', cls)}>
      {label}
    </span>
  )
}

function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus }) {
  const { label, cls, icon: Icon } = ENROLLMENT_STATUS_MAP[status]
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cls)}>
      <Icon className="size-3" />
      {label}
    </span>
  )
}

function ScorePill({ score, passingScore }: { score: number | null; passingScore: number }) {
  if (score === null) return <span className="text-xs text-muted-foreground">—</span>
  const pass = score >= passingScore
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold',
      pass ? 'text-success' : 'text-destructive')}>
      {score}
      {pass ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
    </span>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

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
    default: 'bg-card border border-border',
    primary: 'bg-primary-soft border border-primary/20',
    success: 'bg-success-soft border border-success/20',
    warning: 'bg-warning-soft border border-warning/20',
    danger:  'bg-destructive-soft border border-destructive/20',
  }[variant]
  const iconCls = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger:  'bg-destructive/10 text-destructive',
  }[variant]

  return (
    <div className={cn('rounded-xl p-4 flex flex-col gap-3', variantCls)}>
      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-lg', iconCls)}>
          <Icon className="size-4" />
        </div>
        {trend && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium',
            trend.up ? 'text-success' : 'text-destructive')}>
            <ArrowUpRight className="size-3" />
            {trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const completionRate = course.enrolledCount > 0
    ? Math.round((course.completedCount / course.enrolledCount) * 100)
    : 0
  const fillRate = Math.round((course.enrolledCount / course.maxEnrollment) * 100)

  return (
    <div className={cn(
      'bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow',
      course.status === 'draft' && 'opacity-70',
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-mono text-muted-foreground">{course.code}</span>
            <CategoryBadge category={course.category} />
            {course.status === 'draft' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">DRAFT</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug">{course.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
        </div>
      </div>

      {/* Completion bar */}
      <div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span>ผ่านหลักสูตร</span>
          <span className="font-medium text-foreground">{course.completedCount}/{course.enrolledCount}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', completionRate >= 80 ? 'bg-success' : completionRate >= 50 ? 'bg-warning' : 'bg-destructive')}
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">{completionRate}% อัตราการผ่าน</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs border-t border-border pt-3">
        <div>
          <p className="text-muted-foreground">ระยะเวลา</p>
          <p className="font-medium text-foreground">{course.durationHours} ชั่วโมง</p>
        </div>
        <div>
          <p className="text-muted-foreground">คะแนนผ่าน</p>
          <p className="font-medium text-foreground">{course.passingScore}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">วิทยากร</p>
          <p className="font-medium text-foreground truncate">{course.instructorName}</p>
        </div>
        <div>
          <p className="text-muted-foreground">ผู้เรียน</p>
          <p className="font-medium text-foreground">{course.enrolledCount}/{course.maxEnrollment}
            <span className="text-[10px] text-muted-foreground ml-1">({fillRate}%)</span>
          </p>
        </div>
      </div>

      {course.nextSessionDate && (
        <div className="flex items-center gap-1.5 text-xs text-primary bg-primary-soft rounded-lg px-3 py-2">
          <Calendar className="size-3 shrink-0" />
          <span>รอบถัดไป: {course.nextSessionDate}</span>
        </div>
      )}
    </div>
  )
}

// ─── Upcoming Events ─────────────────────────────────────────────────────────

function UpcomingEvents() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">ตารางอบรมที่กำลังจะมาถึง</h3>
        <button className="text-xs text-primary hover:underline flex items-center gap-0.5">
          ดูทั้งหมด <ChevronRight className="size-3" />
        </button>
      </div>
      <div className="space-y-3">
        {mockTrainingEvents.map(ev => {
          const fillRate = Math.round((ev.enrolledCount / ev.maxEnrollment) * 100)
          const isFull = ev.enrolledCount >= ev.maxEnrollment
          return (
            <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div className="shrink-0 w-10 text-center">
                <p className="text-[10px] text-muted-foreground">{ev.scheduledDate.slice(5, 7)}/{ev.scheduledDate.slice(0, 4).slice(2)}</p>
                <p className="text-lg font-bold text-primary leading-none">{ev.scheduledDate.slice(8)}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-xs font-semibold text-foreground">{ev.courseName}</p>
                  <CategoryBadge category={ev.category} />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {ev.startTime}–{ev.endTime} · {ev.location} · วิทยากร: {ev.instructorName}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', isFull ? 'bg-destructive' : fillRate > 70 ? 'bg-warning' : 'bg-success')}
                      style={{ width: `${fillRate}%` }}
                    />
                  </div>
                  <span className={cn('text-[10px] font-medium shrink-0', isFull ? 'text-destructive' : 'text-muted-foreground')}>
                    {ev.enrolledCount}/{ev.maxEnrollment} {isFull ? '(เต็ม)' : ''}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Pass Rate Chart ─────────────────────────────────────────────────────────

function PassRateChart() {
  const categories = Object.entries(CATEGORY_MAP) as [CourseCategory, { label: string; cls: string }][]
  const data = categories.map(([cat, meta]) => {
    const catEnrollments = mockEnrollments.filter(e => e.category === cat)
    const total = catEnrollments.length
    const passed = catEnrollments.filter(e => e.status === 'completed').length
    return { cat, label: meta.label, total, passed, rate: total > 0 ? Math.round((passed / total) * 100) : 0 }
  }).filter(d => d.total > 0)

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">อัตราผ่านรายหมวด</h3>
      </div>
      <div className="space-y-3">
        {data.sort((a, b) => b.rate - a.rate).map(d => (
          <div key={d.cat}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-foreground font-medium">{d.label}</span>
              <span className={cn('font-semibold', d.rate >= 80 ? 'text-success' : d.rate >= 60 ? 'text-warning' : 'text-destructive')}>
                {d.rate}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', d.rate >= 80 ? 'bg-success' : d.rate >= 60 ? 'bg-warning' : 'bg-destructive')}
                style={{ width: `${d.rate}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{d.passed}/{d.total} คน</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'courses' | 'enrollments'

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',    label: 'ภาพรวม' },
  { id: 'courses',     label: 'หลักสูตร' },
  { id: 'enrollments', label: 'ประวัติการอบรม' },
]

export function TrainingPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [searchQ, setSearchQ]     = useState('')
  const [filterCat, setFilterCat] = useState<CourseCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<EnrollmentStatus | 'all'>('all')

  const filteredEnrollments = mockEnrollments.filter(e => {
    const matchQ = searchQ === '' ||
      e.employeeName.includes(searchQ) ||
      e.employeeCode.toLowerCase().includes(searchQ.toLowerCase()) ||
      e.courseName.includes(searchQ)
    const matchCat    = filterCat    === 'all' || e.category === filterCat
    const matchStatus = filterStatus === 'all' || e.status   === filterStatus
    return matchQ && matchCat && matchStatus
  })

  const filteredCourses = mockCourses.filter(c => {
    const matchQ   = searchQ === '' || c.name.includes(searchQ) || c.code.toLowerCase().includes(searchQ.toLowerCase())
    const matchCat = filterCat === 'all' || c.category === filterCat
    return matchQ && matchCat
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Training Course</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            จัดการหลักสูตรและติดตามผลการอบรม · อัปเดต 15 มิ.ย. 2026
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors">
          <BookOpen className="size-4" />
          + เพิ่มหลักสูตร
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="หลักสูตรทั้งหมด"
          value={mockTrainingStats.totalCourses}
          sub={`${mockTrainingStats.activeCourses} หลักสูตรที่เปิดใช้`}
          icon={BookOpen}
          variant="primary"
        />
        <StatCard
          label="ผ่านเดือนนี้"
          value={mockTrainingStats.completedThisMonth}
          sub="คน (ผ่านการอบรม)"
          icon={CheckCircle2}
          variant="success"
          trend={{ value: 8, up: true }}
        />
        <StatCard
          label="อัตราผ่าน"
          value={`${mockTrainingStats.passRate}%`}
          sub="รวมทุกหลักสูตร"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          label="ใบรับรองหมดอายุเร็วๆ นี้"
          value={mockTrainingStats.expiringSoon}
          sub="ภายใน 30 วัน"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
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
          {/* Summary row */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Quick stats */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">สรุปภาพรวม</h3>
              <div className="space-y-3">
                {[
                  { label: 'ลงทะเบียนทั้งหมด',  value: mockTrainingStats.totalEnrollments, color: 'text-foreground' },
                  { label: 'กำลังอบรม',          value: mockTrainingStats.inProgressCount,  color: 'text-primary' },
                  { label: 'ผ่านแล้ว (รวม)',     value: mockTrainingStats.completedThisMonth + 35, color: 'text-success' },
                  { label: 'ใบรับรองที่ออก',     value: mockTrainingStats.certificatesIssued, color: 'text-foreground' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={cn('text-sm font-semibold', item.color)}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-2">สถานะการอบรม</p>
                {(['completed', 'in-progress', 'enrolled', 'failed'] as EnrollmentStatus[]).map(s => {
                  const count = mockEnrollments.filter(e => e.status === s).length
                  const pct   = Math.round(count / mockEnrollments.length * 100)
                  const { label, cls } = ENROLLMENT_STATUS_MAP[s]
                  return (
                    <div key={s} className="flex items-center gap-2 mb-1.5">
                      <div className="w-16 shrink-0">
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', cls)}>{label}</span>
                      </div>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-current rounded-full opacity-50" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pass rate chart */}
            <PassRateChart />

            {/* Upcoming events */}
            <UpcomingEvents />
          </div>

          {/* Certificates expiring */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning" />
                <h3 className="text-sm font-semibold text-foreground">ใบรับรองที่ใกล้หมดอายุ (ภายใน 365 วัน)</h3>
              </div>
            </div>
            <div className="divide-y divide-border">
              {mockEnrollments.filter(e => e.expiresAt !== null).map(e => {
                const daysLeft = Math.round(
                  (new Date(e.expiresAt!).getTime() - new Date('2026-06-15').getTime()) / 86400000
                )
                const urgent = daysLeft <= 90
                return (
                  <div key={e.id} className={cn('flex items-center gap-4 px-5 py-3', urgent && 'bg-warning-soft/30')}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{e.employeeName}
                        <span className="text-[10px] text-muted-foreground ml-2">{e.employeeCode}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">{e.courseName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn('text-xs font-semibold', urgent ? 'text-warning' : 'text-muted-foreground')}>
                        {urgent ? `เหลือ ${daysLeft} วัน` : e.expiresAt}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{e.certificateNo}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Courses ──────────────────────────────────────────── */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="ค้นหาหลักสูตร, รหัส..."
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value as CourseCategory | 'all')}
              className="text-sm px-3 py-1.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="all">หมวดทั้งหมด</option>
              {(Object.entries(CATEGORY_MAP) as [CourseCategory, { label: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground">
              ไม่พบหลักสูตรที่ตรงกับการค้นหา
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {filteredCourses.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Enrollments ──────────────────────────────────────── */}
      {activeTab === 'enrollments' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="ค้นหาชื่อ, รหัส, หลักสูตร..."
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value as CourseCategory | 'all')}
              className="text-sm px-3 py-1.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="all">หมวดทั้งหมด</option>
              {(Object.entries(CATEGORY_MAP) as [CourseCategory, { label: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as EnrollmentStatus | 'all')}
              className="text-sm px-3 py-1.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="completed">ผ่านแล้ว</option>
              <option value="in-progress">กำลังเรียน</option>
              <option value="enrolled">ลงทะเบียน</option>
              <option value="failed">ไม่ผ่าน</option>
            </select>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">พนักงาน</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">หลักสูตร</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">หมวด</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">วันที่อบรม</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">คะแนน</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">สถานะ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ใบรับรอง</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">หมดอายุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                        ไม่พบข้อมูลที่ตรงกับการค้นหา
                      </td>
                    </tr>
                  ) : filteredEnrollments.map(e => (
                    <tr key={e.id} className={cn(
                      'hover:bg-muted/30 transition-colors',
                      e.status === 'failed' && 'bg-destructive-soft/10',
                    )}>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground">{e.employeeName}</p>
                        <p className="text-[10px] text-muted-foreground">{e.employeeCode} · {e.department}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-foreground">{e.courseName}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{e.courseCode}</p>
                      </td>
                      <td className="px-4 py-3"><CategoryBadge category={e.category} /></td>
                      <td className="px-4 py-3 text-xs text-foreground">
                        {e.completedAt ?? e.startedAt ?? e.enrolledAt}
                      </td>
                      <td className="px-4 py-3">
                        <ScorePill score={e.score} passingScore={e.passingScore} />
                        <p className="text-[10px] text-muted-foreground">เกณฑ์: {e.passingScore}</p>
                      </td>
                      <td className="px-4 py-3"><EnrollmentStatusBadge status={e.status} /></td>
                      <td className="px-4 py-3">
                        {e.certificateNo
                          ? <span className="text-[10px] font-mono text-success">{e.certificateNo}</span>
                          : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {e.expiresAt
                          ? (() => {
                              const days = Math.round((new Date(e.expiresAt).getTime() - new Date('2026-06-15').getTime()) / 86400000)
                              return (
                                <span className={cn('font-medium', days <= 90 ? 'text-warning' : 'text-muted-foreground')}>
                                  {e.expiresAt}
                                </span>
                              )
                            })()
                          : <span className="text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">แสดง {filteredEnrollments.length} รายการ</p>
              <p className="text-xs text-muted-foreground">
                ผ่าน: {filteredEnrollments.filter(e => e.status === 'completed').length} ·
                ไม่ผ่าน: {filteredEnrollments.filter(e => e.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
