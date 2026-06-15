import { useState } from 'react'
import {
  Users, UserCheck, UserX, UserMinus, Search,
  Plus, ChevronRight, Calendar, FileText,
  TrendingUp, AlertCircle, Clock, Building2,
  BadgeCheck, Hourglass,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  mockEmployees, mockDepartments, mockLeaveRequests, mockHrEvents, mockHrStats,
  type Employee, type LeaveRequest, type LeaveType, type HrEvent,
} from '@/mocks/hr'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
}

// ─── Status Badges ────────────────────────────────────────────────────────────
function EmployeeStatusBadge({ status }: { status: Employee['status'] }) {
  const map = {
    active:     { label: 'ปฏิบัติงาน', cls: 'bg-success-soft text-success' },
    'on-leave': { label: 'ลางาน',       cls: 'bg-warning-soft text-warning' },
    terminated: { label: 'พ้นสภาพ',     cls: 'bg-muted text-muted-foreground' },
  }
  const { label, cls } = map[status]
  return <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', cls)}>{label}</span>
}

function ContractBadge({ type }: { type: Employee['contractType'] }) {
  const map = {
    permanent:  { label: 'ประจำ',      cls: 'text-primary' },
    contract:   { label: 'สัญญาจ้าง', cls: 'text-warning' },
    probation:  { label: 'ทดลองงาน',  cls: 'text-muted-foreground' },
  }
  const { label, cls } = map[type]
  return <span className={cn('text-xs font-medium', cls)}>{label}</span>
}

function LeaveStatusBadge({ status }: { status: LeaveRequest['status'] }) {
  const map = {
    pending:  { label: 'รออนุมัติ', cls: 'bg-warning-soft text-warning' },
    approved: { label: 'อนุมัติ',   cls: 'bg-success-soft text-success' },
    rejected: { label: 'ปฏิเสธ',   cls: 'bg-destructive-soft text-destructive' },
  }
  const { label, cls } = map[status]
  return <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', cls)}>{label}</span>
}

function LeaveTypeBadge({ type }: { type: LeaveType }) {
  const map: Record<LeaveType, string> = {
    annual:    'ลาพักร้อน',
    sick:      'ลาป่วย',
    personal:  'ลากิจ',
    maternity: 'ลาคลอด',
    ordination:'ลาบวช',
  }
  return <span className="text-xs text-muted-foreground">{map[type]}</span>
}

// ─── Leave quota bar ──────────────────────────────────────────────────────────
function LeaveQuotaBar({ used, total }: { used: number; total: number }) {
  const pct = total === 0 ? 0 : ((total - used) / total) * 100
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', pct > 50 ? 'bg-success' : pct > 20 ? 'bg-warning' : 'bg-destructive')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{used}/{total}</span>
    </div>
  )
}

