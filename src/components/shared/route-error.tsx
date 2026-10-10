import { useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export default function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter()
  return (
    <section className="container-site flex min-h-[70dvh] flex-col justify-center py-32">
      <p className="text-label text-gold">Something went wrong</p>
      <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.1] md:text-6xl">
        We couldn’t load this page.
      </h1>
      <p className="mt-6 max-w-md text-ash">
        Please try again. If it keeps happening, reach us on WhatsApp.
      </p>
      {import.meta.env.DEV ? (
        <pre className="mt-6 max-w-2xl overflow-auto bg-surface p-4 text-xs text-ash">{error instanceof Error ? error.message : String(error)}</pre>
      ) : null}
      <div className="mt-10">
        <Button
          size="lg"
          onClick={() => {
            reset()
            void router.invalidate()
          }}
        >
          Try again
        </Button>
      </div>
    </section>
  )
}
