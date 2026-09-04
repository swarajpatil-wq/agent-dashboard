import { useState } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components'
import { getColor } from '@zendesk-ui/react-components'
import ChartCard, { DataTable } from './ChartCard'
import { statusMix, type NamedCount } from '../../data/mockData'

const hueForStatus: Record<string, string> = {
  New: 'primaryHue',
  Open: 'orange',
  Pending: 'teal',
  'On-hold': 'lemon',
  Solved: 'purple',
}

const Bar = styled.div`
  display: flex;
  width: 100%;
  height: 28px;
  border-radius: ${({ theme }) => theme.borderRadii.sm};
  overflow: hidden;
  gap: 2px;
`

const Segment = styled.div<{ $bg: string; $grow: number }>`
  flex-grow: ${({ $grow }) => $grow};
  background-color: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.onEmphasis' })};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-variant-numeric: tabular-nums;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  overflow: hidden;
  white-space: nowrap;
  &:first-child { border-radius: ${({ theme }) => `${theme.borderRadii.sm} 0 0 ${theme.borderRadii.sm}`} }
  &:last-child { border-radius: ${({ theme }) => `0 ${theme.borderRadii.sm} ${theme.borderRadii.sm} 0`} }
`

const Legend = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
`

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const Swatch = styled.span<{ $bg: string }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: ${({ $bg }) => $bg};
`

const LegendValue = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-variant-numeric: tabular-nums;
`

function StackedBar() {
  const theme: any = useTheme()
  const [showTable, setShowTable] = useState(false)
  const total = statusMix.reduce((s, d) => s + d.count, 0) || 1

  const segColor = (name: string) =>
    getColor({ theme, hue: hueForStatus[name] ?? 'neutralHue', light: { shade: 600 }, dark: { shade: 400 } })

  return (
    <ChartCard
      title="Ticket status mix"
      toggleLabel={showTable ? 'View chart' : 'View as table'}
      onToggle={() => setShowTable((s) => !s)}
    >
      {showTable ? (
        <DataTable>
          <thead><tr><th>Status</th><th>Count</th></tr></thead>
          <tbody>
            {statusMix.map((d) => (
              <tr key={d.name}><td>{d.name}</td><td>{d.count}</td></tr>
            ))}
          </tbody>
        </DataTable>
      ) : (
        <>
          <Bar>
            {statusMix.map((d: NamedCount) => {
              const pct = (d.count / total) * 100
              return (
                <Segment
                  key={d.name}
                  $bg={segColor(d.name)}
                  $grow={d.count}
                  title={`${d.name}: ${d.count} (${Math.round(pct)}%)`}
                >
                  {pct >= 12 ? d.count : ''}
                </Segment>
              )
            })}
          </Bar>
          <Legend>
            {statusMix.map((d) => (
              <LegendItem key={d.name}>
                <Swatch $bg={segColor(d.name)} />
                {d.name}
                <LegendValue>{d.count}</LegendValue>
              </LegendItem>
            ))}
          </Legend>
        </>
      )}
    </ChartCard>
  )
}

export default StackedBar
