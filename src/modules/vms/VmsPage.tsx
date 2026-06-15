import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Download,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockVisitors, mockStats, mockHourlyData, type Visitor } from '@/mocks/visitors'

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  colorClass: string
  bgClass: string
  sub?: string
}

function StatCard({ label, value, icon, colorClass, bgClass, sub }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {sub && <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{sub}</p>}
        </div>
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', bgClass, colorClass)}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Visitor['status'] }) {
  const { t } = useTranslation()
  const map = {
    'checked-in':  { label: t('vms.checkedIn'),  className: 'bg-success-soft text-success' },
    'checked-out': { label: t('vms.checkedOut'), className: 'bg-muted text-muted-foreground' },
    'pending':     { label: t('vms.pending'),    className: 'bg-warning-soft text-warning' },
  }
  const { label, className } = map[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
      {label}
    </span>
  )
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function HourlyChart() {
  const max = Math.max(...mockHourlyData.map(d => d.count))
  return (
    <div className="flex h-24 items-end gap-1">
      {mockHourlyData.map(d => (
        <div key={d.hour} className="group relative flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-sm bg-primary/20 transition-all group-hover:bg-primary/40"
            style={{ height: `${(d.count / max) * 100}%` }}
          />
          <div className="absolute -top-7 hidden rounded bg-foreground px-1.5 py-0.5 text-xs text-background group-hover:block whitespace-nowrap">
            {d.hour}: {d.count}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function VmsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Visitor['status'] | 'all'>('all')

  const filtered = mockVisitors.filter(v => {
    const matchStatus = filterStatus === 'all' || v.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.company.toLowerCase().includes(q) ||
      v.purpose.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const todayStr = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground lg:text-2xl">{t('nav.vms')}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">{todayStr}</p>
        </div>
        <button className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity lg:px-4 lg:py-2.5 lg:text-sm">
          <Plus className="size-3.5 lg:size-4" />
          <span className="hidden sm:inline">{t('vms.registerVisitor')}</span>
          <span className="sm:hidden">เพิ่ม</span>
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 lg:gap-4">
        <StatCard
          label={t('vms.totalToday')}
          value={mockStats.totalToday}
          icon={<Users className="size-4 lg:size-5" />}
          colorClass="text-primary"
          bgClass="bg-primary-soft"
          sub={`${t('vms.thisWeek')}: ${mockStats.totalThisWeek}`}
        />
        <StatCard
          label={t('vms.checkedIn')}
          value={mockStats.checkedIn}
          icon={<UserCheck className="size-4 lg:size-5" />}
          colorClass="text-success"
          bgClass="bg-success-soft"
          sub={t('vms.currentlyInside')}
        />
        <StatCard
          label={t('vms.checkedOut')}
          value={mockStats.checkedOut}
          icon={<UserX className="size-4 lg:size-5" />}
          colorClass="text-muted-foreground"
          bgClass="bg-muted"
        />
        <StatCard
          label={t('vms.pending')}
          value={mockStats.pending}
          icon={<Clock className="size-4 lg:size-5" />}
          colorClass="text-warning"
          bgClass="bg-warning-soft"
          sub={t('vms.waitingApproval')}
        />
      </div>

      {/* Chart + summary row */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Hourly traffic */}
        <div className="xl:col-span-2 rounded-xl border border-border bg-card p-4 shadow-sm lg:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">{t('vms.hourlyTraffic')}</p>
              <p className="text-xs text-muted-foreground">{t('vms.visitorsByHour')}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              <TrendingUp className="size-3" />
              {t('vms.peakHour')}: {mockStats.peakHour}
            </div>
          </div>
          <HourlyChart />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {mockHourlyData.filter((_, i) => i % 2 === 0).map(d => (
              <span key={d.hour}>{d.hour}</span>
            ))}
          </div>
        </div>

        {/* Monthly summary */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:p-5">
          <p className="font-semibold text-foreground">{t('vms.summary')}</p>
          <p className="mb-4 text-xs text-muted-foreground">{t('vms.thisMonth')}</p>
          <div className="space-y-3">
            {[
              { label: t('vms.totalToday'),  value: mockStats.totalToday,      pct: 100 },
              { label: t('vms.thisWeek'),     value: mockStats.totalThisWeek,   pct: 72 },
              { label: t('vms.thisMonth'),    value: mockStats.totalThisMonth,  pct: 48 },
            ].map(item => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visitor list */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="space-y-3 border-b border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-foreground">{t('vms.visitorList')}</p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('vms.searchPlaceholder')}
                  className="h-8 w-36 rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-52"
                />
              </div>
              <button className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors sm:flex">
                <Download className="size-3.5" />
                {t('vms.export')}
              </button>
            </div>
          </div>
          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Filter className="size-3.5 shrink-0 text-muted-foreground" />
            {(['all', 'checked-in', 'pending', 'checked-out'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  filterStatus === s
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent',
                )}
              >
                {s === 'all' ? t('vms.all') : s === 'checked-in' ? t('vms.checkedIn') : s === 'pending' ? t('vms.pending') : t('vms.checkedOut')}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {[t('vms.col.name'), t('vms.col.company'), t('vms.col.purpose'), t('vms.col.host'), t('vms.col.floor'), t('vms.col.checkIn'), t('vms.col.checkOut'), t('vms.col.status')].map(col => (
                  <th key={col} className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    {t('vms.noResults')}
                  </td>
                </tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-medium text-foreground">{v.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.company}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.purpose}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.host}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.floor}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(v.checkIn).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {v.checkOut
                        ? new Date(v.checkOut).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-border md:hidden">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{t('vms.noResults')}</p>
          ) : filtered.map(v => (
            <div key={v.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{v.name}</p>
                  <StatusBadge status={v.status} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{v.company} · {v.purpose}</p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>พบ: {v.host} ชั้น {v.floor}</span>
                  <span>เข้า: {new Date(v.checkIn).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                  {v.checkOut && <span>ออก: {new Date(v.checkOut).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>}
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>{t('vms.showing', { count: filtered.length, total: mockVisitors.length })}</span>
        </div>
      </div>
    </div>
  )
}
