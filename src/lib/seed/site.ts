import { seedImages as img } from './images'
import type {
  AboutContent,
  ContactContent,
  HomeContent,
  PageHeaderContent,
  SiteSettings,
} from '@/types'

/**
 * Default site settings and page copy. Contact details come from the client
 * brief (assets/WEB_DESIGN_Upright_Pictures_Concepts.docx); social URLs are
 * best guesses. Everything here is editable in the admin.
 */
export const seedSettings: SiteSettings = {
  businessName: 'Upright Pictures Concepts',
  shortName: 'UPC',
  tagline: 'Capturing moments, delivering excellence.',
  logo: {
    src: '/brand/upc-logo.jpg',
    width: 488,
    height: 511,
    alt: 'Upright Pictures Concepts monogram',
  },
  email: 'uprightpictureconcepts@gmail.com',
  phones: ['08104817424', '09049314932'],
  whatsapp: '08104817424',
  location: 'Lagos, Nigeria',
  socials: {
    instagram: 'https://www.instagram.com/uprightpicturesconcepts',
    tiktok: 'https://www.tiktok.com/@uprightpictureconcepts',
    youtube: 'https://www.youtube.com/@uprightpictureconcepts',
    x: 'https://x.com/BeloveBenChuks',
  },
  footerNote: 'Delivery is the language of competence.',
  showPackages: true,
  showPrices: true,
  showTestimonials: true,
  seo: {
    title: 'Upright Pictures Concepts | Photography, Film & Framing in Lagos',
    description:
      'Wedding, portrait and event photography, videography, drone coverage, enlargement and framing by Upright Pictures Concepts, Lagos.',
    image: img.coralBride,
  },
}

export const seedHome: HomeContent = {
  hero: {
    headline: 'Moments worth',
    headlineEmphasis: 'keeping.',
    subheadline:
      'Photography, film and framing for weddings, portraits and celebrations in Lagos and beyond.',
    primaryCta: 'View the work',
    secondaryCta: 'Book a shoot',
    slides: [img.coralBride, img.oliveCouple, img.turtleneck, img.blackSuit, img.capPortrait],
  },
  intro: {
    statement:
      'We photograph people at their most honest, then make sure the moment outlives the day.',
    body: 'From the first frame to the finished print, everything happens in-house: shooting, editing, enlargement and framing. One team, start to finish, so nothing gets lost between hand-offs.',
    image: img.collarPrint,
  },
  process: {
    heading: 'From shoot to frame',
    intro: 'Most studios stop at the download link. We keep going until it is on your wall.',
    steps: [
      {
        title: 'Shoot',
        body: 'Studio, home or venue. We plan the light, the poses and the timeline with you before the day.',
        image: img.shooting,
      },
      {
        title: 'Edit',
        body: 'Every image is colour graded and retouched by hand, with your preferences kept on file.',
        image: img.lens,
      },
      {
        title: 'Print',
        body: 'Enlargements on quality paper and canvas, sized for the space they will live in.',
        image: img.framesInHand,
      },
      {
        title: 'Frame',
        body: 'Classic, frameless and 3D frames, finished in our workshop and ready to hang.',
        image: img.galleryWall,
      },
    ],
  },
  showreel: {
    heading: 'Seen from above',
    caption: 'Aerial photography and film for weddings, events and property.',
    videoUrl: '',
    poster: img.aerialRiver,
  },
  cta: {
    heading: 'Have a date in mind?',
    body: 'Tell us about the day. We will reply with availability and a quote, usually within a few hours.',
    image: img.coupleMono,
  },
}

export const seedAbout: AboutContent = {
  heading: 'The person behind the lens',
  lead: 'Upright Pictures Concepts is the Lagos studio of Chukwudi Benjamin Mbam Upright: photographer, filmmaker and framer.',
  story: [
    'What started with a single camera and a lot of weekends at weddings has grown into a studio that covers the whole journey of a photograph, from the moment it is taken to the frame it hangs in.',
    'We work with couples, families, graduates, brands and event planners across Lagos. Some clients come for a one-hour studio session; others trust us with every part of a three-day celebration.',
    'Our promise is simple and printed on every flyer we have ever made: delivery is the language of competence. You get your pictures when we say you will, finished to a standard we are proud to sign.',
  ],
  portrait: img.silhouette,
  secondaryImage: img.galleryWall,
  stats: [
    { value: '9', label: 'Services under one roof' },
    { value: 'In-house', label: 'Printing, enlargement and framing' },
    { value: 'Aerial', label: 'Drone coverage on request' },
  ],
  values: [
    {
      title: 'Honest light',
      body: 'Skin tones that look like you, colour that holds up in print, and no filters that date in a year.',
    },
    {
      title: 'On time, every time',
      body: 'Clear timelines agreed upfront. Galleries and prints arrive when we promised.',
    },
    {
      title: 'Built to last',
      body: 'Archival printing and solid framing, because the best pictures should outlive their phones.',
    },
  ],
}

export const seedContact: ContactContent = {
  heading: 'Book a shoot',
  body: 'Share a few details about your session or event and we will get back to you with availability and pricing.',
  responseNote: 'Prefer to talk it through? WhatsApp is the fastest way to reach us.',
}

export const seedWorkHeader: PageHeaderContent = {
  heading: 'The work',
  body: 'Weddings, portraits, celebrations and the city from above. A selection of recent sessions.',
}

export const seedServicesHeader: PageHeaderContent = {
  heading: 'What we do',
  body: 'Nine services, one team. Book a single session or bring us in for the whole celebration.',
}
