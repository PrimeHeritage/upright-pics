import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { imageSrcSet, imageUrl, isResizable } from '@/lib/media'
import type { ImageAsset } from '@/types'

interface LightboxProps {
  images: Array<ImageAsset & { caption?: string | null }>
  index: number | null
  onIndexChange: (index: number | null) => void
  title: string
}

/**
 * Full-screen viewer. The open photo lives in the URL (`?photo=`), so it can
 * be shared and the browser back button closes it. Keyboard arrows and swipe
 * navigate; the Radix dialog provides the focus trap and Escape to close.
 */
export default function Lightbox({ images, index, onIndexChange, title }: LightboxProps) {
  const open = index !== null && index >= 0 && index < images.length
  const current = open ? images[index] : null

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndexChange((index + delta + images.length) % images.length)
    },
    [index, images.length, onIndexChange],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  // Preload neighbours for instant next/previous.
  useEffect(() => {
    if (!open) return
    for (const d of [1, -1]) {
      const n = images[(index + d + images.length) % images.length]
      if (isResizable(n.src)) new Image().src = imageUrl(n.src, 1920)
    }
  }, [open, index, images])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[100dvh] w-screen max-w-none flex-col gap-0 rounded-none border-none bg-ink/97 p-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">Use the arrow keys or swipe to move between photos.</DialogDescription>

        <div className="flex h-16 shrink-0 items-center justify-between px-4 md:px-8">
          <p className="font-mono text-xs text-ash tabular-nums">
            {index !== null ? index + 1 : 0} / {images.length}
          </p>
          <DialogClose className="flex size-11 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20">
          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <motion.img
                key={current.src}
                src={isResizable(current.src) ? imageUrl(current.src, 1920) : current.src}
                srcSet={isResizable(current.src) ? imageSrcSet(current, 2400) : undefined}
                sizes="100vw"
                alt={current.alt}
                className="max-h-full max-w-full touch-pan-y object-contain select-none"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1)
                  else if (info.offset.x > 80) go(-1)
                }}
                draggable={false}
              />
            ) : null}
          </AnimatePresence>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 hidden size-12 items-center justify-center rounded-full border border-line-strong text-paper transition-colors hover:bg-paper/10 md:left-6 md:flex"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 hidden size-12 items-center justify-center rounded-full border border-line-strong text-paper transition-colors hover:bg-paper/10 md:right-6 md:flex"
                aria-label="Next photo"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
        </div>

        <div className="flex min-h-16 shrink-0 items-center justify-center px-6 py-4 text-center text-sm text-ash">
          {current?.caption ?? current?.alt}
        </div>
      </DialogContent>
    </Dialog>
  )
}
