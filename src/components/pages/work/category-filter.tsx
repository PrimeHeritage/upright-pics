import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import type { Category } from '@/types'

/** Filter chips backed by the typed `?category=` search param (shareable URLs). */
export default function CategoryFilter({
  categories,
  active,
}: {
  categories: Array<Category>
  active?: string
}) {
  const items = [{ name: 'All', slug: undefined as string | undefined }, ...categories]
  return (
    <nav aria-label="Filter by category" className="sticky top-16 z-30 border-y border-line bg-ink/85 backdrop-blur-xl md:top-[4.5rem]">
      <ul className="container-site flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
        {items.map((c) => {
          const isActive = active === c.slug
          return (
            <li key={c.name} className="shrink-0">
              <Link
                to="/work"
                search={c.slug ? { category: c.slug } : {}}
                resetScroll={false}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex h-9 items-center rounded-full px-4 text-sm transition-colors duration-300',
                  isActive ? 'bg-paper text-ink' : 'text-ash hover:bg-paper/5 hover:text-paper',
                )}
              >
                {c.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
