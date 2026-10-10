import { Link } from '@tanstack/react-router'

import NavGroup from './nav-group'
import NavUser from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { adminNav } from '@/constants/admin-navigation'

export default function AdminSidebar({ email, badges }: { email: string; badges: Record<string, number> }) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <span className="block size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30">
                  <img
                    src="/brand/upc-logo.jpg"
                    alt=""
                    className="size-full origin-[50%_8%] scale-[1.55] object-cover object-[50%_5%]"
                  />
                </span>
                <span className="grid leading-tight">
                  <span className="font-display text-base">Upright Studio</span>
                  <span className="text-xs text-ash">Website admin</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {adminNav.map((group) => (
          <NavGroup key={group.label} group={group} badges={badges} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
