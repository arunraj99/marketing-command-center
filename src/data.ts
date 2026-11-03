// All data in this app is fictional sample data for a working concept.

export type Role =
  | 'Demand gen'
  | 'CS marketing'
  | 'Content lead'
  | 'Product marketing'
  | 'Marketing Program Manager'

export type CampaignStatus = 'On track' | 'At risk' | 'Blocked' | 'Not started' | 'Planned'
export type Stage = 'running' | 'next' | 'deck'

export interface Campaign {
  id: string
  name: string
  channels: string[]
  owner: Role
  when: string
  status: CampaignStatus
  note?: string
  stage: Stage
}

export const STAGES: { key: Stage; label: string; hint: string }[] = [
  { key: 'running', label: 'Running now', hint: 'In market or in final production' },
  { key: 'next', label: 'Up next', hint: 'Launching in the next 6 weeks' },
  { key: 'deck', label: 'On deck', hint: 'Scoped for next quarter' },
]

export const campaigns: Campaign[] = [
  {
    id: 'C-141',
    name: 'Hiring outlook webinar',
    channels: ['Webinar', 'Email'],
    owner: 'Demand gen',
    when: 'Live Nov 19',
    status: 'On track',
    note: 'Reminder email 2 of 3 sends Thursday',
    stage: 'running',
  },
  {
    id: 'C-138',
    name: 'Renewal nudge series',
    channels: ['Email'],
    owner: 'CS marketing',
    when: 'Through Nov 30',
    status: 'At risk',
    note: 'Waiting on renewal list from RevOps',
    stage: 'running',
  },
  {
    id: 'C-136',
    name: 'Assessment science guide',
    channels: ['Content', 'SEO'],
    owner: 'Content lead',
    when: 'Nov 14',
    status: 'On track',
    note: 'Final edit with product team',
    stage: 'running',
  },
  {
    id: 'C-139',
    name: 'Q4 customer newsletter',
    channels: ['Email'],
    owner: 'Content lead',
    when: 'Nov 12',
    status: 'Blocked',
    note: 'Customer quote awaiting legal approval',
    stage: 'running',
  },
  {
    id: 'C-144',
    name: 'Sales one-pager refresh',
    channels: ['Sales enablement'],
    owner: 'Product marketing',
    when: 'Dec 2',
    status: 'On track',
    stage: 'next',
  },
  {
    id: 'C-145',
    name: 'Partner co-marketing email',
    channels: ['Email', 'Partner'],
    owner: 'Demand gen',
    when: 'Dec 5',
    status: 'Not started',
    stage: 'next',
  },
  {
    id: 'C-146',
    name: 'Year-end customer stories',
    channels: ['Content'],
    owner: 'Content lead',
    when: 'Dec 9',
    status: 'On track',
    stage: 'next',
  },
  {
    id: 'C-150',
    name: 'January product launch',
    channels: ['Launch'],
    owner: 'Product marketing',
    when: 'Jan 13',
    status: 'Planned',
    stage: 'deck',
  },
  {
    id: 'C-151',
    name: 'AI in hiring report',
    channels: ['Content', 'Webinar'],
    owner: 'Content lead',
    when: 'Jan 27',
    status: 'Planned',
    stage: 'deck',
  },
  {
    id: 'C-152',
    name: 'Customer adoption playbook',
    channels: ['CS enablement'],
    owner: 'CS marketing',
    when: 'Feb 3',
    status: 'Planned',
    stage: 'deck',
  },
]

export type Team = 'Sales' | 'Customer Success' | 'Product' | 'Leadership'
export const TEAMS: Team[] = ['Sales', 'Customer Success', 'Product', 'Leadership']

export type RequestType =
  | 'Asset update'
  | 'Email'
  | 'List pull'
  | 'Event'
  | 'Content'
  | 'Launch support'
  | 'General'
export type Priority = 'High' | 'Medium' | 'Low'
export type RequestStatus = 'New' | 'Triaged' | 'In progress' | 'Done'

