import type { LinkProps } from '@tanstack/react-router'

export interface NavItem {
  label: string
  to: LinkProps['to']
}

/** Primary navigation. "Book a shoot" is the single contact CTA, so Contact is not repeated here. */
export const primaryNav: Array<NavItem> = [
  { label: 'Work', to: '/work' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
]

export const CONTACT_CTA = 'Book a shoot'
