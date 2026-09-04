import { useLayoutEffect, useRef, useState } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components'
import { getColor } from '@zendesk-ui/react-components'
import ChartCard, { DataTable } from './ChartCard'
import type { SeriesPoint } from '../../data/mockData'

export interface LineSeries {
  label: string
  hue: string
  data: SeriesPoint[]
}

interface LineChartProps {
  title: string
  series: LineSeries[]
  valueSuffix?: string
}

const Plot = styled.div`
  position: relative;
  width: 100%;
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

const LineKey = styled.span<{ $color: string }>`
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
`

const Tip = styled.div`
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -100%);
  background-color: ${({ theme }) => getColor({ theme, variable: 'background.recessed' })};
  border: 1px solid ${({ theme }) => getColor({ theme, variable: 'border.emphasis' })};
  border-radius: ${({ theme }) => theme.borderRadii.sm};
  box-shadow: ${({ theme }) => getColor({ theme, variable: 'shadow.small' })};
  padding: ${({ theme }) => `${theme.space.xxs} ${theme.space.sm}`};
  white-space: nowrap;
  z-index: 2;
`

const TipRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`

const TipValue = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-variant-numeric: tabular-nums;
`

const TipLabel = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const MultiTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  th, td {
    text-align: right;
    padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
    border-bottom: 1px solid ${({ theme }) => getColor({ theme, variable: 'border.subtle' })};
  }
  th:first-child, td:first-child { text-align: left; }
  th { color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })}; font-weight: ${({ theme }) => theme.fontWeights.semibold}; }
  td { color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })}; font-variant-numeric: tabular-nums; }
`

function niceTicks(min: number, max: number, count = 4): number[] {
  const span = max - min || 1
  const step0 = span / count
  const mag = Math.pow(10, Math.floor(Math.log10(step0)))
  const norm = step0 / mag
  const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag
  const start = Math.floor(min / step) * step
  const ticks: number[] = []
  for (let v = start; v <= max + step / 2; v += step) ticks.push(Math.round(v * 100) / 100)
  return ticks
}

