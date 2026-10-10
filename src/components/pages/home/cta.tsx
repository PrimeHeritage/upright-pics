import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/custom/reveal'
import { CONTACT_CTA } from '@/constants/navigation'
import { whatsappLink } from '@/lib/utils'
import type { CtaContent } from '@/types'

export default function Cta({
  content,
  whatsapp,
  businessName,
}: {
  content: CtaContent
  whatsapp: string
  businessName: string
}) {
  return (
    <section className="container-site py-24 md:py-32">
      <div className="relative isolate grid overflow-hidden border border-line md:grid-cols-12">
        <div className="relative z-10 flex flex-col justify-center p-8 md:col-span-7 md:p-16 lg:p-20">
          <Reveal>
            <h2 className="font-display text-5xl leading-[1.02] md:text-7xl">{content.heading}</h2>
            <p className="mt-6 max-w-md text-lg text-ash">{content.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild size="lg" className="group">
                <Link to="/contact">
                  {CONTACT_CTA}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              {whatsapp ? (
                <a
                  href={whatsappLink(whatsapp, `Hello ${businessName}, I would like to check your availability.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-sm text-paper/85"
                >
                  or chat on WhatsApp
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
        {content.image ? (
          <div className="relative min-h-80 md:col-span-5 md:min-h-[34rem]">
            <MediaImage image={content.image} fill sizes="(min-width: 768px) 40vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent md:bg-gradient-to-r md:from-surface md:via-transparent" />
          </div>
        ) : null}
      </div>
    </section>
  )
}
