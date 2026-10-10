import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[70dvh] flex-col justify-center py-32">
      <p className="text-label text-gold">Error 404</p>
      <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[1.05] md:text-7xl">
        This frame didn’t make the final cut.
      </h1>
      <p className="mt-6 max-w-md text-ash">
        The page you are looking for has moved or no longer exists.
      </p>
      <div className="mt-10">
        <Button asChild size="lg">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </section>
  )
}
