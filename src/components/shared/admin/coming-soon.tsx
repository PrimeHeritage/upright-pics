import { Hammer } from 'lucide-react'

import { AdminPageHeader } from './page-header'

/** Placeholder for admin sections that land in the next build phase. */
export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <>
      <AdminPageHeader title={title} description={description} />
      <div className="flex flex-col items-start rounded-lg border border-dashed border-line-strong p-8 md:p-12">
        <Hammer className="size-6 text-gold" strokeWidth={1.5} />
        <p className="mt-4 font-display text-2xl">Being built</p>
        <p className="mt-2 max-w-md text-sm text-ash">
          This editor is part of the next update. Until then, the content shown on the website stays as it is.
        </p>
      </div>
    </>
  )
}
