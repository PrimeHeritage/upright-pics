import { ChevronsUpDown, ExternalLink, KeyRound, LogOut } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useSignOut } from '@/hooks/api/admin/auth'

export default function NavUser({ email }: { email: string }) {
  const { isMobile } = useSidebar()
  const signOut = useSignOut()
  const initial = email.charAt(0).toUpperCase() || 'A'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm text-gold">
                {initial}
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm">Admin</span>
                <span className="truncate text-xs text-ash">{email}</span>
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-smoke" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={8} className="min-w-56">
            <DropdownMenuLabel className="truncate font-normal text-ash">{email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink /> View website
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" hash="security">
                <KeyRound /> Change password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => signOut.mutate()} disabled={signOut.isPending}>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
