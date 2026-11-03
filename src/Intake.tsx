import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { TEAMS, type MarketingRequest, type Team } from './data'
import { formatRequestId, formatShort, startOfToday, toISODate, triage, type TriageResult } from './lib'
import { CopyButton, Mono, Panel, PriorityBadge, RequestStatusBadge } from './ui'

const EXAMPLES = [
  'Refresh the platform overview deck for a customer QBR',
  'Pull a list of Midwest healthcare accounts for outreach',
  'Blog post on structured interviews for the newsletter',
]

const fieldClass =
  'w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

function TriageCard({ result }: { result: TriageResult }) {
  const replyRef = useRef<HTMLTextAreaElement>(null)
  const dayText =
    result.daysUntilNeeded <= 0
      ? 'needed today'
      : `needed in ${result.daysUntilNeeded} day${result.daysUntilNeeded === 1 ? '' : 's'}`

  const rows: { label: string; value: ReactNode; why: string }[] = [
    {
      label: 'Type',
      value: result.type,
      why: result.matchedOn ? `Matched “${result.matchedOn.toLowerCase()}”` : 'No keyword match',
    },
    { label: 'Priority', value: <PriorityBadge priority={result.priority} />, why: dayText },
    { label: 'Owner', value: result.owner, why: `Default owner for ${result.type}` },
    {
      label: 'Promise date',
      value: <Mono>{formatShort(result.promiseDate)}</Mono>,
      why: `Needed by ${formatShort(result.neededBy)}`,
    },
  ]

  return (
    <Panel className="mt-4 overflow-hidden border-accent/40">
      <div className="flex items-center gap-2 border-b border-line bg-accent-soft px-4 py-2.5 text-xs font-semibold text-accent-text">
        <Sparkles size={14} aria-hidden />
        Triage preview. In production, Claude handles this step.
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <Mono className="text-sm font-medium text-ink">{formatRequestId(result.id)}</Mono>
          <span className="text-xs text-muted">Added to the queue as Triaged</span>
        </div>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-[11px] font-semibold tracking-wide text-faint uppercase">{row.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">{row.value}</dd>
              <dd className="text-xs text-muted">{row.why}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="drafted-reply" className="text-[11px] font-semibold tracking-wide text-faint uppercase">
              Drafted reply
            </label>
          </div>
          <textarea
            id="drafted-reply"
            ref={replyRef}
            readOnly
            rows={4}
            value={result.reply}
            className={`${fieldClass} resize-none bg-surface-2 leading-relaxed`}
          />
          <div className="mt-2">
            <CopyButton text={result.reply} fallbackTarget={() => replyRef.current} label="Copy reply" />
          </div>
        </div>
      </div>
    </Panel>
  )
}

