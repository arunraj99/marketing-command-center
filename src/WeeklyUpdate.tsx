import { useRef, type ReactElement } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { weeklyMetrics, weeklyUpdate } from './data'
import { formatShort } from './lib'
import { CopyButton, Mono, Panel } from './ui'

interface ChartColors {
  accent: string
  grid: string
  tick: string
  surface: string
  ink: string
}

const LIGHT: ChartColors = { accent: '#0e5a5a', grid: '#e3e8ee', tick: '#5a6676', surface: '#ffffff', ink: '#111a24' }
const DARK: ChartColors = { accent: '#5cc4bd', grid: '#26323e', tick: '#9aa6b4', surface: '#131a21', ink: '#e4e9ef' }

const MONO = '"IBM Plex Mono", ui-monospace, monospace'

function ChartPanel({ title, caption, children }: { title: string; caption: string; children: ReactElement }) {
  return (
    <Panel className="p-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="text-xs text-muted">{caption}</p>
      <div className="mt-3 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 400, height: 208 }}>
          {children}
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

export default function WeeklyUpdate({ dark }: { dark: boolean }) {
  const linesRef = useRef<HTMLDListElement>(null)
  const c = dark ? DARK : LIGHT
  const plainText = weeklyUpdate.lines.map((l) => `${l.label}: ${l.text}`).join('\n')

  const first = weeklyMetrics[0]
  const last = weeklyMetrics[weeklyMetrics.length - 1]
  const tick = { fill: c.tick, fontSize: 11, fontFamily: MONO }
  const tooltipStyle = {
    contentStyle: {
      background: c.surface,
      border: `1px solid ${c.grid}`,
      borderRadius: 6,
      fontSize: 12,
      color: c.ink,
    },
    labelStyle: { color: c.tick, fontFamily: MONO },
    cursor: { fill: c.grid, opacity: 0.4 },
  }

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">Weekly marketing update</h2>
            <p className="text-xs text-muted">
              Week ending <Mono>{formatShort(weeklyUpdate.weekEnding)}</Mono>. Three lines, ready to paste into Slack or email.
            </p>
          </div>
          <CopyButton text={plainText} fallbackTarget={() => linesRef.current} label="Copy update" />
        </header>
        <dl ref={linesRef} className="divide-y divide-line">
          {weeklyUpdate.lines.map((line) => (
            <div key={line.label} className="grid gap-1 px-4 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-xs font-semibold tracking-wide text-accent-text uppercase sm:pt-0.5">{line.label}</dt>
              <dd className="text-[15px] leading-relaxed text-ink">{line.text}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartPanel
          title="On-time launches"
          caption={`Share of launches shipped on the planned date. ${first.onTime}% to ${last.onTime}% over 6 weeks.`}
        >
          <BarChart data={weeklyMetrics} margin={{ top: 18, right: 4, bottom: 0, left: -18 }}>
            <CartesianGrid vertical={false} stroke={c.grid} />
            <XAxis dataKey="week" tick={tick} tickLine={false} axisLine={{ stroke: c.grid }} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={tick} tickLine={false} axisLine={false} unit="%" />
            <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'On time']} />
            <Bar dataKey="onTime" fill={c.accent} radius={[3, 3, 0, 0]} maxBarSize={36} isAnimationActive={false}>
              <LabelList dataKey="onTime" position="top" fill={c.tick} fontSize={11} fontFamily={MONO} />
            </Bar>
          </BarChart>
        </ChartPanel>
        <ChartPanel
          title="Average request turnaround"
          caption={`Days from request to first version. ${first.turnaround} to ${last.turnaround} days over 6 weeks.`}
        >
          <LineChart data={weeklyMetrics} margin={{ top: 18, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid vertical={false} stroke={c.grid} />
            <XAxis dataKey="week" tick={tick} tickLine={false} axisLine={{ stroke: c.grid }} padding={{ left: 12, right: 12 }} />
            <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={tick} tickLine={false} axisLine={false} />
            <Tooltip
              {...tooltipStyle}
              cursor={{ stroke: c.grid }}
              formatter={(v) => [`${Number(v).toFixed(1)} days`, 'Turnaround']}
            />
            <Line
              type="monotone"
              dataKey="turnaround"
              stroke={c.accent}
              strokeWidth={2.25}
              dot={{ r: 3, fill: c.surface, stroke: c.accent, strokeWidth: 2 }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="turnaround"
                position="top"
                offset={9}
                fill={c.tick}
                fontSize={11}
                fontFamily={MONO}
                formatter={(v) => Number(v).toFixed(1)}
              />
            </Line>
          </LineChart>
        </ChartPanel>
      </div>
    </div>
  )
}
