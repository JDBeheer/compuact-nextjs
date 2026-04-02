export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(dateString: string): string {
  const d = new Date(dateString)
  const weekday = d.toLocaleDateString('nl-NL', { weekday: 'short' })
  const rest = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  return `${weekday} ${rest}`
}
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const ADMIN_FEE = 15
export const BTW_PERCENTAGE = 21

export function calculateTotal(items: { prijs: number }[]): number {
  return items.reduce((sum, item) => sum + item.prijs, 0)
}

export function lesmethodeLabel(methode: string): string {
  const labels: Record<string, string> = {
    klassikaal: 'Klassikaal',
    online: 'Live Online',
    thuisstudie: 'Thuisstudie',
    incompany: 'InCompany',
  }
  return labels[methode] || methode
}

export function niveauLabel(niveau: string): string {
  const labels: Record<string, string> = {
    beginner: 'Beginner',
    gevorderd: 'Gevorderd',
    expert: 'Expert',
  }
  return labels[niveau] || niveau
}
