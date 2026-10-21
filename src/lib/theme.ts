import { useCallback, useEffect, useState } from 'react'

export type ThemePref = 'system' | 'light' | 'dark'

const KEY = 'coachos-theme'
const COLORS = { light: '#faf9f7', dark: '#0b0b0a' } as const

function read(): ThemePref {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

function resolve(pref: ThemePref): 'light' | 'dark' {
  if (pref !== 'system') return pref
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function apply(pref: ThemePref) {
  const t = resolve(pref)
  document.documentElement.dataset.theme = t
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[t])
}

export function useTheme() {
  const [pref, setPrefState] = useState<ThemePref>(read)

  useEffect(() => {
    apply(pref)
    if (pref !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [pref])

  const setPref = useCallback((p: ThemePref) => {
    try {
      localStorage.setItem(KEY, p)
    } catch {
      /* stockage indisponible : le réglage vaut pour la session */
    }
    setPrefState(p)
  }, [])

  return { pref, setPref }
}