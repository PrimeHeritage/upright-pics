import {
  FileText,
  FolderOpen,
  Images,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Settings,
  Sparkles,
} from 'lucide-react'
import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

export interface AdminNavItem {
  label: string
  to: LinkProps['to']
  icon: LucideIcon
  /** Exact match for the dashboard so it isn't "active" on every admin page. */
  exact?: boolean
  badge?: 'newInquiries'
}

export interface AdminNavGroup {
  label: string
  items: Array<AdminNavItem>
}

export const adminNav: Array<AdminNavGroup> = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
      { label: 'Enquiries', to: '/admin/inquiries', icon: Inbox, badge: 'newInquiries' },
    ],
  },
  {
    label: 'Portfolio',
    items: [
      { label: 'Albums', to: '/admin/albums', icon: Images },
      { label: 'Categories', to: '/admin/categories', icon: FolderOpen },
    ],
  },
  {
    label: 'Business',
    items: [
      { label: 'Services', to: '/admin/services', icon: Sparkles },
      { label: 'Packages', to: '/admin/packages', icon: Package },
      { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquareQuote },
    ],
  },
  {
    label: 'Website',
    items: [
      { label: 'Page content', to: '/admin/content', icon: FileText },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
    ],
  },
]
