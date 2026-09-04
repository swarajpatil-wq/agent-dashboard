import { useLayoutEffect, useRef, useState } from 'react'
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
  formatAxis?: (v: number) => string
}

const Plot = styled.div`
  position: relative;
  width: 100%;
`

const Bar = styled.rect`
  transition: opacity 0.12s ease;
  &:hover { opacity: 0.82; }
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

function BarChart({ title, data, hue = 'primaryHue', formatValue = (v) => String(v), formatAxis = formatValue }: BarChartProps) {
  const theme: any = useTheme()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
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

  const W = width
  const H = 240
  const pad = { top: 24, right: 8, bottom: 56, left: 40 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom

  const max = Math.max(...data.map((d) => d.count), 1)
  const yTicks = niceTicks(0, max, 4)
  const yHi = yTicks[yTicks.length - 1]
  const ySpan = yHi || 1

  const color = getColor({ theme, hue, light: { shade: 600 }, dark: { shade: 400 } })
  const grid = getColor({ theme, variable: 'border.subtle' })
  const axisInk = getColor({ theme, variable: 'foreground.subtle' })
  const labelInk = getColor({ theme, variable: 'foreground.default' })

  const n = data.length
  const slot = plotW / n
  const barW = Math.min(28, slot * 0.6)
  const xAt = (i: number) => pad.left + slot * i + slot / 2
  const yAt = (v: number) => pad.top + plotH - (v / ySpan) * plotH
  const baselineY = pad.top + plotH

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
        <Plot ref={wrapRef}>
          <svg width={W} height={H} role="img" aria-label={`${title} chart`}>
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={pad.left} x2={W - pad.right} y1={yAt(t)} y2={yAt(t)} stroke={grid} strokeWidth={1} />
                <text x={pad.left - 8} y={yAt(t) + 4} textAnchor="end" fontSize={11} fill={axisInk} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatAxis(t)}
                </text>
              </g>
            ))}

            {data.map((d, i) => {
              const h = (d.count / ySpan) * plotH
              const x = xAt(i) - barW / 2
              const y = baselineY - h
              return (
                <g key={d.name}>
                  <Bar
                    x={x} y={y} width={barW} height={Math.max(h, 0)}
                    rx={4} ry={4}
                    fill={color}
                  >
                    <title>{`${d.name}: ${formatValue(d.count)}`}</title>
                  </Bar>
                  <text x={xAt(i)} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill={labelInk} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatValue(d.count)}
                  </text>
                  <text
                    x={xAt(i)} y={baselineY + 16}
                    textAnchor="end" fontSize={11} fill={axisInk}
                    transform={`rotate(-30 ${xAt(i)} ${baselineY + 16})`}
                  >
                    {d.name}
                  </text>
                </g>
              )
            })}

            <line x1={pad.left} x2={W - pad.right} y1={baselineY} y2={baselineY} stroke={grid} strokeWidth={1} />
          </svg>
        </Plot>
      )}
    </ChartCard>
  )
}

export default BarChart
