export type RangeKey = 'today' | '7d' | '30d'

export interface RangePreset {
  key: RangeKey
  label: string
}

export const rangePresets: RangePreset[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
]

export interface SeriesPoint {
  label: string
  value: number
}

export interface Stat {
  id: string
  label: string
  value: string
  deltaPct: number
  deltaDirection: 'up' | 'down'
  goodWhen: 'up' | 'down'
  sparkline: number[]
}

export type Channel = 'Chat' | 'Email' | 'Phone' | 'Social'
export type Priority = 'Urgent' | 'High' | 'Normal' | 'Low'
export type TicketStatus = 'New' | 'Open' | 'Pending' | 'On-hold' | 'Solved'

export interface Ticket {
  id: string
  subject: string
  requester: string
  channel: Channel
  priority: Priority
  status: TicketStatus
  updatedLabel: string
  group?: string
  slaStatus?: 'breach' | 'at-risk' | 'ok'
  minutesLeft?: number
  ageDays?: number
}

export interface NamedCount {
  name: string
  count: number
}

/* ---------------- Time series (charts) ---------------- */

const resolved30 = [
  18, 22, 15, 27, 31, 12, 9, 24, 28, 19, 33, 35, 21, 14, 26, 30, 38, 29, 17, 11,
  23, 34, 41, 36, 25, 19, 28, 32, 44, 42,
]
const touched30 = [
  24, 28, 20, 33, 38, 18, 15, 31, 35, 26, 40, 42, 28, 21, 33, 37, 45, 36, 24, 18,
  30, 41, 48, 43, 32, 26, 35, 39, 51, 49,
]
const csat30 = [
  91, 92, 90, 93, 94, 89, 88, 92, 93, 91, 94, 95, 92, 90, 93, 94, 95, 93, 91, 89,
  92, 94, 96, 95, 93, 91, 93, 94, 95, 94,
]

function labelsFor(range: RangeKey): string[] {
  if (range === 'today') return ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p']
  if (range === '7d') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return Array.from({ length: 30 }, (_, i) => String((29 + i) % 30 + 1))
}

function sliceData(range: RangeKey, source: number[]): SeriesPoint[] {
  const labels = labelsFor(range)
  const values = range === '7d' ? source.slice(-7) : range === 'today' ? source.slice(-8) : source
  return labels.map((label, i) => ({ label, value: values[i] ?? 0 }))
}

export function solvedTrend(range: RangeKey): SeriesPoint[] {
  return sliceData(range, resolved30)
}

export function touchedTrend(range: RangeKey): SeriesPoint[] {
  return sliceData(range, touched30)
}

export function csatTrend(range: RangeKey): SeriesPoint[] {
  return sliceData(range, csat30)
}

/* ---------------- Performance KPIs ---------------- */

