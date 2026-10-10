import { z } from 'zod'

/** Shared by the contact form (TanStack Form) and the submit server function. */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a phone number we can reach you on')
    .max(20)
    .regex(/^[+\d\s()-]+$/, 'Use digits only, e.g. 0810 481 7424'),
  email: z.union([z.literal(''), z.email('That email address looks incomplete').max(120)]),
  service: z.string().max(80),
  eventDate: z.string().max(10),
  location: z.string().trim().max(120),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little about the shoot (at least a sentence)')
    .max(2000),
  /** Honeypot: real visitors never see or fill this. */
  website: z.string().max(0),
  /** Milliseconds the form was open before submit; bots submit instantly. */
  elapsedMs: z.number(),
})

export type InquiryInput = z.infer<typeof inquirySchema>

export const emptyInquiry: InquiryInput = {
  name: '',
  phone: '',
  email: '',
  service: '',
  eventDate: '',
  location: '',
  message: '',
  website: '',
  elapsedMs: 0,
}
