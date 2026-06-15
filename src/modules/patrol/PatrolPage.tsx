import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Shield,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Activity,
  ChevronRight,
  CircleDot,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  mockGuards,
  mockRounds,
  mockIncidents,
  mockPatrolStats,
  type Guard,
  type PatrolRound,
  type Incident,
  type IncidentSeverity,
} from '@/mocks/patrol'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

// ─── Guard Status Badge ───────────────────────────────────────────────────────
function GuardStatusBadge({ status }: { status: Guard['status'] }) {
  const map = {
    'on-duty':  { label: 'ปฏิบัติหน้าที่', dot: 'bg-success', text: 'text-success' },
    'break':    { label: 'พักงาน',          dot: 'bg-warning', text: 'text-warning' },
    'off-duty': { label: 'หยุดงาน',         dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
  }
  const { label, dot, text } = map[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', text)}>
      <span className={cn('size-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}

// ─── Round Status Badge ───────────────────────────────────────────────────────
function RoundBadge({ status }: { status: PatrolRound['status'] }) {
  const map = {
    'completed':   { label: 'สำเร็จ',      cls: 'bg-success-soft text-success' },
    'in-progress': { label: 'กำลังตรวจ',   cls: 'bg-primary-soft text-primary' },
    'missed':      { label: 'พลาด',         cls: 'bg-destructive-soft text-destructive' },
    'upcoming':    { label: 'รอดำเนินการ', cls: 'bg-muted text-muted-foreground' },
  }
  const { label, cls } = map[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', cls)}>
      {label}
    </span>
  )
}

// ─── Incident Badge ───────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  const map = {
    high:   { label: 'สูง',    cls: 'bg-destructive-soft text-destructive' },
    medium: { label: 'กลาง',   cls: 'bg-warning-soft text-warning' },
    low:    { label: 'ต่ำ',    cls: 'bg-success-soft text-success' },
  }
  const { label, cls } = map[severity]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', cls)}>
      {label}
    </span>
  )
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ value, max, size = 56 }: { value: number; max: number; size?: number }) {
  const pct = max === 0 ? 0 : value / max
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - pct)
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={4} className="text-muted" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="currentColor" strokeWidth={4} strokeDasharray={circ}
        strokeDashoffset={dash} strokeLinecap="round"
        className="text-primary transition-all duration-500"
      />
    </svg>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, colorClass, bgClass }: {
  label: string; value: string | number; sub?: string
  icon: React.ReactNode; colorClass: string; bgClass: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={cn('flex size-11 items-center justify-center rounded-xl', bgClass, colorClass)}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// ─── Guard Card ───────────────────────────────────────────────────────────────
function GuardCard({ guard }: { guard: Guard }) {
  const pct = Math.round((guard.roundsToday / guard.roundsTarget) * 100)
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors cursor-pointer">
      {/* Avatar + ring */}
      <div className="relative shrink-0">
        <ProgressRing value={guard.roundsToday} max={guard.roundsTarget} size={52} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary">{pct}%</span>
        </div>
      </div>
      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{guard.name}</p>
          <GuardStatusBadge status={guard.status} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{guard.code} · {guard.zone}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-success" />
            {guard.roundsToday}/{guard.roundsTarget} รอบ
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {fmt(guard.lastSeen)}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="size-3" />
            {guard.phone}
          </span>
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </div>
  )
}

// ─── Incident Row ─────────────────────────────────────────────────────────────
function IncidentRow({ inc }: { inc: Incident }) {
  return (
    <div className={cn(
      'flex gap-3 rounded-lg border p-3 transition-colors',
      inc.isResolved ? 'border-border bg-muted/20' : 'border-destructive/20 bg-destructive-soft/30',
    )}>
      <AlertTriangle className={cn('mt-0.5 size-4 shrink-0', inc.isResolved ? 'text-muted-foreground' : 'text-destructive')} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={inc.severity} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />{inc.zone}
          </span>
          <span className="text-xs text-muted-foreground">{fmt(inc.reportedAt)}</span>
          {inc.isResolved && (
            <span className="text-xs text-success">แก้ไขแล้ว</span>
          )}
        </div>
        <p className="mt-1 text-sm text-foreground">{inc.description}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">รายงานโดย: {inc.reportedBy}</p>
      </div>
    </div>
  )
}

