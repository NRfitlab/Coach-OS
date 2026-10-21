import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes, useOutletContext } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuth } from './auth/context'
import { useMemberships, type Membership, type Role } from './auth/membership'
import Login from './pages/Login'
import AppShell from './components/AppShell'
import CreateOrganization from './pages/CreateOrganization'
import Athletes from './pages/Athletes'
const AthleteNew = lazy(() => import('./pages/AthleteNew'))
const AthleteDetail = lazy(() => import('./pages/AthleteDetail'))

const AthleteWeek = lazy(() => import('./pages/AthleteWeek'))
const WeekAll = lazy(() => import('./pages/WeekAll'))
const WorkoutBuilder = lazy(() => import('./pages/WorkoutBuilder'))
const Exercises = lazy(() => import('./pages/Exercises'))

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrateur',
  coach: 'Coach',
  assistant: 'Assistant',
}

function Layout({ email, membership }: { email: string; membership: Membership }) {
  return <AppShell email={email} membership={membership} roleLabel={ROLE_LABEL[membership.role]} />
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
      <h1 className="font-display text-3xl font-bold tracking-tight">Accueil</h1>
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
        <Route path="athletes" element={<Athletes />} />
        <Route path="athletes/new" element={<AthleteNew />} />
        <Route path="athletes/:id" element={<AthleteDetail />} />
                <Route
          path="athletes/:id/semaine"
          element={<Suspense fallback={<p className="text-slate-500">Chargement…</p>}><AthleteWeek /></Suspense>}
        />
        <Route
  path="athletes/:id/semaine/:workoutId"
  element={<Suspense fallback={<p className="text-slate-500">Chargement…</p>}><WorkoutBuilder /></Suspense>}
/>
        <Route
  path="semaine"
  element={<Suspense fallback={<p className="text-slate-500">Chargement…</p>}><WeekAll /></Suspense>}
/>
        <Route path="exercices" element={<Exercises />} />
                <Route element={<AdminOnly />}>
          <Route path="organisation" element={<h1 className="font-display text-3xl font-bold tracking-tight">Organisation</h1>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
