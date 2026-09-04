import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { getColor } from '@zendesk-ui/react-components'

export type Tone = 'danger' | 'warning' | 'neutral' | 'info' | 'success'

interface BadgeProps {
  tone: Tone
  children: ReactNode
  icon?: ReactNode
}

function toneHue(tone: Tone): string {
  switch (tone) {
    case 'danger':
      return 'dangerHue'
    case 'warning':
      return 'warningHue'
    case 'info':
      return 'primaryHue'
    case 'success':
      return 'successHue'
    default:
      return 'neutralHue'
  }
}

export const Badge = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
  svg { width: 12px; height: 12px; }
  ${({ theme, $tone }) => {
    const hue = toneHue($tone)
    const fg = getColor({ theme, hue, light: { shade: 800 }, dark: { shade: 300 } })
    const bg = getColor({ theme, hue, light: { shade: 200 }, dark: { shade: 700 }, transparency: theme.opacity[200] })
    return css`
      color: ${fg};
      background-color: ${bg};
    `
  }}
`

export default function BadgeComponent({ tone, children, icon }: BadgeProps) {
  return (
    <Badge $tone={tone}>
      {icon}
      {children}
    </Badge>
  )
}
