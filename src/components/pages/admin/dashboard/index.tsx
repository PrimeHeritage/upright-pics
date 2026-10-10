import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, BookOpen, ImagePlus, Inbox, PenLine, Settings } from 'lucide-react'

import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { Badge } from '@/components/ui/badge'
import { dashboardQuery } from '@/hooks/api/admin/dashboard'
import { cn, lagosHour } from '@/lib/utils'

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

function timeAgo(iso: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000
  const steps: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.35, 'week'],
    [12, 'month'],
  ]
  let value = diff
  for (const [size, unit] of steps) {
    if (Math.abs(value) < size) return relative.format(Math.round(value), unit)
    value /= size
  }
  return relative.format(Math.round(value), 'year')
}

export default function Dashboard({ email }: { email: string }) {
  const { data } = useSuspenseQuery(dashboardQuery())
  const { counts, toggles, recentInquiries } = data
  const greeting = (() => {
    const h = lagosHour()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  })()

  const stats = [
    { label: 'New enquiries', value: counts.newInquiries, to: '/admin/inquiries' as const, highlight: counts.newInquiries > 0 },
    { label: 'Published albums', value: `${counts.publishedAlbums}/${counts.albums}`, to: '/admin/albums' as const },
    { label: 'Photos', value: counts.photos, to: '/admin/albums' as const },
    { label: 'Services shown', value: counts.services, to: '/admin/services' as const },
  ]

  const actions = [
    { label: 'Add an album', icon: ImagePlus, to: '/admin/albums' as const },
    { label: 'Edit homepage text', icon: PenLine, to: '/admin/content' as const },
    { label: 'Contact details', icon: Settings, to: '/admin/settings' as const },
  ]

  return (
    <>
      <AdminPageHeader title={`${greeting}.`} description={`Signed in as ${email}. Here is what is happening on your website.`} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className={cn(
              'group rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong',
              s.highlight && 'border-gold/40',
            )}
          >
            <p className="text-sm text-ash">{s.label}</p>
            <p className={cn('mt-3 font-display text-4xl tabular-nums', s.highlight && 'text-gold')}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-medium">Latest enquiries</h3>
            <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-sm text-ash hover:text-paper">
              View all <ArrowUpRight className="size-4" />
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="flex flex-col items-start px-5 py-10">
              <Inbox className="size-6 text-smoke" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-ash">No enquiries yet. They will appear here as soon as someone uses the booking form.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {recentInquiries.map((q) => (
                <li key={q.id} className="flex items-start gap-4 px-5 py-4">
                  <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-sm">
                    {q.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{q.name}</p>
                      {q.status === 'new' ? <Badge className="bg-gold text-ink">New</Badge> : null}
                    </div>
                    <p className="mt-0.5 text-xs text-ash">
                      {[q.service, q.phone].filter(Boolean).join(' · ')}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-paper/80">{q.message}</p>
                  </div>
                  {/* Relative time differs by a few seconds between server and browser. */}
                  <span className="shrink-0 text-xs text-smoke" suppressHydrationWarning>
                    {timeAgo(q.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid content-start gap-6">
          <section className="rounded-lg border border-line bg-surface p-5">
            <h3 className="font-medium">Quick actions</h3>
            <ul className="mt-4 grid gap-2">
              {actions.map((a) => (
                <li key={a.label}>
                  <Link
                    to={a.to}
                    className="flex items-center gap-3 rounded-md border border-line px-3 py-2.5 text-sm transition-colors hover:border-line-strong hover:bg-surface-2"
                  >
                    <a.icon className="size-4 text-gold" strokeWidth={1.75} />
                    {a.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/admin/guide.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-md border border-line px-3 py-2.5 text-sm transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <BookOpen className="size-4 text-gold" strokeWidth={1.75} />
                  How to use the admin
                </a>
              </li>
            </ul>
          </section>

          <section className="rounded-lg border border-line bg-surface p-5">
            <h3 className="font-medium">On the website</h3>
            <ul className="mt-4 grid gap-3 text-sm">
              {[
                ['Packages section', toggles.showPackages],
                ['Package prices', toggles.showPackages && toggles.showPrices],
                ['Testimonials', toggles.showTestimonials],
              ].map(([label, on]) => (
                <li key={String(label)} className="flex items-center justify-between">
                  <span className="text-ash">{label}</span>
                  <span className={on ? 'text-paper' : 'text-smoke'}>{on ? 'Showing' : 'Hidden'}</span>
                </li>
              ))}
            </ul>
            <Link to="/admin/settings" className="mt-4 inline-block text-sm text-gold hover:text-gold-soft">
              Change in settings
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