function LineChart({ title, series, valueSuffix = '' }: LineChartProps) {
  const theme: any = useTheme()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
  const [hover, setHover] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const xLabels = series[0]?.data.map((d) => d.label) ?? []
  const n = xLabels.length

  const W = width
  const H = 240
  const pad = { top: 16, right: 18, bottom: 28, left: 40 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom

  const allValues = series.flatMap((s) => s.data.map((d) => d.value))
  const max = Math.max(...allValues)
  const min = Math.min(...allValues)
  const yTicks = niceTicks(Math.floor(min * 0.9), Math.ceil(max * 1.05), 4)
  const yLo = yTicks[0]
  const yHi = yTicks[yTicks.length - 1]
  const ySpan = yHi - yLo || 1

  const xAt = (i: number) => pad.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const yAt = (v: number) => pad.top + (1 - (v - yLo) / ySpan) * plotH

  const colorFor = (hue: string) => getColor({ theme, hue, light: { shade: 600 }, dark: { shade: 400 } })
  const surface = getColor({ theme, variable: 'background.raised' })
  const grid = getColor({ theme, variable: 'border.subtle' })
  const axisInk = getColor({ theme, variable: 'foreground.subtle' })
  const labelInk = getColor({ theme, variable: 'foreground.default' })

  const single = series.length === 1
  const showAllMarkers = n <= 12
  const labelEvery = n > 14 ? Math.ceil(n / 7) : 1

  const ptsFor = (s: LineSeries) => s.data.map((d, i) => [xAt(i), yAt(d.value)] as const)
  const linePath = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  const activeX = hover != null ? xAt(hover) : null

  return (
    <ChartCard
      title={title}
      toggleLabel={showTable ? 'View chart' : 'View as table'}
      onToggle={() => setShowTable((s) => !s)}
    >
      {showTable ? (
        series.length === 1 ? (
          <DataTable>
            <thead><tr><th>Period</th><th>Value</th></tr></thead>
            <tbody>
              {series[0].data.map((d) => (
                <tr key={d.label}><td>{d.label}</td><td>{d.value}{valueSuffix}</td></tr>
              ))}
            </tbody>
          </DataTable>
        ) : (
          <MultiTable>
            <thead>
              <tr>
                <th>Period</th>
                {series.map((s) => <th key={s.label}>{s.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {xLabels.map((lbl, i) => (
                <tr key={lbl}>
                  <td>{lbl}</td>
                  {series.map((s) => <td key={s.label}>{s.data[i]?.value}{valueSuffix}</td>)}
                </tr>
              ))}
            </tbody>
          </MultiTable>
        )
      ) : (
        <>
          {!single && (
            <Legend>
              {series.map((s) => (
                <LegendItem key={s.label}>
                  <LineKey $color={colorFor(s.hue)} />
                  {s.label}
                </LegendItem>
              ))}
            </Legend>
          )}
          <Plot ref={wrapRef}>
            <svg width={W} height={H} role="img" aria-label={`${title} chart`}>
              {yTicks.map((t) => (
                <g key={t}>
                  <line x1={pad.left} x2={W - pad.right} y1={yAt(t)} y2={yAt(t)} stroke={grid} strokeWidth={1} />
                  <text x={pad.left - 8} y={yAt(t) + 4} textAnchor="end" fontSize={11} fill={axisInk} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {t}
                  </text>
                </g>
              ))}

              {series.map((s) => {
                const pts = ptsFor(s)
                const color = colorFor(s.hue)
                return (
                  <g key={s.label}>
                    {single && (
                      <path
                        d={`${linePath(pts)} L${pts[pts.length - 1][0].toFixed(1)},${(pad.top + plotH).toFixed(1)} L${pts[0][0].toFixed(1)},${(pad.top + plotH).toFixed(1)} Z`}
                        fill={color}
                        opacity={0.1}
                      />
                    )}
                    <path d={linePath(pts)} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    {showAllMarkers && pts.map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r={4} fill={color} stroke={surface} strokeWidth={2} />
                    ))}
                    {/* end marker + direct label */}
                    {(() => {
                      const [ex, ey] = pts[pts.length - 1]
                      const v = s.data[s.data.length - 1].value
                      return (
                        <>
                          <circle cx={ex} cy={ey} r={4.5} fill={color} stroke={surface} strokeWidth={2} />
                          <text x={ex} y={ey - 10} textAnchor="end" fontSize={12} fontWeight={600} fill={labelInk} style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {v}{valueSuffix}
                          </text>
                        </>
                      )
                    })()}
                  </g>
                )
              })}

              {/* x labels */}
              {xLabels.map((lbl, i) => (i % labelEvery === 0 || i === n - 1 ? (
                <text key={lbl} x={xAt(i)} y={H - 8} textAnchor="middle" fontSize={11} fill={axisInk}>{lbl}</text>
              ) : null))}

              {/* crosshair */}
              {activeX != null && (
                <line x1={activeX} x2={activeX} y1={pad.top} y2={pad.top + plotH} stroke={axisInk} strokeWidth={1} opacity={0.4} />
              )}

              {hover != null && series.map((s) => {
                const [x, y] = ptsFor(s)[hover]
                const color = colorFor(s.hue)
                return <circle key={s.label} cx={x} cy={y} r={5} fill={color} stroke={surface} strokeWidth={2} />
              })}

              {/* hover hit layer */}
              <rect
                x={pad.left} y={pad.top} width={plotW} height={plotH}
                fill="transparent"
                style={{ cursor: 'crosshair' }}
                onMouseMove={(e) => {
                  const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
                  const x = e.clientX - rect.left
                  let nearest = 0
                  let best = Infinity
                  for (let i = 0; i < n; i++) {
                    const d = Math.abs(xAt(i) - x)
                    if (d < best) { best = d; nearest = i }
                  }
                  setHover(nearest)
                }}
                onMouseLeave={() => setHover(null)}
              />
            </svg>

            {hover != null && (
              <Tip style={{ left: xAt(hover), top: Math.min(...series.map((s) => yAt(s.data[hover].value))) - 12 }}>
                {series.map((s) => (
                  <TipRow key={s.label}>
                    <LineKey $color={colorFor(s.hue)} />
                    <TipValue>{s.data[hover].value}{valueSuffix}</TipValue>
                    <TipLabel>{s.label}</TipLabel>
                  </TipRow>
                ))}
              </Tip>
            )}
          </Plot>
        </>
      )}
    </ChartCard>
  )
}

export default LineChart
