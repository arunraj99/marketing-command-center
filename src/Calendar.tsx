import { AlertTriangle, OctagonAlert } from 'lucide-react'
import { campaigns, STAGES, type Campaign } from './data'
import { Chip, Mono, StatusPill } from './ui'

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { status, note } = campaign
  const flagged = status === 'Blocked' || status === 'At risk'
  const edge = status === 'Blocked' ? 'border-l-bad' : status === 'At risk' ? 'border-l-warn' : 'border-l-transparent'

  return (
    <article className={`rounded-md border border-line border-l-[3px] bg-surface p-3.5 shadow-[0_1px_0_rgba(15,23,42,0.03)] ${edge}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] leading-snug font-semibold text-ink">{campaign.name}</h3>
        <StatusPill status={status} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {campaign.channels.map((channel) => (
          <Chip key={channel}>{channel}</Chip>
        ))}
      </div>
      <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <div className="flex items-center gap-1">
          <dt className="sr-only">Owner</dt>
          <dd className="font-medium text-ink">{campaign.owner}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt className="sr-only">Date</dt>
          <dd>
            <Mono>{campaign.when}</Mono>
          </dd>
        </div>
        <div className="ml-auto">
          <dt className="sr-only">ID</dt>
          <dd>
            <Mono className="text-faint">{campaign.id}</Mono>
          </dd>
        </div>
      </dl>
      {note &&
        (flagged ? (
          <p
            className={`mt-3 flex items-start gap-1.5 rounded px-2 py-1.5 text-[13px] font-medium ${
              status === 'Blocked' ? 'bg-bad-soft text-bad' : 'bg-warn-soft text-warn'
            }`}
          >
            {status === 'Blocked' ? (
              <OctagonAlert size={14} className="mt-0.5 shrink-0" aria-hidden />
            ) : (
              <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden />
            )}
            <span>
              <span className="sr-only">{status === 'Blocked' ? 'Blocker: ' : 'Risk: '}</span>
              {note}
            </span>
          </p>
        ) : (
          <p className="mt-3 border-t border-line pt-2 text-[13px] text-muted">{note}</p>
        ))}
    </article>
  )
}

export default function Calendar() {
  const flagged = campaigns.filter((c) => c.status === 'Blocked' || c.status === 'At risk')

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-muted">
          {campaigns.length} campaigns across three horizons.{' '}
          {flagged.length > 0 && (
            <span className="text-ink">
              {flagged.length} need attention: {flagged.map((c) => c.name).join(' and ')}.
            </span>
          )}
        </p>
        <ul className="flex flex-wrap items-center gap-3 text-xs text-muted" aria-label="Status legend">
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ok" aria-hidden /> On track
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warn" aria-hidden /> At risk
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-bad" aria-hidden /> Blocked
          </li>
        </ul>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {STAGES.map((stage) => {
          const items = campaigns.filter((c) => c.stage === stage.key)
          return (
            <section key={stage.key} aria-labelledby={`stage-${stage.key}`} className="rounded-lg bg-surface-2/70 p-3 ring-1 ring-line">
              <header className="mb-3 flex items-baseline justify-between gap-2 px-0.5">
                <div>
                  <h2 id={`stage-${stage.key}`} className="text-sm font-semibold text-ink">
                    {stage.label}
                  </h2>
                  <p className="text-xs text-muted">{stage.hint}</p>
                </div>
                <Mono className="rounded bg-surface px-1.5 py-0.5 text-xs text-muted ring-1 ring-line">{items.length}</Mono>
              </header>
              <div className="flex flex-col gap-2.5">
                {items.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
