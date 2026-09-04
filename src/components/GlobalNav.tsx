import { useState } from 'react'
import { Header, Nav, Subnav, Main, Product, ProfileMenu } from '@zendesk-ui/navigation'
import { Drawer } from '@zendesk-ui/react-components'
import { getFormattedProducts } from '@zendesk-ui/product-tray'
import HomeIcon from '@zendesk-ui/assets/icons/20px/home-fill.svg?react'
import ViewsIcon from '@zendesk-ui/assets/icons/20px/list-bullet.svg?react'
import CustomersIcon from '@zendesk-ui/assets/icons/20px/person-fill.svg?react'
import OrganizationsIcon from '@zendesk-ui/assets/icons/20px/person-list-fill.svg?react'
import SearchIcon from '@zendesk-ui/assets/icons/20px/magnifying-glass.svg?react'
import HelpIcon from '@zendesk-ui/assets/icons/20px/rescue-ring-fill.svg?react'
import AgentDashboard from '../pages/AgentDashboard'
import PlaceholderPage from '../pages/PlaceholderPage'

const products = getFormattedProducts({
  products: [
    { key: 'lotus' },
    { key: 'guide' },
    { key: 'gather' },
    { key: 'chat' },
    { key: 'talk' },
    { key: 'explore' },
    { key: 'sell' },
    { key: 'workforce_management' },
    { key: 'quality_assurance' },
    { key: 'ai_agents' },
    { key: 'central_admin' },
  ],
  locale: 'en-US',
  selectedKey: 'lotus',
})

const subnavItems = [
  { key: 'dashboard', label: 'Agent dashboard', badge: undefined },
  { key: 'your-tickets', label: 'Your tickets', badge: 5 },
  { key: 'unassigned', label: 'Unassigned', badge: 3 },
  { key: 'solved', label: 'Recently solved', badge: undefined },
] as const

function GlobalNav() {
  const [currentNav, setCurrentNav] = useState('views')
  const [currentSubnav, setCurrentSubnav] = useState('dashboard')

  const renderPage = () => {
    if (currentNav === 'views' && currentSubnav === 'dashboard') {
      return <AgentDashboard />
    }
    const subnav = subnavItems.find((i) => i.key === currentSubnav)
    return <PlaceholderPage title={currentNav === 'views' ? subnav?.label ?? 'Views' : navLabel(currentNav)} />
  }

  return (
    <Product isFlora locale="en-US" products={products}>
      <Header startChildren={<><Header.Separator /><Header.Button>Acme</Header.Button></>}>
        <Header.IconButton tooltip="Search">
          <SearchIcon />
        </Header.IconButton>
        <Header.Help>
          <Drawer.Header tag="h2">Help</Drawer.Header>
          <Drawer.Body>
            <HelpIcon />
          </Drawer.Body>
        </Header.Help>
        <ProfileMenu name="Swaraj Patil">
          <ProfileMenu.ItemGroup aria-label="Status" type="radio">
            <ProfileMenu.Item status="available" value="available">Online</ProfileMenu.Item>
            <ProfileMenu.Item status="away" value="away">Away</ProfileMenu.Item>
          </ProfileMenu.ItemGroup>
          <ProfileMenu.ItemGroup aria-label="Session">
            <ProfileMenu.Item value="profile">Manage profile</ProfileMenu.Item>
            <ProfileMenu.Item value="logout">Sign out</ProfileMenu.Item>
          </ProfileMenu.ItemGroup>
        </ProfileMenu>
      </Header>

      <Nav>
        <Nav.Item
          icon={<HomeIcon />}
          isCurrent={currentNav === 'home'}
          onAction={() => setCurrentNav('home')}
        >
          Home
        </Nav.Item>
        <Nav.Item
          icon={<ViewsIcon />}
          isCurrent={currentNav === 'views'}
          onAction={() => setCurrentNav('views')}
        >
          Views
        </Nav.Item>
        <Nav.Item
          icon={<CustomersIcon />}
          isCurrent={currentNav === 'customers'}
          onAction={() => setCurrentNav('customers')}
        >
          Customers
        </Nav.Item>
        <Nav.Item
          icon={<OrganizationsIcon />}
          isCurrent={currentNav === 'organizations'}
          onAction={() => setCurrentNav('organizations')}
        >
          Organizations
        </Nav.Item>
      </Nav>

      {currentNav === 'views' && (
        <Subnav header="Views" isCollapsible>
          {subnavItems.map(({ key, label, badge }) => (
            <Subnav.Item
              key={key}
              isCurrent={currentSubnav === key}
              badge={badge}
              onAction={() => setCurrentSubnav(key)}
            >
              {label}
            </Subnav.Item>
          ))}
        </Subnav>
      )}

      <Main>{renderPage()}</Main>
    </Product>
  )
}

function navLabel(key: string) {
  switch (key) {
    case 'home':
      return 'Home'
    case 'customers':
      return 'Customers'
    case 'organizations':
      return 'Organizations'
    default:
      return 'Support'
  }
}

export default GlobalNav
