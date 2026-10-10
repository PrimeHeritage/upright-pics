import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

/** Normalises a Nigerian phone number to international digits (e.g. 2348104817424). */
export function toInternationalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('234')) return digits
  if (digits.startsWith('0')) return `234${digits.slice(1)}`
  return digits
}

export function whatsappLink(phone: string, message?: string): string {
  const base = `https://wa.me/${toInternationalPhone(phone)}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function telLink(phone: string): string {
  return `tel:+${toInternationalPhone(phone)}`
}

/** Formats 08104817424 as 0810 481 7424 for display. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  return phone
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatMonthYear(date?: string | null): string | null {
  if (!date) return null
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
}
