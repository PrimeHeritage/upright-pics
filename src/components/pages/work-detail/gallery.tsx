import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import type { ImageAsset } from '@/types'

/** Masonry gallery; each photo opens the lightbox at its index. */
export default function Gallery({
  images,
  onOpen,
}: {
  images: Array<ImageAsset & { caption?: string | null }>
  onOpen: (index: number) => void
}) {
  return (
    <section className="container-site pb-24 md:pb-32">
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-6">
        {images.map((image, i) => (
          <li key={`${image.src}-${i}`} className="mb-4 break-inside-avoid lg:mb-6">
            <Reveal delay={(i % 3) * 0.05} amount={0.1}>
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="group block w-full cursor-zoom-in overflow-hidden"
                aria-label={`Open photo ${i + 1}: ${image.alt}`}
              >
                <MediaImage
                  image={image}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                  imgClassName="group-hover:scale-[1.03] duration-[1.2s]"
                  maxWidth={1440}
                />
              </button>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
