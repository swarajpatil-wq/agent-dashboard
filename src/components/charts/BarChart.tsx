import { useState } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components'
import { getColor } from '@zendesk-ui/react-components'
import ChartCard, { DataTable } from './ChartCard'
import type { NamedCount } from '../../data/mockData'

interface BarChartProps {
  title: string
  data: NamedCount[]
  hue?: string
  formatValue?: (v: number) => string
}

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`

const RowLabel = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Track = styled.div`
  position: relative;
  height: 20px;
  background-color: ${({ theme }) => getColor({ theme, variable: 'background.subtle' })};
  border-radius: ${({ theme }) => theme.borderRadii.xs};
`

const Fill = styled.div<{ $w: number; $color: string; $hover: string }>`
  height: 100%;
  width: ${({ $w }) => $w}%;
  background-color: ${({ $color }) => $color};
  border-radius: 0 ${({ theme }) => theme.borderRadii.sm} ${({ theme }) => theme.borderRadii.sm} 0;
  transition: background-color 0.12s ease;
  &:hover { background-color: ${({ $hover }) => $hover}; }
`

const Value = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-variant-numeric: tabular-nums;
  min-width: 48px;
  text-align: right;
`

function BarChart({ title, data, hue = 'primaryHue', formatValue = (v) => String(v) }: BarChartProps) {
  const theme: any = useTheme()
  const [showTable, setShowTable] = useState(false)
  const max = Math.max(...data.map((d) => d.count), 1)
  const color = getColor({ theme, hue, light: { shade: 600 }, dark: { shade: 400 } })
  const hover = getColor({ theme, hue, light: { shade: 500 }, dark: { shade: 300 } })

  return (
    <ChartCard
      title={title}
      toggleLabel={showTable ? 'View chart' : 'View as table'}
      onToggle={() => setShowTable((s) => !s)}
    >
      {showTable ? (
        <DataTable>
          <thead><tr><th>Category</th><th>Value</th></tr></thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name}><td>{d.name}</td><td>{formatValue(d.count)}</td></tr>
            ))}
          </tbody>
        </DataTable>
      ) : (
        <Rows>
          {data.map((d) => (
            <Row key={d.name}>
              <RowLabel title={d.name}>{d.name}</RowLabel>
              <Track>
                <Fill
                  $w={(d.count / max) * 100}
                  $color={color}
                  $hover={hover}
                  title={`${d.name}: ${formatValue(d.count)}`}
                />
              </Track>
              <Value>{formatValue(d.count)}</Value>
            </Row>
          ))}
        </Rows>
      )}
    </ChartCard>
  )
}

export default BarChart
