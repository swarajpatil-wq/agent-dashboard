import { useState } from 'react'
import styled from 'styled-components'
import { getColor, XXL, SM } from '@zendesk-ui/react-components'
import StatTile from '../components/StatTile'
import TicketList from '../components/TicketList'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import Heatmap from '../components/charts/Heatmap'
import StackedBar from '../components/charts/StackedBar'
import {
  rangePresets, performanceStatsByRange, solvedTrend, touchedTrend, workloadStats,
  recentlyUpdated, slaTickets,
  unassignedByGroup, volumeByChannel, ticketsByForm,
  ahtByChannel, frtByChannel, formatMinutes,
  type RangeKey,
} from '../data/mockData'

const Wrap = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxs};
`

const Subtitle = styled(SM)`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space.sm};
  flex-wrap: wrap;
`

const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

const SubHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space.sm};
  margin: ${({ theme }) => `${theme.space.sm} 0 0`};
`

const SubTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

const SubMeta = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const Spacer = styled.div`
  height: ${({ theme }) => theme.space.xs};
`

const RangeGroup = styled.div`
  display: inline-flex;
  border: 1px solid ${({ theme }) => getColor({ theme, variable: 'border.default' })};
  border-radius: ${({ theme }) => theme.borderRadii.sm};
  overflow: hidden;
  margin-left: auto;
`

const RangeButton = styled.button<{ $active: boolean }>`
  appearance: none;
  background: ${({ theme, $active }) => ($active ? getColor({ theme, variable: 'background.primaryEmphasis' }) : 'transparent')};
  color: ${({ theme, $active }) => ($active ? getColor({ theme, variable: 'foreground.onEmphasis' }) : getColor({ theme, variable: 'foreground.subtle' }))};
  border: none;
  border-right: 1px solid ${({ theme }) => getColor({ theme, variable: 'border.default' })};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  &:last-child { border-right: none; }
  &:hover { background-color: ${({ theme, $active }) => ($active ? undefined : getColor({ theme, variable: 'background.subtle' }))}; }
`

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space.md};
`

const AdjacentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: ${({ theme }) => theme.space.md};
  align-items: start;
`

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: ${({ theme }) => theme.space.md};
`

const TIME_TILE_IDS = new Set(['frt', 'aht'])

function AgentDashboard() {
  const [range, setRange] = useState<RangeKey>('7d')
  const tiles = performanceStatsByRange[range].filter((s) => !TIME_TILE_IDS.has(s.id))
  const breachCount = slaTickets.filter((t) => t.slaStatus === 'breach').length
  const atRiskCount = slaTickets.filter((t) => t.slaStatus === 'at-risk').length

  return (
    <Wrap>
      <Header>
        <XXL tag="h1">Agent dashboard</XXL>
        <Subtitle>Good morning, Swaraj — here's what needs your attention and how you're doing.</Subtitle>
      </Header>

      {/* Workload — KPI summary, action lists, and workload breakdown */}
      <Section>
        <StatGrid>
          {workloadStats.map((s) => (
            <StatTile key={s.id} stat={s} />
          ))}
        </StatGrid>

        <Grid2>
          <LineChart
            title="Tickets touched vs solved (last 7 days)"
            series={[
              { label: 'Tickets touched', hue: 'primaryHue', data: touchedTrend('7d') },
              { label: 'Tickets solved', hue: 'successHue', data: solvedTrend('7d') },
            ]}
          />
        </Grid2>

        <AdjacentGrid>
          <div>
            <SubHead><SubTitle>Recently updated</SubTitle><SubMeta>newest first</SubMeta></SubHead>
            <Spacer />
            <TicketList variant="recent" items={recentlyUpdated} />
          </div>
          <div>
            <SubHead><SubTitle>SLA at risk</SubTitle><SubMeta>{breachCount} breached · {atRiskCount} about to breach</SubMeta></SubHead>
            <Spacer />
            <TicketList variant="sla" items={slaTickets} />
          </div>
        </AdjacentGrid>

        <SubHead><SubTitle>Workload breakdown</SubTitle><SubMeta>your assigned tickets</SubMeta></SubHead>
        <Grid2>
          <BarChart title="Unassigned tickets by group" data={unassignedByGroup} hue="primaryHue" />
          <Heatmap />
        </Grid2>
        <Grid2>
          <BarChart title="Ticket volume by channel" data={volumeByChannel} hue="teal" />
          <BarChart title="Tickets by form" data={ticketsByForm} hue="purple" />
        </Grid2>
        <StackedBar />
      </Section>

      {/* Section 3 — Performance */}
      <Section>
        <SectionHead>
          <SectionTitle>Performance</SectionTitle>
          <RangeGroup role="group" aria-label="Date range">
            {rangePresets.map((p) => (
              <RangeButton key={p.key} $active={range === p.key} aria-pressed={range === p.key} onClick={() => setRange(p.key)}>
                {p.label}
              </RangeButton>
            ))}
          </RangeGroup>
        </SectionHead>
        <StatGrid>
          {tiles.map((s) => (
            <StatTile key={s.id} stat={s} />
          ))}
        </StatGrid>
        <Grid2>
          <BarChart title="Avg handle time by channel" data={ahtByChannel} hue="orange" formatValue={formatMinutes} />
          <BarChart title="First response time by channel" data={frtByChannel} hue="azure" formatValue={formatMinutes} />
        </Grid2>
      </Section>
    </Wrap>
  )
}

export default AgentDashboard
