import { useState } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components'
import { getColor } from '@zendesk-ui/react-components'
import ChartCard, { DataTable } from './ChartCard'
import { priorities, issueTypes, priorityByIssueType } from '../../data/mockData'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 90px repeat(${issueTypes.length}, 1fr);
  gap: 2px;
`

const ColHead = styled.div`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-align: center;
  padding: ${({ theme }) => `${theme.space.xxs} 0`};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const RowLabel = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding-right: ${({ theme }) => theme.space.xs};
`

const Cell = styled.div<{ $bg: string; $fg: string }>`
  background-color: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border-radius: ${({ theme }) => theme.borderRadii.xs};
  padding: ${({ theme }) => theme.space.xs};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-variant-numeric: tabular-nums;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-top: ${({ theme }) => theme.space.xs};
`

const SwatchRow = styled.div`
  display: flex;
  gap: 2px;
`

const Swatch = styled.div<{ $bg: string }>`
  width: 16px;
  height: 12px;
  background-color: ${({ $bg }) => $bg};
  border-radius: 2px;
`

function Heatmap() {
  const theme: any = useTheme()
  const [showTable, setShowTable] = useState(false)

  const allCounts = priorities.flatMap((p) => priorityByIssueType[p])
  const max = Math.max(...allCounts, 1)

  const cellColor = (count: number) => {
    if (count === 0) return { bg: getColor({ theme, variable: 'background.subtle' }), fg: getColor({ theme, variable: 'foreground.subtle' }) }
    const intensity = count / max
    const lightShade = Math.round(200 + intensity * 500)
    const darkShade = Math.round(350 + intensity * 350)
    const bg = getColor({ theme, hue: 'primaryHue', light: { shade: lightShade }, dark: { shade: darkShade } })
    const fg = intensity >= 0.6 ? getColor({ theme, variable: 'foreground.onEmphasis' }) : getColor({ theme, variable: 'foreground.default' })
    return { bg, fg }
  }

  const legendShades = [0.15, 0.4, 0.65, 0.9].map((i) => {
    const ls = Math.round(200 + i * 500)
    const ds = Math.round(350 + i * 350)
    return getColor({ theme, hue: 'primaryHue', light: { shade: ls }, dark: { shade: ds } })
  })

  return (
    <ChartCard
      title="Priority by issue type"
      toggleLabel={showTable ? 'View chart' : 'View as table'}
      onToggle={() => setShowTable((s) => !s)}
    >
      {showTable ? (
        <DataTable>
          <thead><tr><th>Priority</th><th>Issue type</th><th>Count</th></tr></thead>
          <tbody>
            {priorities.flatMap((p) =>
              issueTypes.map((it, ci) => (
                <tr key={`${p}-${it}`}><td>{p}</td><td>{it}</td><td>{priorityByIssueType[p][ci]}</td></tr>
              ))
            )}
          </tbody>
        </DataTable>
      ) : (
        <>
          <Grid>
            <div />
            {issueTypes.map((it) => (
              <ColHead key={it} title={it}>{it}</ColHead>
            ))}
            {priorities.map((p) => (
              <div key={p} style={{ display: 'contents' }}>
                <RowLabel>{p}</RowLabel>
                {priorityByIssueType[p].map((count, ci) => {
                  const { bg, fg } = cellColor(count)
                  return (
                    <Cell key={ci} $bg={bg} $fg={fg} title={`${p} · ${issueTypes[ci]}: ${count}`}>
                      {count > 0 ? count : ''}
                    </Cell>
                  )
                })}
              </div>
            ))}
          </Grid>
          <Legend>
            <span>Fewer</span>
            <SwatchRow>
              {legendShades.map((bg, i) => (
                <Swatch key={i} $bg={bg} />
              ))}
            </SwatchRow>
            <span>More</span>
          </Legend>
        </>
      )}
    </ChartCard>
  )
}

export default Heatmap
