import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import type { AssetStatus, CampaignStatus, Priority, RequestStatus } from './data'
import { copyText, type CopyOutcome } from './lib'

const CAMPAIGN_STYLES: Record<CampaignStatus, { pill: string; dot: string }> = {
  'On track': { pill: 'bg-ok-soft text-ok', dot: 'bg-ok' },
  'At risk': { pill: 'bg-warn-soft text-warn', dot: 'bg-warn' },
  Blocked: { pill: 'bg-bad-soft text-bad', dot: 'bg-bad' },
  'Not started': { pill: 'bg-surface-2 text-muted ring-1 ring-inset ring-line', dot: 'bg-faint' },
  Planned: { pill: 'bg-surface-2 text-muted ring-1 ring-inset ring-line', dot: 'bg-faint' },
}

export function StatusPill({ status }: { status: CampaignStatus }) {
  const style = CAMPAIGN_STYLES[status]
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${style.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
      {status}
    </span>
  )
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-line bg-surface-2 px-1.5 py-px text-[11px] font-medium text-muted">
      {children}
    </span>
  )
}

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'bg-ink text-surface',
  Medium: 'bg-surface text-ink ring-1 ring-inset ring-ink/40',
  Low: 'bg-surface-2 text-muted ring-1 ring-inset ring-line',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-px text-[11px] font-semibold ${PRIORITY_STYLES[priority]}`}>
      {priority}
    </span>
  )
}

const REQUEST_STATUS_STYLES: Record<RequestStatus, string> = {
  New: 'text-accent-text bg-accent-soft',
  Triaged: 'text-ink bg-surface-2 ring-1 ring-inset ring-line',
  'In progress': 'text-ink bg-surface-2 ring-1 ring-inset ring-line',
  Done: 'text-faint bg-transparent line-through decoration-faint/60',
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded px-1.5 py-px text-xs font-medium ${REQUEST_STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return status === 'Current' ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      Current
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-faint">
      <span className="h-1.5 w-1.5 rounded-full border border-faint" aria-hidden />
      Retired
    </span>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-line bg-surface ${className}`}>{children}</section>
}

export function Mono({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-[0.92em] ${className}`}>{children}</span>
}

interface CopyButtonProps {
  text: string
  fallbackTarget: () => HTMLElement | null
  label?: string
  className?: string
}

export function CopyButton({ text, fallbackTarget, label = 'Copy', className = '' }: CopyButtonProps) {
  const [outcome, setOutcome] = useState<CopyOutcome | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = () => {
    copyText(text, fallbackTarget()).then((result) => {
      setOutcome(result)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setOutcome(null), result === 'copied' ? 2000 : 5000)
    })
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-accent hover:text-accent-text ${className}`}
      >
        {outcome === 'copied' ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
        {outcome === 'copied' ? 'Copied' : label}
      </button>
      <span role="status" aria-live="polite" className="text-xs text-muted">
        {outcome === 'selected' ? 'Text selected. Press Ctrl+C or ⌘C to copy.' : ''}
      </span>
    </span>
  )
}
