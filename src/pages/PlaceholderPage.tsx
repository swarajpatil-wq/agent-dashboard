import styled from 'styled-components'
import { XXL } from '@zendesk-ui/react-components'

const Wrap = styled.div`
  padding: ${({ theme }) => theme.space.lg};
`

function PlaceholderPage({ title }: { title: string }) {
  return (
    <Wrap>
      <XXL tag="h1">{title}</XXL>
    </Wrap>
  )
}

export default PlaceholderPage
