import { Suspense, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  Building2,
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Membership } from '../auth/membership'
import ThemeToggle from './ThemeToggle'

type Item = { to: string; label: string; icon: LucideIcon; end?: boolean; adminOnly?: boolean }

const ITEMS: Item[] = [
  { to: '/', label: 'Accueil', icon: LayoutDashboard, end: true },
  { to: '/athletes', label: 'Athlètes', icon: Users },
  { to: '/semaine', label: 'Semaine', icon: CalendarDays },
  { to: '/exercices', label: 'Exercices', icon: Dumbbell },
  { to: '/organisation', label: 'Organisation', icon: Building2, adminOnly: true },
]

const KEY = 'coachos-sidebar'

function initials(email: string): string {
  const name = email.split('@')[0] ?? ''
  const letters = name.split(/[._-]+/).map((p) => p[0] ?? '').join('').slice(0, 2).toUpperCase()
  return letters || '·'
}

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export default function AppShell({ email, membership, roleLabel }: {
  email: string
  membership: Membership
  roleLabel: string
}) {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [drawer, setDrawer] = useState(false)

  const toggleCollapsed = () => {
    const next = !collapsed
    try {
      localStorage.setItem(KEY, next ? '1' : '0')
    } catch {
      /* stockage indisponible : réglage valable pour la session */
    }
    setCollapsed(next)
  }

  const items = ITEMS.filter((i) => !i.adminOnly || membership.role === 'admin')

  const linkClass = (compact: boolean) => ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
      compact ? 'justify-center' : ''
    } ${
      isActive
        ? 'bg-accent text-accent-fg'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  const sidebar = (compact: boolean, inDrawer: boolean) => (
    <div className="flex h-full flex-col gap-4 p-3">
      <div className={`flex items-center gap-2 px-1 pt-1 ${compact ? 'justify-center' : ''}`}>
        <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent font-display text-lg font-bold text-accent-fg">
          C
        </div>
        {!compact && <span className="font-display text-2xl font-bold tracking-tight">Coach OS</span>}
        {inDrawer && (
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setDrawer(false)}
            className="ml-auto rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.end}
            title={compact ? i.label : undefined}
            onClick={() => setDrawer(false)}
            className={linkClass(compact)}
          >
            <i.icon className="size-5 shrink-0" />
            {!compact && i.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        {!compact && <ThemeToggle />}
        <div className={`flex items-center gap-2 ${compact ? 'justify-center' : ''}`}>
          <div
            title={compact ? email : undefined}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700"
          >
            {initials(email)}
          </div>
          {!compact && (
            <div className="min-w-0 text-xs">
              <p className="truncate font-medium text-slate-900">{email}</p>
              <p className="truncate text-slate-500">{membership.organizationName} · {roleLabel}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          title="Déconnexion"
          onClick={() => void supabase.auth.signOut()}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 ${
            compact ? 'justify-center' : ''
          }`}
        >
          <LogOut className="size-5 shrink-0" />
          {!compact && 'Déconnexion'}
        </button>
        {!inDrawer && (
          <button
            type="button"
            title={compact ? 'Déplier le menu' : 'Replier le menu'}
            onClick={toggleCollapsed}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 ${
              compact ? 'justify-center' : ''
            }`}
          >
            {compact ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
            {!compact && 'Replier'}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setDrawer(true)}
          className="rounded-lg p-1 text-slate-700 hover:bg-slate-100"
        >
          <Menu className="size-6" />
        </button>
        <span className="font-display text-2xl font-bold tracking-tight">Coach OS</span>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-20 hidden border-r bg-white md:block ${collapsed ? 'w-16' : 'w-60'}`}
      >
        {sidebar(collapsed, false)}
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <aside role="dialog" aria-modal="true" className="absolute inset-y-0 left-0 w-64 border-r bg-white">
            {sidebar(false, true)}
          </aside>
        </div>
      )}

      <div className={`flex min-h-screen flex-col ${collapsed ? 'md:pl-16' : 'md:pl-60'}`}>
        <main className="flex-1 p-4 md:p-8">
          <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
            <Outlet context={membership} />
          </Suspense>
        </main>
        <footer className="border-t bg-white px-4 py-3 text-xs text-slate-500 md:px-8">
          Exercise data by{' '}
          <a href="https://repdb.co" target="_blank" rel="noreferrer" className="underline">RepDB (repdb.co)</a>
        </footer>
      </div>
    </div>
  )
}