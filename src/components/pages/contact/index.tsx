import { useSuspenseQuery } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'

import { InquiryForm } from '@/components/shared/inquiry-form'
import { SocialLinks } from '@/components/shared/social-links'
import { Button } from '@/components/ui/button'
import { Reveal, RevealWords } from '@/components/ui/custom/reveal'
import { servicesQuery } from '@/hooks/api/services'
import { contactContentQuery, settingsQuery } from '@/hooks/api/site'
import { formatPhone, telLink, whatsappLink } from '@/lib/utils'

export default function Contact({ service }: { service?: string }) {
  const { data: settings } = useSuspenseQuery(settingsQuery())
  const { data: content } = useSuspenseQuery(contactContentQuery())
  const { data: services } = useSuspenseQuery(servicesQuery())

  return (
    <section className="container-site grid gap-16 pt-20 pb-24 md:grid-cols-12 md:gap-8 md:pt-28 md:pb-32">
      <div className="md:col-span-5">
        <h1 className="font-display text-6xl leading-none md:text-6xl lg:text-7xl xl:text-8xl">
          <RevealWords text={content.heading} />
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-md text-lg text-ash">{content.body}</p>

          <div className="mt-12 border-t border-line pt-10">
            <p className="text-paper/85">{content.responseNote}</p>
            {settings.whatsapp ? (
              <Button asChild size="lg" variant="outline" className="mt-6">
                <a
                  href={whatsappLink(settings.whatsapp, `Hello ${settings.businessName}, I would like to make an enquiry.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="text-gold" />
                  Chat on WhatsApp
                </a>
              </Button>
            ) : null}
          </div>

          <dl className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <div>
              <dt className="text-label text-smoke">Call</dt>
              <dd className="mt-3 space-y-1">
                {settings.phones.map((p) => (
                  <a key={p} href={telLink(p)} className="link-underline block w-fit text-lg">
                    {formatPhone(p)}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-label text-smoke">Email</dt>
              <dd className="mt-3">
                <a href={`mailto:${settings.email}`} className="link-underline break-all">
                  {settings.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-label text-smoke">Studio</dt>
              <dd className="mt-3 text-paper/85">{settings.location}</dd>
            </div>
            <div>
              <dt className="text-label text-smoke">Follow</dt>
              <dd className="mt-3">
                <SocialLinks socials={settings.socials} className="gap-x-4" />
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="md:col-span-6 md:col-start-7 md:pt-4">
        <InquiryForm
          services={services.map((s) => s.title)}
          defaultService={service}
          whatsapp={settings.whatsapp}
          businessName={settings.businessName}
        />
      </Reveal>
    </section>
  )
}