export const performanceStatsByRange: Record<RangeKey, Stat[]> = {
  today: [
    { id: 'csat', label: 'CSAT', value: '96%', deltaPct: 2, deltaDirection: 'up', goodWhen: 'up', sparkline: [92, 93, 91, 94, 95, 93, 96] },
    { id: 'sla', label: 'SLA hit rate', value: '94%', deltaPct: 1, deltaDirection: 'up', goodWhen: 'up', sparkline: [88, 90, 89, 92, 91, 93, 94] },
    { id: 'frt', label: 'First response time', value: '1m 20s', deltaPct: 8, deltaDirection: 'down', goodWhen: 'down', sparkline: [3, 2, 2, 2, 1, 2, 1] },
    { id: 'aht', label: 'Avg handle time', value: '3m 48s', deltaPct: 4, deltaDirection: 'down', goodWhen: 'down', sparkline: [6, 5, 5, 4, 4, 4, 3] },
    { id: 'reopen', label: 'Reopening rate', value: '3.1%', deltaPct: 5, deltaDirection: 'down', goodWhen: 'down', sparkline: [5, 4, 4, 4, 3, 3, 3] },
    { id: 'touched', label: 'Tickets touched', value: '24', deltaPct: 5, deltaDirection: 'up', goodWhen: 'up', sparkline: [12, 15, 18, 16, 20, 22, 24] },
  ],
  '7d': [
    { id: 'csat', label: 'CSAT', value: '94%', deltaPct: 2, deltaDirection: 'up', goodWhen: 'up', sparkline: csat30.slice(-12) },
    { id: 'sla', label: 'SLA hit rate', value: '91%', deltaPct: 3, deltaDirection: 'up', goodWhen: 'up', sparkline: [85, 87, 86, 89, 88, 90, 89, 91, 90, 92, 91, 91] },
    { id: 'frt', label: 'First response time', value: '2m 05s', deltaPct: 6, deltaDirection: 'down', goodWhen: 'down', sparkline: [4, 3, 3, 3, 2, 3, 2, 2, 3, 2, 2, 2] },
    { id: 'aht', label: 'Avg handle time', value: '4m 12s', deltaPct: 5, deltaDirection: 'down', goodWhen: 'down', sparkline: [5, 5, 4, 4, 5, 4, 4, 4, 3, 4, 4, 4] },
    { id: 'reopen', label: 'Reopening rate', value: '3.8%', deltaPct: 4, deltaDirection: 'down', goodWhen: 'down', sparkline: [6, 5, 5, 4, 5, 4, 4, 4, 4, 4, 4, 4] },
    { id: 'touched', label: 'Tickets touched', value: '182', deltaPct: 6, deltaDirection: 'up', goodWhen: 'up', sparkline: resolved30.slice(-12) },
  ],
  '30d': [
    { id: 'csat', label: 'CSAT', value: '93%', deltaPct: 1, deltaDirection: 'up', goodWhen: 'up', sparkline: csat30 },
    { id: 'sla', label: 'SLA hit rate', value: '89%', deltaPct: 4, deltaDirection: 'up', goodWhen: 'up', sparkline: [82, 84, 83, 86, 85, 87, 86, 88, 87, 89, 88, 90, 89, 91, 90, 89, 91, 90, 92, 91, 90, 92, 91, 90, 91, 90, 91, 90, 89, 89] },
    { id: 'frt', label: 'First response time', value: '2m 18s', deltaPct: 3, deltaDirection: 'down', goodWhen: 'down', sparkline: [4, 4, 3, 3, 4, 3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3] },
    { id: 'aht', label: 'Avg handle time', value: '4m 31s', deltaPct: 2, deltaDirection: 'down', goodWhen: 'down', sparkline: [6, 5, 5, 5, 4, 5, 4, 5, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4] },
    { id: 'reopen', label: 'Reopening rate', value: '4.2%', deltaPct: 3, deltaDirection: 'down', goodWhen: 'down', sparkline: [6, 6, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 4, 5, 4, 5, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4] },
    { id: 'touched', label: 'Tickets touched', value: '742', deltaPct: 9, deltaDirection: 'up', goodWhen: 'up', sparkline: resolved30 },
  ],
}

export const workloadStats: Stat[] = [
  { id: 'open', label: 'Open assigned', value: '27', deltaPct: 3, deltaDirection: 'up', goodWhen: 'down', sparkline: [22, 24, 23, 25, 26, 25, 27] },
  { id: 'overdue', label: 'Overdue', value: '2', deltaPct: 1, deltaDirection: 'up', goodWhen: 'down', sparkline: [1, 1, 2, 1, 2, 1, 2] },
  { id: 'due-today', label: 'Due today', value: '4', deltaPct: 2, deltaDirection: 'down', goodWhen: 'down', sparkline: [6, 5, 5, 4, 5, 4, 4] },
  { id: 'on-hold', label: 'On-hold', value: '6', deltaPct: 1, deltaDirection: 'down', goodWhen: 'down', sparkline: [9, 8, 8, 7, 7, 6, 6] },
  { id: 'unassigned', label: 'Unassigned', value: '30', deltaPct: 5, deltaDirection: 'down', goodWhen: 'down', sparkline: [38, 36, 34, 33, 31, 32, 30] },
]

export const ahtByChannel: NamedCount[] = [
  { name: 'Chat', count: 3.2 },
  { name: 'Email', count: 6.8 },
  { name: 'Phone', count: 8.4 },
  { name: 'Social', count: 4.1 },
]

