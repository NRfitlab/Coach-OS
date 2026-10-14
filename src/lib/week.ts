export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}

export const toISO = (d: Date): string => d.toLocaleDateString('sv-SE')

export const isIsoDate = (s: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) && toISO(parseISO(s)) === s

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export function mondayOf(iso: string): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return toISO(d)
}

export const weekDays = (monday: string): string[] =>
  Array.from({ length: 7 }, (_, i) => addDays(monday, i))

export const diffDays = (a: string, b: string): number =>
  Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86_400_000)