import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}