export const frtByChannel: NamedCount[] = [
  { name: 'Chat', count: 0.8 },
  { name: 'Email', count: 2.1 },
  { name: 'Phone', count: 1.4 },
  { name: 'Social', count: 1.6 },
]

/* ---------------- Section 1: Needs attention now ---------------- */

export const recentlyUpdated: Ticket[] = [
  { id: '1342', subject: 'Order #88412 not received — refund request', requester: 'Maya Chen', channel: 'Chat', priority: 'Urgent', status: 'Open', updatedLabel: '2m ago' },
  { id: '1338', subject: 'Charged twice for annual subscription', requester: 'Priya Natarajan', channel: 'Phone', priority: 'Urgent', status: 'Open', updatedLabel: '8m ago' },
  { id: '1329', subject: 'Checkout fails on mobile for EU region', requester: 'Noah Kim', channel: 'Chat', priority: 'High', status: 'Pending', updatedLabel: '21m ago' },
  { id: '1340', subject: 'Cannot log in after password reset', requester: 'Devon Rivera', channel: 'Email', priority: 'Urgent', status: 'Open', updatedLabel: '34m ago' },
  { id: '1326', subject: 'Feature request: SSO with Azure AD', requester: 'Aisha Bello', channel: 'Email', priority: 'Normal', status: 'Pending', updatedLabel: '52m ago' },
  { id: '1322', subject: 'Invoice mismatch on Q3 billing', requester: 'Marco Bianchi', channel: 'Email', priority: 'High', status: 'Open', updatedLabel: '1h ago' },
  { id: '1319', subject: 'How to export conversation history', requester: 'Yuki Tanaka', channel: 'Chat', priority: 'Normal', status: 'Open', updatedLabel: '2h ago' },
]

export const slaTickets: Ticket[] = [
  { id: '1342', subject: 'Order #88412 not received — refund request', requester: 'Maya Chen', channel: 'Chat', priority: 'Urgent', status: 'Open', slaStatus: 'breach', minutesLeft: -14, updatedLabel: '2m ago' },
  { id: '1331', subject: 'SLA breach on escalated VIP ticket', requester: 'Sofia Almeida', channel: 'Social', priority: 'Urgent', status: 'Open', slaStatus: 'breach', minutesLeft: -3, updatedLabel: '5m ago' },
  { id: '1340', subject: 'Cannot log in after password reset', requester: 'Devon Rivera', channel: 'Email', priority: 'Urgent', status: 'Open', slaStatus: 'at-risk', minutesLeft: 6, updatedLabel: '34m ago' },
  { id: '1338', subject: 'Charged twice for annual subscription', requester: 'Priya Natarajan', channel: 'Phone', priority: 'Urgent', status: 'Open', slaStatus: 'at-risk', minutesLeft: 18, updatedLabel: '8m ago' },
  { id: '1335', subject: 'API returns 500 on bulk import endpoint', requester: 'Liam O’Connor', channel: 'Email', priority: 'High', status: 'Open', slaStatus: 'at-risk', minutesLeft: 42, updatedLabel: '1h ago' },
  { id: '1329', subject: 'Checkout fails on mobile for EU region', requester: 'Noah Kim', channel: 'Chat', priority: 'High', status: 'Open', slaStatus: 'at-risk', minutesLeft: 55, updatedLabel: '21m ago' },
]

