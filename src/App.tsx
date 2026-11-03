import { lazy, Suspense, useEffect, useState } from 'react'
import { CalendarRange, FileText, FolderOpen, Inbox, Moon, Sun, type LucideIcon } from 'lucide-react'
import { campaigns, requests as seedRequests, weeklyMetrics, type MarketingRequest } from './data'
import Calendar from './Calendar'
import Intake from './Intake'
import Assets from './Assets'
import { Mono } from './ui'

const WeeklyUpdate = lazy(() => import('./WeeklyUpdate'))

type TabKey = 'calendar' | 'intake' | 'assets' | 'update'

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'calendar', label: 'Campaign calendar', icon: CalendarRange },
  { key: 'intake', label: 'Request intake', icon: Inbox },
  { key: 'assets', label: 'Asset library', icon: FolderOpen },
  { key: 'update', label: 'Weekly update', icon: FileText },
]

function tabFromHash(): TabKey {
  const key = window.location.hash.replace(/^#\/?/, '')
  return TABS.some((t) => t.key === key) ? (key as TabKey) : 'calendar'
}

function useHashTab(): TabKey {
  const [tab, setTab] = useState<TabKey>(tabFromHash)
  useEffect(() => {
    const onChange = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return tab
}

function useTheme(): [boolean, () => void] {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  const toggle = () => {
    const next = !dark
    setDark(next)
    try {
      localStorage.setItem('mcc-theme', next ? 'dark' : 'light')
    } catch {
      // Theme still switches for this visit.
    }
  }
  return [dark, toggle]
}

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function SummaryStrip({ queue }: { queue: MarketingRequest[] }) {
  const byStage = (stage: string) => campaigns.filter((c) => c.stage === stage)
  const running = byStage('running')
  const flagged = running.filter((c) => c.status === 'Blocked' || c.status === 'At risk').length
  const openRequests = queue.filter((r) => r.status !== 'Done')
  const openHigh = openRequests.filter((r) => r.priority === 'High').length
  const latest = weeklyMetrics[weeklyMetrics.length - 1]

  const stats: { label: string; value: string; sub: string }[] = [
    { label: 'Running now', value: String(running.length), sub: `${flagged} need attention` },
    { label: 'Up next', value: String(byStage('next').length), sub: 'Next 6 weeks' },
    { label: 'On deck', value: String(byStage('deck').length), sub: 'Next quarter' },
    { label: 'Open requests', value: String(openRequests.length), sub: `${openHigh} high priority` },
    {
      label: 'On-time launches (last 6 weeks)',
      value: `${Math.round(average(weeklyMetrics.map((w) => w.onTime)))}%`,
      sub: `${latest.onTime}% last week`,
    },
    {
      label: 'Average request turnaround',
      value: `${average(weeklyMetrics.map((w) => w.turnaround)).toFixed(1)} days`,
      sub: `${latest.turnaround.toFixed(1)} days last week`,
    },
  ]

  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 xl:grid-cols-6" style={{ gap: 1 }}>
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col bg-surface px-4 py-3">
          <dt className="text-[11px] leading-tight font-semibold tracking-wide text-muted uppercase">{s.label}</dt>
          <dd className="mt-auto pt-1.5 font-mono text-2xl font-medium text-ink">{s.value}</dd>
          <dd className="text-xs text-muted">{s.sub}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function App() {
  const tab = useHashTab()
  const [dark, toggleTheme] = useTheme()
  const [queue, setQueue] = useState<MarketingRequest[]>(seedRequests)

  useEffect(() => {
    const label = TABS.find((t) => t.key === tab)?.label
    document.title = tab === 'calendar' ? 'Marketing Command Center' : `${label} · Marketing Command Center`
  }, [tab])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-2 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden>
                  <rect width="32" height="32" rx="7" className="fill-accent" />
                  <rect x="7" y="7" width="8" height="8" rx="1.5" fill="#fff" />
                  <rect x="17" y="7" width="8" height="8" rx="1.5" fill="#fff" opacity=".55" />
                  <rect x="7" y="17" width="8" height="8" rx="1.5" fill="#fff" opacity=".55" />
                  <rect x="17" y="17" width="8" height="8" rx="1.5" fill="#fff" />
                </svg>
                <h1 className="text-lg font-bold tracking-tight text-ink">Marketing Command Center</h1>
              </div>
              <span className="inline-flex items-center rounded-full border border-dashed border-faint px-2 py-0.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
                Sample data
              </span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line text-muted transition hover:border-accent hover:text-accent-text"
            >
              {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
            </button>
          </div>
          <p className="text-[13px] text-muted">
            A working concept for Wonderlic's Marketing Program Manager role. Built by Arun Raju Nandyala, November 2026.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[88rem] flex-1 px-4 py-5 sm:px-6">
        <SummaryStrip queue={queue} />

        <nav aria-label="Sections" className="mt-5 mb-4 border-b border-line">
          <ul className="-mb-px grid grid-cols-2 sm:flex sm:gap-1">
            {TABS.map(({ key, label, icon: Icon }) => {
              const active = key === tab
              return (
                <li key={key}>
                  <a
                    href={`#/${key}`}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition ${
                      active
                        ? 'border-accent text-accent-text'
                        : 'border-transparent text-muted hover:border-line hover:text-ink'
                    }`}
                  >
                    <Icon size={16} aria-hidden />
                    {label}
                    {key === 'intake' && (
                      <Mono className="rounded bg-surface-2 px-1 text-[11px] text-muted ring-1 ring-line">
                        {queue.filter((r) => r.status !== 'Done').length}
                      </Mono>
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {tab === 'calendar' && <Calendar />}
        {tab === 'intake' && <Intake queue={queue} onAdd={(r) => setQueue((q) => [...q, r])} />}
        {tab === 'assets' && <Assets />}
        {tab === 'update' && (
          <Suspense fallback={<p className="py-10 text-center text-sm text-muted">Loading update…</p>}>
            <WeeklyUpdate dark={dark} />
          </Suspense>
        )}
      </main>

      <footer className="border-t border-line bg-surface">
        <p className="mx-auto max-w-[88rem] px-4 py-4 text-xs text-muted sm:px-6">
          Independent concept built by Arun Raju Nandyala. All data is sample data. Not affiliated with or produced by Wonderlic.
        </p>
      </footer>
    </div>
  )
}
