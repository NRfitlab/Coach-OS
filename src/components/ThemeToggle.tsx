import { useTheme, type ThemePref } from '../lib/theme'

const OPTIONS: { value: ThemePref; label: string }[] = [
  { value: 'system', label: 'Système' },
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
]

export default function ThemeToggle() {
  const { pref, setPref } = useTheme()
  return (
    <select
      aria-label="Thème"
      value={pref}
      onChange={(e) => setPref(e.target.value as ThemePref)}
      className="rounded border bg-white px-2 py-1 text-sm"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}