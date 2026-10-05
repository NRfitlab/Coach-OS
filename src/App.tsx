import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuth } from './auth/context'
import Login from './pages/Login'

function Layout({ email }: { email: string }) {
  const link = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-semibold text-slate-900' : 'text-slate-500 hover:text-slate-900'
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center gap-6 border-b bg-white px-6 py-3">
        <span className="font-bold">Coach OS</span>
        <nav className="flex gap-4 text-sm">
          <NavLink to="/" end className={link}>Accueil</NavLink>
          <NavLink to="/athletes" className={link}>Athlètes</NavLink>
        </nav>
        <span className="ml-auto text-sm text-slate-500">{email}</span>
        <button className="rounded border px-3 py-1 text-sm"
          onClick={() => supabase.auth.signOut()}>
          Déconnexion
        </button>
      </header>
      <main className="p-6"><Outlet /></main>
    </div>
  )
}

function RequireAuth() {
  const { session, loading } = useAuth()
  if (loading) return <p className="p-6 text-slate-500">Chargement…</p>
  if (!session) return <Navigate to="/login" replace />
  return <Layout email={session.user.email ?? ''} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route index element={<h1 className="text-xl font-semibold">Accueil</h1>} />
        <Route path="athletes" element={<h1 className="text-xl font-semibold">Athlètes</h1>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