// ─── Tab types ────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'guards' | 'rounds' | 'incidents'

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PatrolPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('overview')

  const s = mockPatrolStats
  const roundPct = Math.round((s.roundsCompleted / s.roundsTotal) * 100)

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview',  label: 'ภาพรวม',        icon: <Activity className="size-4" /> },
    { key: 'guards',    label: 'เจ้าหน้าที่',    icon: <Users className="size-4" /> },
    { key: 'rounds',    label: 'รายการตรวจ',     icon: <CircleDot className="size-4" /> },
    { key: 'incidents', label: 'เหตุการณ์',      icon: <AlertTriangle className="size-4" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.patrol')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-success/40 bg-success-soft px-3 py-1 text-xs font-medium text-success">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            ระบบทำงานปกติ
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="เจ้าหน้าที่ปฏิบัติหน้าที่"
          value={`${s.guardsOnDuty}/${s.guardsTotal}`}
          sub="กำลังลาดตระเวน"
          icon={<Shield className="size-5" />}
          colorClass="text-primary"
          bgClass="bg-primary-soft"
        />
        <StatCard
          label="รอบตรวจสำเร็จ"
          value={`${s.roundsCompleted}/${s.roundsTotal}`}
          sub={`${roundPct}% ของเป้าหมาย`}
          icon={<CheckCircle2 className="size-5" />}
          colorClass="text-success"
          bgClass="bg-success-soft"
        />
        <StatCard
          label="รอบตรวจพลาด"
          value={s.missedRounds}
          sub="ต้องตรวจสอบ"
          icon={<XCircle className="size-5" />}
          colorClass="text-destructive"
          bgClass="bg-destructive-soft"
        />
        <StatCard
          label="เหตุการณ์เปิดอยู่"
          value={s.incidentsOpen}
          sub={`จากทั้งหมด ${s.incidents} เหตุการณ์`}
          icon={<AlertTriangle className="size-5" />}
          colorClass="text-warning"
          bgClass="bg-warning-soft"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/40 p-1">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
              tab === key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {icon}
            <span className="hidden ms:inline">{label}</span>
            {key === 'incidents' && s.incidentsOpen > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {s.incidentsOpen}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {tab === 'overview' && (
        <div className="grid gap-4 xl:grid-cols-3">
          {/* Zone map placeholder */}
          <div className="xl:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="font-semibold text-foreground">แผนที่โซนลาดตระเวน</p>
            <p className="mb-4 text-xs text-muted-foreground">สถานะแต่ละโซนแบบ realtime</p>
            <div className="grid grid-cols-1 gap-3 ms:grid-cols-2">
              {[
                { zone: 'โซน A', label: 'ประตูหน้า', guards: 2, status: 'on-duty' as const, lastRound: '11:45' },
                { zone: 'โซน B', label: 'อาคาร 1-3', guards: 1, status: 'on-duty' as const, lastRound: '11:18' },
                { zone: 'โซน C', label: 'ที่จอดรถ', guards: 1, status: 'break' as const, lastRound: '10:30' },
                { zone: 'โซน D', label: 'โกดัง', guards: 1, status: 'on-duty' as const, lastRound: '11:35' },
                { zone: 'โซน E', label: 'หลังอาคาร', guards: 0, status: 'off-duty' as const, lastRound: '07:00' },
              ].map(z => (
                <div
                  key={z.zone}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3',
                    z.status === 'on-duty' ? 'border-success/30 bg-success-soft/30'
                      : z.status === 'break' ? 'border-warning/30 bg-warning-soft/30'
                      : 'border-border bg-muted/30',
                  )}
                >
                  <div className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-lg font-bold text-sm',
                    z.status === 'on-duty' ? 'bg-success-soft text-success'
                      : z.status === 'break' ? 'bg-warning-soft text-warning'
                      : 'bg-muted text-muted-foreground',
                  )}>
                    {z.zone.split(' ')[1]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{z.zone} · {z.label}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span><Users className="inline size-3 mr-0.5" />{z.guards} คน</span>
                      <span><Clock className="inline size-3 mr-0.5" />ตรวจล่าสุด {z.lastRound}</span>
                    </div>
                  </div>
                  <GuardStatusBadge status={z.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Open incidents summary */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-foreground">เหตุการณ์ล่าสุด</p>
              <span className="rounded-full bg-destructive-soft px-2 py-0.5 text-xs font-medium text-destructive">
                {s.incidentsOpen} เปิดอยู่
              </span>
            </div>
            <div className="space-y-3">
              {mockIncidents.map(inc => <IncidentRow key={inc.id} inc={inc} />)}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Guards ── */}
      {tab === 'guards' && (
        <div className="grid gap-3 xl:grid-cols-2">
          {mockGuards.map(g => <GuardCard key={g.id} guard={g} />)}
        </div>
      )}

      {/* ── Tab: Rounds ── */}
      {tab === 'rounds' && (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-4">
            <p className="font-semibold text-foreground">รายการตรวจวันนี้</p>
            <p className="text-xs text-muted-foreground">สำเร็จ {s.roundsCompleted} / {s.roundsTotal} รอบ</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['เจ้าหน้าที่', 'โซน', 'จุดตรวจ', 'กำหนดการ', 'ตรวจเสร็จ', 'หมายเหตุ', 'สถานะ'].map(col => (
                    <th key={col} className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockRounds.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{r.guardName}</p>
                      <p className="text-xs text-muted-foreground">{r.guardCode}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.zone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.checkpoint}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmt(r.scheduledAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {r.completedAt ? fmt(r.completedAt) : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.note ?? <span className="text-muted-foreground/40">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <RoundBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Incidents ── */}
      {tab === 'incidents' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              ทั้งหมด {mockIncidents.length} เหตุการณ์ · เปิดอยู่ {s.incidentsOpen}
            </p>
          </div>
          {mockIncidents.map(inc => <IncidentRow key={inc.id} inc={inc} />)}
        </div>
      )}
    </div>
  )
}
