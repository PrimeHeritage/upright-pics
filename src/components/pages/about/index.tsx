import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Button } from '@/components/ui/button'
import { PageSection } from '@/components/ui/custom/page-section'
import { Reveal, RevealWords } from '@/components/ui/custom/reveal'
import { CONTACT_CTA } from '@/constants/navigation'
import { aboutContentQuery } from '@/hooks/api/site'

export default function About() {
  const { data: content } = useSuspenseQuery(aboutContentQuery())

  return (
    <>
      {/* Portrait hero */}
      <section className="grid min-h-[100dvh] md:grid-cols-2">
        <div className="relative min-h-[70dvh] md:order-2 md:min-h-0">
          <MediaImage image={content.portrait} fill priority sizes="(min-width: 768px) 50vw, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40 md:bg-gradient-to-r md:from-ink md:via-transparent md:to-transparent" />
        </div>
        <div className="container-site relative -mt-40 flex flex-col justify-end pb-16 md:mt-0 md:pt-40 md:pb-20">
          <h1 className="max-w-xl font-display text-5xl leading-[1.04] md:text-6xl xl:text-7xl">
            <RevealWords text={content.heading} />
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-lg text-xl leading-relaxed text-paper/85">{content.lead}</p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <PageSection spacing="md">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="space-y-6 md:col-span-6 md:col-start-4">
            {content.story.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className={i === 0 ? 'font-display text-3xl leading-[1.3] md:text-4xl' : 'text-lg leading-relaxed text-ash'}>
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Facts */}
      {content.stats.length > 0 ? (
        <section className="border-y border-line">
          <dl className="container-site grid divide-line sm:grid-cols-3 sm:divide-x">
            {content.stats.map((stat) => (
              <div key={stat.label} className="border-b border-line py-10 last:border-b-0 sm:border-b-0 sm:px-8 sm:first:pl-0 md:py-14">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-5xl text-gold md:text-6xl">{stat.value}</span>
                  <span className="mt-3 block text-ash">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* Wide image */}
      {content.secondaryImage ? (
        <Reveal className="container-site py-24 md:py-32">
          <MediaImage image={content.secondaryImage} sizes="100vw" className="aspect-[16/9] md:aspect-[21/9]" />
        </Reveal>
      ) : null}

      {/* Values */}
      <PageSection spacing="md" className="pt-0 md:pt-0">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-4">
            <h2 className="font-display text-5xl leading-none md:text-6xl">
              How we <span className="italic">work</span>
            </h2>
          </Reveal>
          <ul className="md:col-span-7 md:col-start-6">
            {content.values.map((value, i) => (
              <li key={value.title} className="grid gap-3 border-t border-line py-8 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <Reveal delay={i * 0.05}>
                  <h3 className="font-display text-2xl italic">{value.title}</h3>
                </Reveal>
                <Reveal delay={i * 0.05 + 0.05}>
                  <p className="text-ash">{value.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-20 flex justify-start md:mt-28 md:justify-end">
          <Button asChild size="lg" className="group">
            <Link to="/contact">
              {CONTACT_CTA}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </PageSection>
    </>
  )
}
