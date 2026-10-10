import { Mail, MessageCircle, Phone, Trash2 } from 'lucide-react'

import { formatEventDate, formatReceived } from './columns'
import { STATUS_LABEL } from './status'
import { ConfirmDelete } from '@/components/shared/admin/confirm-delete'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { Button } from '@/components/ui/button'
import { cn, formatPhone, telLink, whatsappLink } from '@/lib/utils'
import { INQUIRY_STATUSES } from '@/types'
import type { Inquiry, InquiryStatus } from '@/types'

export function InquiryDetailSheet({
  inquiry,
  businessName,
  onClose,
  onStatus,
  onDelete,
}: {
  inquiry: Inquiry | null
  businessName: string
  onClose: () => void
  onStatus: (status: InquiryStatus) => void
  onDelete: () => void
}) {
  const firstName = inquiry?.name.split(' ')[0] ?? ''
  const reply = inquiry
    ? `Hello ${firstName}, thank you for contacting ${businessName}${inquiry.service ? ` about ${inquiry.service.toLowerCase()}` : ''}. `
    : ''

  return (
    <EditSheet open={inquiry !== null} onOpenChange={(o) => !o && onClose()} title={inquiry?.name ?? ''} description={inquiry ? `Received ${formatReceived(inquiry.createdAt)}` : undefined}>
      {inquiry ? (
        <div className="grid gap-6">
          <div className="flex flex-wrap gap-2">
            <Button asChild onClick={() => inquiry.status !== 'replied' && onStatus('replied')}>
              <a href={whatsappLink(inquiry.phone, reply)} target="_blank" rel="noreferrer">
                <MessageCircle /> Reply on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={telLink(inquiry.phone)}>
                <Phone /> Call
              </a>
            </Button>
            {inquiry.email ? (
              <Button asChild variant="outline">
                <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Your enquiry with ${businessName}`)}&body=${encodeURIComponent(reply)}`}>
                  <Mail /> Email
                </a>
              </Button>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-line bg-surface p-4 text-sm">
            {[
              ['Phone', formatPhone(inquiry.phone)],
              ['Email', inquiry.email || 'Not given'],
              ['Service', inquiry.service || 'Not specified'],
              ['Date needed', formatEventDate(inquiry.eventDate) ?? 'Flexible'],
              ['Location', inquiry.location || 'Not given'],
            ].map(([label, value]) => (
              <div key={label} className={label === 'Email' ? 'col-span-2 min-w-0' : 'min-w-0'}>
                <dt className="text-xs text-ash">{label}</dt>
                <dd className="mt-1 break-words">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-xs text-ash">Message</p>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
          </div>

          <div>
            <p className="text-xs text-ash">Status</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Status">
              {INQUIRY_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={inquiry.status === s}
                  onClick={() => onStatus(s)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm transition-colors',
                    inquiry.status === s ? 'border-gold bg-gold text-ink' : 'border-line-strong text-ash hover:text-paper',
                  )}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-line pt-5">
            <ConfirmDelete
              title="Delete this enquiry?"
              description="It will be removed permanently. Archive it instead if you might need it later."
              onConfirm={onDelete}
              trigger={
                <Button type="button" variant="ghost" className="text-ash hover:text-destructive">
                  <Trash2 /> Delete enquiry
                </Button>
              }
            />
          </div>
        </div>
      ) : null}
    </EditSheet>
  )
}
