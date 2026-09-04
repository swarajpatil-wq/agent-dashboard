import styled from 'styled-components'
import { getColor } from '@zendesk-ui/react-components'
import ChevronUpIcon from '@zendesk-ui/assets/icons/20px/chevron-up.svg?react'
import ChevronDownIcon from '@zendesk-ui/assets/icons/20px/chevron-down.svg?react'
import Sparkline from './charts/Sparkline'
import type { Stat } from '../data/mockData'

const Card = styled.div`
  background-color: ${({ theme }) => getColor({ theme, variable: 'background.raised' })};
  border: 1px solid ${({ theme }) => getColor({ theme, variable: 'border.default' })};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.space.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`

const Label = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
`

const Value = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.default' })};
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  line-height: ${({ theme }) => theme.lineHeights.sm};
`

const Delta = styled.span<{ $good: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $good }) =>
    getColor({ theme, hue: $good ? 'successHue' : 'dangerHue', light: { shade: 700 }, dark: { shade: 400 } })};

  svg { width: 14px; height: 14px; }
`

const DeltaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`

const Spacer = styled.span`
  color: ${({ theme }) => getColor({ theme, variable: 'foreground.subtle' })};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

function StatTile({ stat, showSparkline = true }: { stat: Stat; showSparkline?: boolean }) {
  const good = stat.deltaDirection === stat.goodWhen
  const sign = stat.deltaDirection === 'up' ? '+' : '−'
  const DeltaIcon = stat.deltaDirection === 'up' ? ChevronUpIcon : ChevronDownIcon

  return (
    <Card>
      <Label>{stat.label}</Label>
      <Value>{stat.value}</Value>
      <DeltaRow>
        <Delta $good={good}>
          <DeltaIcon />
          {sign}
          {stat.deltaPct}%
        </Delta>
        <Spacer>vs prev. period</Spacer>
      </DeltaRow>
      {showSparkline && <Sparkline data={stat.sparkline} />}
    </Card>
  )
}

export default StatTile