// ─── HR Event icon ────────────────────────────────────────────────────────────
function EventIcon({ type }: { type: HrEvent['type'] }) {
  const map = {
    'new-hire':     { icon: <UserCheck className="size-3.5" />,  cls: 'bg-success-soft text-success' },
    'resign':       { icon: <UserX className="size-3.5" />,       cls: 'bg-destructive-soft text-destructive' },
    'promote':      { icon: <TrendingUp className="size-3.5" />,  cls: 'bg-primary-soft text-primary' },
    'transfer':     { icon: <Building2 className="size-3.5" />,   cls: 'bg-accent text-accent-foreground' },
    'contract-end': { icon: <AlertCircle className="size-3.5" />, cls: 'bg-warning-soft text-warning' },
  }
  const { icon, cls } = map[type]
  return (
    <div className={cn('flex size-7 shrink-0 items-center justify-center rounded-full', cls)}>
      {icon}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, colorClass, bgClass }: {
  label: string; value: string | number; sub?: string
  icon: React.ReactNode; colorClass: string; bgClass: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', bgClass, colorClass)}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// ─── Tab types ────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'employees' | 'leave' | 'departments'

// ─── Main Page ────────────────────────────────────────────────────────────────
export function HrPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Employee['status'] | 'all'>('all')
  const [filterLeave, setFilterLeave] = useState<LeaveRequest['status'] | 'all'>('all')

  const filteredEmployees = mockEmployees.filter(e => {
    const matchStatus = filterStatus === 'all' || e.status === filterStatus
    const q = search.toLowerCase()
    return matchStatus && (!q || e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || e.department.toLowerCase().includes(q))
  })

  const filteredLeave = mockLeaveRequests.filter(l =>
    filterLeave === 'all' || l.status === filterLeave
  )

  const tabs: { key: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'overview',    label: 'ภาพรวม',  icon: <TrendingUp className="size-4" /> },
    { key: 'employees',   label: 'พนักงาน', icon: <Users className="size-4" /> },
    { key: 'leave',       label: 'ใบลา',    icon: <Calendar className="size-4" />, badge: mockHrStats.pendingLeave },
    { key: 'departments', label: 'แผนก',    icon: <Building2 className="size-4" /> },
  ]

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground lg:text-2xl">ทรัพยากรบุคคล</h1>
          <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">
            {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity lg:gap-2 lg:px-4 lg:py-2.5 lg:text-sm">
          <Plus className="size-3.5 lg:size-4" />
          <span className="hidden sm:inline">เพิ่มพนักงาน</span>
          <span className="sm:hidden">เพิ่ม</span>
        </button>
      </div>

      {/* Stat cards — 2 col on mobile, 4 on xl */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 lg:gap-4">
        <StatCard label="พนักงานทั้งหมด" value={mockHrStats.totalEmployees} sub={`ปฏิบัติงาน ${mockHrStats.active} คน`}
          icon={<Users className="size-4 lg:size-5" />} colorClass="text-primary" bgClass="bg-primary-soft" />
        <StatCard label="ลางานวันนี้" value={mockHrStats.onLeave} sub="ใบลาอนุมัติแล้ว"
          icon={<UserMinus className="size-4 lg:size-5" />} colorClass="text-warning" bgClass="bg-warning-soft" />
        <StatCard label="รออนุมัติใบลา" value={mockHrStats.pendingLeave} sub="ต้องดำเนินการ"
          icon={<Hourglass className="size-4 lg:size-5" />} colorClass="text-destructive" bgClass="bg-destructive-soft" />
        <StatCard label="สัญญาใกล้หมด" value={mockHrStats.contractEndingSoon} sub="ภายใน 30 วัน"
          icon={<AlertCircle className="size-4 lg:size-5" />} colorClass="text-warning" bgClass="bg-warning-soft" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/40 p-1">
        {tabs.map(({ key, label, icon, badge }) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:px-3 sm:text-sm',
              tab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
            {badge != null && badge > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {tab === 'overview' && (
        <div className="grid gap-4 xl:grid-cols-3">
          {/* Department breakdown */}
          <div className="xl:col-span-2 rounded-xl border border-border bg-card p-4 shadow-sm lg:p-5">
            <p className="font-semibold text-foreground">อัตรากำลังตามแผนก</p>
            <p className="mb-4 text-xs text-muted-foreground">จำนวนพนักงานแต่ละฝ่าย</p>
            <div className="space-y-3">
              {mockDepartments.map(d => {
                const pct = Math.round((d.employeeCount / mockHrStats.totalEmployees) * 100)
                return (
                  <div key={d.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex min-w-0 items-center gap-2">
                        <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-foreground">{d.name}</span>
                        <span className="hidden text-xs text-muted-foreground sm:inline">หัวหน้า: {d.headName}</span>
                      </div>
                      <span className="shrink-0 font-semibold text-foreground">{d.employeeCount} คน</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline events */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:p-5">
            <p className="font-semibold text-foreground">เหตุการณ์ HR ล่าสุด</p>
            <p className="mb-4 text-xs text-muted-foreground">การเปลี่ยนแปลงบุคลากร</p>
            <div className="relative space-y-4 pl-4 before:absolute before:left-3.5 before:top-0 before:h-full before:w-px before:bg-border">
              {mockHrEvents.map(ev => (
                <div key={ev.id} className="flex gap-3">
                  <div className="-ml-4 shrink-0">
                    <EventIcon type={ev.type} />
                  </div>
                  <div className="min-w-0 flex-1 pb-4">
                    <p className="text-sm font-medium text-foreground">{ev.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{ev.detail}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{fmtDate(ev.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Employees ── */}
      {tab === 'employees' && (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          {/* Toolbar */}
          <div className="space-y-3 border-b border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-foreground">รายชื่อพนักงาน</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ค้นหา..."
                  className="h-8 w-40 rounded-lg border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-56"
                />
              </div>
            </div>
            {/* Status filter chips */}
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'active', 'on-leave', 'terminated'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    filterStatus === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
                  )}
                >
                  {{ all: 'ทั้งหมด', active: 'ปฏิบัติงาน', 'on-leave': 'ลางาน', terminated: 'พ้นสภาพ' }[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['รหัส / ชื่อ', 'ตำแหน่ง', 'แผนก', 'ประเภท', 'วันเริ่มงาน', 'วันลาคงเหลือ', 'สถานะ', ''].map(col => (
                    <th key={col} className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map(e => (
                  <tr key={e.id} className="hover:bg-muted/30 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.code}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.position}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.department}</td>
                    <td className="px-4 py-3"><ContractBadge type={e.contractType} /></td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(e.startDate)}</td>
                    <td className="px-4 py-3"><LeaveQuotaBar used={e.annualLeaveRemaining} total={e.annualLeaveTotal} /></td>
                    <td className="px-4 py-3"><EmployeeStatusBadge status={e.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground"><ChevronRight className="size-4" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border md:hidden">
            {filteredEmployees.map(e => (
              <div key={e.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{e.name}</p>
                    <EmployeeStatusBadge status={e.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.code} · {e.department}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.position} · <ContractBadge type={e.contractType} /></p>
                  <div className="mt-1.5">
                    <LeaveQuotaBar used={e.annualLeaveRemaining} total={e.annualLeaveTotal} />
                  </div>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>

          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            แสดง {filteredEmployees.length} จาก {mockEmployees.length} รายการ
          </div>
        </div>
      )}

      {/* ── Tab: Leave ── */}
      {tab === 'leave' && (
        <div className="space-y-4">
          {/* Quick filter */}
          <div className="flex flex-wrap items-center gap-2">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
              <button key={s} onClick={() => setFilterLeave(s)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  filterLeave === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
                )}
              >
                {{ all: 'ทั้งหมด', pending: 'รออนุมัติ', approved: 'อนุมัติแล้ว', rejected: 'ปฏิเสธ' }[s]}
              </button>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden rounded-xl border border-border bg-card shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {['พนักงาน', 'แผนก', 'ประเภทการลา', 'วันที่ลา', 'จำนวน', 'เหตุผล', 'ผู้อนุมัติ', 'สถานะ'].map(col => (
                      <th key={col} className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeave.map(l => (
                    <tr key={l.id} className={cn(
                      'transition-colors',
                      l.status === 'pending' ? 'bg-warning-soft/20 hover:bg-warning-soft/30' : 'hover:bg-muted/30',
                    )}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{l.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{l.employeeCode}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{l.department}</td>
                      <td className="px-4 py-3"><LeaveTypeBadge type={l.leaveType} /></td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {fmtDate(l.startDate)}{l.days > 1 ? ` – ${fmtDate(l.endDate)}` : ''}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-foreground">{l.days} วัน</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">{l.reason}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.approvedBy ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <LeaveStatusBadge status={l.status} />
                          {l.status === 'pending' && (
                            <div className="flex gap-1">
                              <button className="rounded bg-success-soft px-2 py-0.5 text-xs font-medium text-success hover:opacity-80 transition-opacity">
                                <BadgeCheck className="inline size-3 mr-0.5" />อนุมัติ
                              </button>
                              <button className="rounded bg-destructive-soft px-2 py-0.5 text-xs font-medium text-destructive hover:opacity-80 transition-opacity">
                                ปฏิเสธ
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filteredLeave.map(l => (
              <div key={l.id} className={cn(
                'rounded-xl border border-border bg-card p-4 shadow-sm',
                l.status === 'pending' && 'border-warning/40 bg-warning-soft/10',
              )}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{l.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{l.employeeCode} · {l.department}</p>
                  </div>
                  <LeaveStatusBadge status={l.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span><LeaveTypeBadge type={l.leaveType} /></span>
                  <span>{fmtDate(l.startDate)}{l.days > 1 ? ` – ${fmtDate(l.endDate)}` : ''} ({l.days} วัน)</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{l.reason}</p>
                {l.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-lg bg-success-soft py-1.5 text-xs font-medium text-success hover:opacity-80 transition-opacity">
                      <BadgeCheck className="inline size-3 mr-0.5" />อนุมัติ
                    </button>
                    <button className="flex-1 rounded-lg bg-destructive-soft py-1.5 text-xs font-medium text-destructive hover:opacity-80 transition-opacity">
                      ปฏิเสธ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Departments ── */}
      {tab === 'departments' && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 lg:gap-4">
          {mockDepartments.map(d => {
            const deptEmployees = mockEmployees.filter(e => e.department === d.name)
            const activeCount = deptEmployees.filter(e => e.status === 'active').length
            const onLeaveCount = deptEmployees.filter(e => e.status === 'on-leave').length
            return (
              <div key={d.id} className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors cursor-pointer lg:p-5">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft">
                    <Building2 className="size-5 text-primary" />
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-3 font-semibold text-foreground">{d.name}</p>
                <p className="text-xs text-muted-foreground">หัวหน้า: {d.headName}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-foreground">
                    <Users className="size-3 text-primary" />
                    <strong>{d.employeeCount}</strong> คน
                  </span>
                  <span className="flex items-center gap-1 text-success">
                    <UserCheck className="size-3" />{activeCount} ปฏิบัติงาน
                  </span>
                  {onLeaveCount > 0 && (
                    <span className="flex items-center gap-1 text-warning">
                      <Clock className="size-3" />{onLeaveCount} ลา
                    </span>
                  )}
                </div>
                {deptEmployees.length > 0 && (
                  <div className="mt-3 flex -space-x-1.5">
                    {deptEmployees.slice(0, 5).map(e => (
                      <div
                        key={e.id}
                        title={e.name}
                        className={cn(
                          'flex size-6 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white',
                          e.status === 'active' ? 'bg-primary' : e.status === 'on-leave' ? 'bg-warning' : 'bg-muted-foreground',
                        )}
                      >
                        {e.name.charAt(0)}
                      </div>
                    ))}
                    {deptEmployees.length > 5 && (
                      <div className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] text-muted-foreground">
                        +{deptEmployees.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
