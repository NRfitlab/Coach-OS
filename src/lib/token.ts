const b64url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...Array.from(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/** Jeton de 128 bits aléatoires, en base64url (22 caractères). */
export const newToken = (): string => b64url(crypto.getRandomValues(new Uint8Array(16)))

/** Hachage stocké en base : SHA-256 de la chaîne du jeton (UTF-8), en hexadécimal minuscule. */
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Adresse de la page athlète (HashRouter, base Vite configurable). */
export function linkFor(token: string): string {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin).href
  return `${base}#/s/${token}`
}
