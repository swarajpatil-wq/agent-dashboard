import styled from 'styled-components'
import { getColor, Table } from '@zendesk-ui/react-components'
import ClockIcon from '@zendesk-ui/assets/icons/20px/clock-fill.svg?react'
import BoltIcon from '@zendesk-ui/assets/icons/20px/lightning-bolt-fill.svg?react'
import HourglassIcon from '@zendesk-ui/assets/icons/20px/clock-cycle-fill.svg?react'
import Badge, { type Tone } from './Badge'
import { formatSla, type Ticket, type Priority, type TicketStatus } from '../data/mockData'

const Subject = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const Muted = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const CellStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Timer = styled.span`
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

function priorityTone(p: Priority): Tone {
  if (p === 'Urgent') return 'danger'
  if (p === 'High') return 'warning'
  return 'neutral'
}

function statusTone(s: TicketStatus): Tone {
  if (s === 'Solved') return 'success'
  if (s === 'New') return 'info'
  if (s === 'Open') return 'warning'
  return 'neutral'
}

type Variant = 'recent' | 'sla' | 'aging'

function TicketList({ variant, items }: { variant: Variant; items: Ticket[] }) {
  const headers =
    variant === 'recent'
      ? ['Updated', 'Subject', 'Requester']
      : variant === 'sla'
      ? ['SLA', 'Subject']
      : ['Age', 'Subject', 'Requester', 'Channel', 'Priority', 'Status']

  return (
    <Table>
      <Table.Head>
        <Table.HeaderRow>
          {headers.map((h) => (
            <Table.HeaderCell key={h}>{h}</Table.HeaderCell>
          ))}
        </Table.HeaderRow>
      </Table.Head>
      <Table.Body>
        {items.map((t) => (
          <Table.Row key={`${variant}-${t.id}`}>
            {variant === 'recent' && (
              <Table.Cell><Muted>{t.updatedLabel}</Muted></Table.Cell>
            )}
            {variant === 'sla' && (
              <Table.Cell>
                <CellStack>
                  <Badge tone={t.slaStatus === 'breach' ? 'danger' : 'warning'}
                    icon={t.slaStatus === 'breach' ? <BoltIcon /> : <ClockIcon />}>
                    {t.slaStatus === 'breach' ? 'Breached' : 'At risk'}
                  </Badge>
                  <Timer>{formatSla(t.minutesLeft ?? 0)}</Timer>
                </CellStack>
              </Table.Cell>
            )}
            {variant === 'aging' && (
              <Table.Cell>
                <CellStack>
                  <Badge tone="warning" icon={<HourglassIcon />}>Aging</Badge>
                  <Timer>{t.ageDays}d old</Timer>
                </CellStack>
              </Table.Cell>
            )}
            <Table.Cell><Subject>{t.subject}</Subject></Table.Cell>
            {variant !== 'sla' && <Table.Cell><Muted>{t.requester}</Muted></Table.Cell>}
            {variant === 'aging' && <Table.Cell><Muted>{t.channel}</Muted></Table.Cell>}
            {variant === 'aging' && <Table.Cell><Badge tone={priorityTone(t.priority)}>{t.priority}</Badge></Table.Cell>}
            {variant === 'aging' && (
              <Table.Cell><Badge tone={statusTone(t.status)}>{t.status}</Badge></Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default TicketList
