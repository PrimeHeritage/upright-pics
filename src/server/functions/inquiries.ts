import { createServerFn } from '@tanstack/react-start'

import { inquirySchema } from '@/lib/schemas/inquiry'

const MIN_FILL_TIME_MS = 3000

export const submitInquiry = createServerFn({ method: 'POST' })
  .validator(inquirySchema)
  .handler(async ({ data }) => {
    // Spam checks: honeypot filled or form submitted implausibly fast.
    // Respond as if it succeeded so bots get no signal.
    if (data.website || data.elapsedMs < MIN_FILL_TIME_MS) {
      return { ok: true as const }
    }

    // TODO(phase-3): insert into Supabase `inquiries` with the service-role
    // client and apply a per-IP rate limit.
    console.info('[inquiry]', { name: data.name, phone: data.phone, service: data.service })

    return { ok: true as const }
  })
