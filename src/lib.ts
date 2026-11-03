import type { Priority, RequestType, Role, Team } from './data'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_MS = 86_400_000

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISODate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

export function formatShort(iso: string): string {
  const date = parseISODate(iso)
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`
}

export function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS)
}

export function formatRequestId(id: number): string {
  return `R-${id}`
}

// Checked in order; the first match wins.
const TYPE_RULES: { type: RequestType; pattern: RegExp }[] = [
  { type: 'Asset update', pattern: /\b(one[\s-]?pagers?|decks?|templates?)\b/i },
  { type: 'Email', pattern: /\be-?mails?\b/i },
  { type: 'List pull', pattern: /\blists?\b/i },
  { type: 'Event', pattern: /\b(webinars?|events?)\b/i },
  { type: 'Content', pattern: /\b(case[\s-]stud(y|ies)|blogs?|guides?)\b/i },
  { type: 'Launch support', pattern: /\blaunch(es|ed|ing)?\b/i },
]

const OWNER_BY_TYPE: Record<RequestType, Role> = {
  'Asset update': 'Product marketing',
  'Launch support': 'Product marketing',
  Email: 'Demand gen',
  'List pull': 'Demand gen',
  Content: 'Content lead',
  Event: 'Demand gen',
  General: 'Marketing Program Manager',
}

const PROMISE_DAYS: Record<Priority, number> = { High: 2, Medium: 4, Low: 7 }

function priorityFor(daysUntilNeeded: number): Priority {
  if (daysUntilNeeded <= 3) return 'High'
  if (daysUntilNeeded <= 7) return 'Medium'
  return 'Low'
}

export interface TriageResult {
  id: number
  team: Team
  request: string
  type: RequestType
  priority: Priority
  owner: Role
  neededBy: string
  promiseDate: string
  daysUntilNeeded: number
  matchedOn: string | null
  reply: string
}

export function triage(input: { team: Team; request: string; neededBy: string; nextId: number }): TriageResult {
  const today = startOfToday()
  const needed = parseISODate(input.neededBy)
  const daysUntilNeeded = daysBetween(today, needed)

  const rule = TYPE_RULES.find((r) => r.pattern.test(input.request))
  const type = rule?.type ?? 'General'
  const matchedOn = rule ? (input.request.match(rule.pattern)?.[0] ?? null) : null

  const priority = priorityFor(daysUntilNeeded)
  const owner = OWNER_BY_TYPE[type]

  const target = addDays(today, PROMISE_DAYS[priority])
  const promise = target.getTime() > needed.getTime() ? needed : target
  const promiseDate = toISODate(promise)

  const reply =
    `Thanks, ${input.team}. Logged as ${formatRequestId(input.nextId)} (${type}, ${priority}). ` +
    `${owner} will have a first version to you by ${formatShort(promiseDate)}. ` +
    `If your deadline moves, reply here and I'll re-plan.`

  return {
    id: input.nextId,
    team: input.team,
    request: input.request.trim(),
    type,
    priority,
    owner,
    neededBy: input.neededBy,
    promiseDate,
    daysUntilNeeded,
    matchedOn,
    reply,
  }
}

export type CopyOutcome = 'copied' | 'selected'

function selectContents(el: HTMLElement) {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    el.focus()
    el.select()
    return
  }
  const selection = window.getSelection()
  if (!selection) return
  const range = document.createRange()
  range.selectNodeContents(el)
  selection.removeAllRanges()
  selection.addRange(range)
}

// Call directly from a click handler so the clipboard write keeps the user gesture.
export async function copyText(text: string, fallbackTarget: HTMLElement | null): Promise<CopyOutcome> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return 'copied'
    }
  } catch {
    // Fall through to selecting the text.
  }
  if (fallbackTarget) {
    selectContents(fallbackTarget)
    try {
      if (document.execCommand('copy')) return 'copied'
    } catch {
      // Selection stays in place so the user can copy manually.
    }
  }
  return 'selected'
}