function QueueTable({ queue, highlightId }: { queue: MarketingRequest[]; highlightId: number | null }) {
  const open = queue.filter((r) => r.status !== 'Done').length

  return (
    <Panel>
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Request queue</h2>
        <span className="text-xs text-muted">
          {open} open of {queue.length}
        </span>
      </header>

      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] tracking-wide text-faint uppercase">
            <tr className="border-b border-line">
              <th className="px-4 py-2 font-semibold">ID</th>
              <th className="px-2 py-2 font-semibold">Team</th>
              <th className="px-2 py-2 font-semibold">Request</th>
              <th className="px-2 py-2 font-semibold">Type</th>
              <th className="px-2 py-2 font-semibold">Priority</th>
              <th className="px-2 py-2 font-semibold">Due</th>
              <th className="px-2 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Owner</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((r) => (
              <tr
                key={r.id}
                className={`border-b border-line align-top last:border-0 ${
                  r.id === highlightId ? 'bg-accent-soft/60' : ''
                } ${r.status === 'Done' ? 'text-muted' : ''}`}
              >
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <Mono>{formatRequestId(r.id)}</Mono>
                </td>
                <td className="px-2 py-2.5 whitespace-nowrap">{r.team}</td>
                <td className="min-w-[12rem] px-2 py-2.5 text-ink">{r.request}</td>
                <td className="px-2 py-2.5 whitespace-nowrap">{r.type}</td>
                <td className="px-2 py-2.5">
                  <PriorityBadge priority={r.priority} />
                </td>
                <td className="px-2 py-2.5 whitespace-nowrap">
                  <Mono>{formatShort(r.due)}</Mono>
                </td>
                <td className="px-2 py-2.5">
                  <RequestStatusBadge status={r.status} />
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line md:hidden">
        {queue.map((r) => (
          <li key={r.id} className={`px-4 py-3 ${r.id === highlightId ? 'bg-accent-soft/60' : ''}`}>
            <div className="flex items-center justify-between gap-2 text-xs text-muted">
              <span>
                <Mono className="text-ink">{formatRequestId(r.id)}</Mono> · {r.team}
              </span>
              <RequestStatusBadge status={r.status} />
            </div>
            <p className="mt-1 text-sm font-medium text-ink">{r.request}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <PriorityBadge priority={r.priority} />
              <span>{r.type}</span>
              <span>
                Due <Mono>{formatShort(r.due)}</Mono>
              </span>
              <span>{r.owner}</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

interface IntakeProps {
  queue: MarketingRequest[]
  onAdd: (request: MarketingRequest) => void
}

export default function Intake({ queue, onAdd }: IntakeProps) {
  const today = useMemo(() => toISODate(startOfToday()), [])
  const [team, setTeam] = useState<Team | ''>('')
  const [request, setRequest] = useState('')
  const [neededBy, setNeededBy] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TriageResult | null>(null)

  const nextId = Math.max(...queue.map((r) => r.id)) + 1

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!team || !request.trim() || !neededBy) {
      setError('Pick a team, describe the request, and set a needed-by date.')
      return
    }
    if (neededBy < today) {
      setError('The needed-by date is in the past. Pick today or later.')
      return
    }
    setError(null)
    const triaged = triage({ team, request, neededBy, nextId })
    setResult(triaged)
    onAdd({
      id: triaged.id,
      team: triaged.team,
      request: triaged.request,
      type: triaged.type,
      priority: triaged.priority,
      due: triaged.neededBy,
      status: 'Triaged',
      owner: triaged.owner,
    })
    setRequest('')
    setNeededBy('')
    setTeam('')
  }

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div>
        <Panel className="p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-ink">New request</h2>
            <span className="text-xs text-muted">
              Next ID <Mono className="text-ink">{formatRequestId(nextId)}</Mono>
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">Triage assigns a type, priority, owner and promise date.</p>
          <form onSubmit={onSubmit} noValidate className="mt-4 flex flex-col gap-3.5">
            <div>
              <label htmlFor="team" className="mb-1 block text-xs font-semibold text-ink">
                Requesting team
              </label>
              <select
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value as Team)}
                className={fieldClass}
              >
                <option value="" disabled>
                  Select a team
                </option>
                {TEAMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="request" className="mb-1 block text-xs font-semibold text-ink">
                What do you need
              </label>
              <textarea
                id="request"
                rows={3}
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="e.g. Updated one-pager for a healthcare prospect"
                className={`${fieldClass} resize-y`}
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-faint">Try:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setRequest(ex)}
                    className="rounded border border-dashed border-line px-1.5 py-px text-left text-[11px] text-muted hover:border-accent hover:text-accent-text"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="needed-by" className="mb-1 block text-xs font-semibold text-ink">
                Needed by
              </label>
              <input
                id="needed-by"
                type="date"
                min={today}
                value={neededBy}
                onChange={(e) => setNeededBy(e.target.value)}
                className={`${fieldClass} font-mono`}
              />
            </div>
            {error && (
              <p role="alert" className="text-xs font-medium text-bad">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:bg-accent-hover"
            >
              Triage request
            </button>
          </form>
        </Panel>
        {result && <TriageCard key={result.id} result={result} />}
      </div>
      <QueueTable queue={queue} highlightId={result?.id ?? null} />
    </div>
  )
}
