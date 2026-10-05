import { Navigate, NavLink, Outlet, Route, Routes, useOutletContext } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuth } from './auth/context'
import { useMemberships, type Membership, type Role } from './auth/membership'
import Login from './pages/Login'
import CreateOrganization from './pages/CreateOrganization'

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrateur',
  coach: 'Coach',
  assistant: 'Assistant',
}

function Layout({ email, membership }: { email: string; membership: Membership }) {
  const link = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-semibold text-slate-900' : 'text-slate-500 hover:text-slate-900'
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center gap-6 border-b bg-white px-6 py-3">
        <span className="font-bold">Coach OS</span>
        <nav className="flex gap-4 text-sm">
          <NavLink to="/" end className={link}>Accueil</NavLink>
          <NavLink to="/athletes" className={link}>Athlètes</NavLink>
          {membership.role === 'admin' && (
            <NavLink to="/organisation" className={link}>Organisation</NavLink>
          )}
        </nav>
        <span className="ml-auto text-right text-sm text-slate-500">
          {email}
          <br />
          {membership.organizationName} · {ROLE_LABEL[membership.role]}
        </span>
        <button className="rounded border px-3 py-1 text-sm"
          onClick={() => void supabase.auth.signOut()}>
          Déconnexion
        </button>
      </header>
      <main className="p-6"><Outlet context={membership} /></main>
    </div>
  )
}

function RequireAuth() {
  const { session, loading } = useAuth()
  const memberships = useMemberships()

  if (loading) return <p className="p-6 text-slate-500">Chargement…</p>
  if (!session) return <Navigate to="/login" replace />
  if (memberships.isPending) return <p className="p-6 text-slate-500">Chargement…</p>
  if (memberships.isError) {
    return <p role="alert" className="p-6 text-red-600">
      Erreur de lecture de l'organisation : {memberships.error.message}
    </p>
  }
  const membership = memberships.data[0]
  if (!membership) return <CreateOrganization />
  return <Layout email={session.user.email ?? ''} membership={membership} />
}

function AdminOnly() {
  const membership = useOutletContext<Membership>()
  return membership.role === 'admin' ? <Outlet context={membership} /> : <Navigate to="/" replace />
}

function Accueil() {
  const membership = useOutletContext<Membership>()
  return (
    <div className="space-y-1">
      <h1 className="text-xl font-semibold">Accueil</h1>
      <p className="text-slate-600">Organisation : {membership.organizationName}</p>
      <p className="text-slate-600">Rôle : {ROLE_LABEL[membership.role]}</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route index element={<Accueil />} />
        <Route path="athletes" element={<h1 className="text-xl font-semibold">Athlètes</h1>} />
        <Route element={<AdminOnly />}>
          <Route path="organisation" element={<h1 className="text-xl font-semibold">Organisation</h1>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}