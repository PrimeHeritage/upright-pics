import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

/** Right-hand slide-over used for add/edit forms. Full screen on phones. */
export function EditSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto border-line bg-ink p-0 sm:max-w-xl">
        <SheetHeader className="sticky top-0 z-10 border-b border-line bg-ink/95 px-5 py-4 backdrop-blur">
          <SheetTitle className="font-display text-2xl font-normal">{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <div className="p-5">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