export interface MarketingRequest {
  id: number
  team: Team
  request: string
  type: RequestType
  priority: Priority
  due: string // ISO date, yyyy-mm-dd
  status: RequestStatus
  owner: Role
}

export const requests: MarketingRequest[] = [
  {
    id: 31,
    team: 'Sales',
    request: 'Updated pricing one-pager for an enterprise deal',
    type: 'Asset update',
    priority: 'High',
    due: '2026-11-06',
    status: 'In progress',
    owner: 'Product marketing',
  },
  {
    id: 32,
    team: 'Customer Success',
    request: 'Renewal email template for at-risk accounts',
    type: 'Email',
    priority: 'Medium',
    due: '2026-11-10',
    status: 'New',
    owner: 'Demand gen',
  },
  {
    id: 33,
    team: 'Sales',
    request: 'Case study for a staffing industry prospect',
    type: 'Content',
    priority: 'Medium',
    due: '2026-11-14',
    status: 'Triaged',
    owner: 'Content lead',
  },
  {
    id: 34,
    team: 'Product',
    request: 'Launch blurb for an in-app announcement',
    type: 'Launch support',
    priority: 'Low',
    due: '2026-11-20',
    status: 'Done',
    owner: 'Product marketing',
  },
  {
    id: 35,
    team: 'Sales',
    request: 'Webinar invite list for Midwest accounts',
    type: 'List pull',
    priority: 'High',
    due: '2026-11-07',
    status: 'In progress',
    owner: 'Demand gen',
  },
]

export type AssetStatus = 'Current' | 'Retired'

export interface Asset {
  name: string
  type: string
  version: string
  owner: Role
  updated: string // ISO date, yyyy-mm-dd
  status: AssetStatus
}

export const assets: Asset[] = [
  { name: 'Enterprise pricing one-pager', type: 'One-pager', version: 'v4', owner: 'Product marketing', updated: '2026-10-28', status: 'Current' },
  { name: 'Enterprise pricing one-pager', type: 'One-pager', version: 'v3', owner: 'Product marketing', updated: '2026-08-14', status: 'Retired' },
  { name: 'Platform overview sales deck', type: 'Deck', version: 'v7', owner: 'Product marketing', updated: '2026-10-20', status: 'Current' },
  { name: 'Platform overview sales deck', type: 'Deck', version: 'v6', owner: 'Product marketing', updated: '2026-06-02', status: 'Retired' },
  { name: 'Renewal email template', type: 'Email template', version: 'v2', owner: 'CS marketing', updated: '2026-10-30', status: 'Current' },
  { name: 'Staffing firm case study', type: 'Case study', version: 'v1', owner: 'Content lead', updated: '2026-10-09', status: 'Current' },
  { name: 'Webinar slide template', type: 'Template', version: 'v3', owner: 'Demand gen', updated: '2026-09-18', status: 'Current' },
  { name: 'Competitive battlecard', type: 'Battlecard', version: 'v2', owner: 'Product marketing', updated: '2026-10-02', status: 'Current' },
]

export const weeklyUpdate = {
  weekEnding: '2026-10-30',
  lines: [
    { label: 'What launched', text: 'Assessment science guide published; webinar reminder 1 sent.' },
    {
      label: 'Results',
      text: 'Webinar at 212 registrations against a 250 goal; 4 of 5 high-priority requests closed on time.',
    },
    {
      label: "What's next",
      text: 'Clear the newsletter legal review; send the renewal series as soon as RevOps delivers the list.',
    },
  ],
}

// Weeks are labeled by their Friday end date.
export const weeklyMetrics = [
  { week: 'Sep 25', onTime: 83, turnaround: 3.1 },
  { week: 'Oct 2', onTime: 88, turnaround: 2.8 },
  { week: 'Oct 9', onTime: 90, turnaround: 2.4 },
  { week: 'Oct 16', onTime: 86, turnaround: 2.2 },
  { week: 'Oct 23', onTime: 94, turnaround: 1.9 },
  { week: 'Oct 30', onTime: 92, turnaround: 1.6 },
]
