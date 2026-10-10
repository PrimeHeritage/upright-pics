import HeaderContent from './content'
import HeaderShell from './sticky'
import type { SiteSettings } from '@/types'

export default function Header({ overlay, settings }: { overlay: boolean; settings: SiteSettings }) {
  return (
    <HeaderShell overlay={overlay}>
      <HeaderContent settings={settings} />
    </HeaderShell>
  )
}