// Breached SLA tickets only, sorted by time overdue (most overdue first).
export const breachedTickets: Ticket[] = [
  { id: '1284', subject: 'Account locked after MFA change', requester: 'Grace Lee', channel: 'Phone', priority: 'Urgent', status: 'Open', slaStatus: 'breach', minutesLeft: -285, updatedLabel: '4h ago' },
  { id: '1331', subject: 'SLA breach on escalated VIP ticket', requester: 'Sofia Almeida', channel: 'Social', priority: 'Urgent', status: 'Open', slaStatus: 'breach', minutesLeft: -125, updatedLabel: '2h ago' },
  { id: '1340', subject: 'Cannot log in after password reset', requester: 'Devon Rivera', channel: 'Email', priority: 'Urgent', status: 'Open', slaStatus: 'breach', minutesLeft: -72, updatedLabel: '1h ago' },
  { id: '1335', subject: 'API returns 500 on bulk import endpoint', requester: 'Liam O’Connor', channel: 'Email', priority: 'High', status: 'Open', slaStatus: 'breach', minutesLeft: -47, updatedLabel: '50m ago' },
  { id: '1342', subject: 'Order #88412 not received — refund request', requester: 'Maya Chen', channel: 'Chat', priority: 'Urgent', status: 'Open', slaStatus: 'breach', minutesLeft: -14, updatedLabel: '2m ago' },
]

export const agingTickets: Ticket[] = [
  { id: '1284', subject: 'Password reset email never arrives', requester: 'Elena Petrova', channel: 'Email', priority: 'High', status: 'Open', ageDays: 9, updatedLabel: '9d ago' },
  { id: '1271', subject: 'Cannot downgrade plan — button disabled', requester: 'Rahul Verma', channel: 'Email', priority: 'Normal', status: 'On-hold', ageDays: 7, updatedLabel: '7d ago' },
  { id: '1268', subject: 'Webhook delivery failures to our backend', requester: 'Ana Costa', channel: 'Email', priority: 'High', status: 'Open', ageDays: 6, updatedLabel: '6d ago' },
  { id: '1259', subject: 'Receipt PDF shows wrong tax line', requester: 'Tomás García', channel: 'Email', priority: 'Normal', status: 'Pending', ageDays: 5, updatedLabel: '5d ago' },
  { id: '1250', subject: 'Account locked after MFA change', requester: 'Grace Lee', channel: 'Phone', priority: 'Urgent', status: 'Open', ageDays: 4, updatedLabel: '4d ago' },
]

/* ---------------- Section 2: Workload & output ---------------- */

export const unassignedByGroup: NamedCount[] = [
  { name: 'Billing', count: 12 },
  { name: 'Technical Support', count: 8 },
  { name: 'Shipping', count: 5 },
  { name: 'Account Access', count: 3 },
  { name: 'General', count: 2 },
]

export const issueTypes = ['Billing', 'Technical', 'Shipping', 'Account', 'How-to'] as const
export const priorities: Priority[] = ['Urgent', 'High', 'Normal', 'Low']

// priority (row) x issue-type (col) -> count
export const priorityByIssueType: Record<Priority, number[]> = {
  Urgent: [4, 6, 1, 2, 0],
  High: [8, 11, 4, 5, 3],
  Normal: [9, 14, 7, 6, 12],
  Low: [2, 3, 1, 1, 8],
}

export const volumeByChannel: NamedCount[] = [
  { name: 'Chat', count: 38 },
  { name: 'Email', count: 24 },
  { name: 'Phone', count: 14 },
  { name: 'Social', count: 8 },
]

export const ticketsByForm: NamedCount[] = [
  { name: 'Refund request', count: 18 },
  { name: 'Technical issue', count: 15 },
  { name: 'Account access', count: 12 },
  { name: 'Shipping', count: 9 },
  { name: 'General inquiry', count: 7 },
]

export const statusMix: NamedCount[] = [
  { name: 'New', count: 8 },
  { name: 'Open', count: 22 },
  { name: 'Pending', count: 14 },
  { name: 'On-hold', count: 6 },
  { name: 'Solved', count: 41 },
]

/* ---------------- Helpers ---------------- */

export function formatSla(minutesLeft: number): string {
  if (minutesLeft < 0) {
    const m = Math.abs(minutesLeft)
    return `${Math.floor(m / 60)}h ${m % 60}m overdue`
  }
  const h = Math.floor(minutesLeft / 60)
  const mm = minutesLeft % 60
  return h > 0 ? `${h}h ${mm}m left` : `${mm}m left`
}

export function formatMinutes(min: number): string {
  const m = Math.floor(min)
  const s = Math.round((min - m) * 60)
  return `${m}m ${String(s).padStart(2, '0')}s`
}
