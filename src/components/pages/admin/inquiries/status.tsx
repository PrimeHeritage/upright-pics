import { cn } from '@/lib/utils'
import type { InquiryStatus } from '@/types'

export const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
}

export function StatusPill({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs',
        status === 'new' && 'border-gold/50 bg-gold/15 text-gold',
        status === 'read' && 'border-line-strong text-paper/80',
        status === 'replied' && 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
        status === 'archived' && 'border-line text-smoke',
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
