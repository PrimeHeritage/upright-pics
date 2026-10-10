import { useSuspenseQuery } from '@tanstack/react-query'

import { CtaSection, HeroSection, IntroSection, ProcessSection, ShowreelSection } from './home-sections'
import { AboutSection, ContactSection, PageHeaderSection } from './other-sections'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { adminContentQuery } from '@/hooks/api/admin/content'

export type ContentTab = 'home' | 'about' | 'contact' | 'work' | 'services'

export default function Content({ tab, onTabChange }: { tab: ContentTab; onTabChange: (tab: ContentTab) => void }) {
  const { data } = useSuspenseQuery(adminContentQuery())

  return (
    <div className="max-w-4xl">
      <AdminPageHeader
        title="Page content"
        description="Edit the words and photos on each page. Each section saves on its own."
      />
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as ContentTab)}>
        <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 bg-surface p-1">
          <TabsTrigger value="home">Homepage</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="work">Work page</TabsTrigger>
          <TabsTrigger value="services">Services page</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="grid gap-6">
          <HeroSection value={data['home.hero']} />
          <IntroSection value={data['home.intro']} />
          <ProcessSection value={data['home.process']} />
          <ShowreelSection value={data['home.showreel']} />
          <CtaSection value={data['home.cta']} />
        </TabsContent>
        <TabsContent value="about">
          <AboutSection value={data['about.main']} />
        </TabsContent>
        <TabsContent value="contact">
          <ContactSection value={data['contact.main']} />
        </TabsContent>
        <TabsContent value="work">
          <PageHeaderSection value={data['work.header']} contentKey="work.header" title="Work page header" />
        </TabsContent>
        <TabsContent value="services">
          <PageHeaderSection value={data['services.header']} contentKey="services.header" title="Services page header" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
