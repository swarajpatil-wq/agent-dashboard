import type { ReactNode } from 'react'
import styled from 'styled-components'
import { getColor } from '@zendesk-ui/react-components'

export const Card = styled.figure`
  margin: 0;
  background-color: ${({ theme }) => getColor({ theme, variable: 'background.raised' })};
  border: 1px solid ${({ theme }) => getColor({ theme, variable: 'border.default' })};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.space.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};
`

export const Title = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

export const Toggle = styled.button`
  appearance: none;
  background: transparent;
  border: 1px solid ${({ theme }) => getColor({ theme, variable: 'border.default' })};
  border-radius: ${({ theme }) => theme.borderRadii.sm};
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: ${({ theme }) => `${theme.space.xxs} ${theme.space.sm}`};
  cursor: pointer;
  white-space: nowrap;
  &:hover { background-color: ${({ theme }) => getColor({ theme, variable: 'background.subtle' })}; }
`

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  th, td {
    text-align: left;
    padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
    border-bottom: 1px solid ${({ theme }) => getColor({ theme, variable: 'border.subtle' })};
  }
  th { color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })}; font-weight: ${({ theme }) => theme.fontWeights.semibold}; }
  td:last-child { text-align: right; font-variant-numeric: tabular-nums; color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })}; }
  td { color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })}; }
`

interface ChartCardProps {
  title: string
  toggleLabel: string
  onToggle: () => void
  children: ReactNode
}

export default function ChartCard({ title, toggleLabel, onToggle, children }: ChartCardProps) {
  return (
    <Card>
      <Head>
        <Title>{title}</Title>
        <Toggle onClick={onToggle} aria-expanded={toggleLabel === 'View chart'}>{toggleLabel}</Toggle>
      </Head>
      {children}
    </Card>
  )
}
