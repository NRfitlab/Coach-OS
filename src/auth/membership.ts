import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from './context'

const RoleSchema = z.enum(['admin', 'coach', 'assistant'])
export type Role = z.infer<typeof RoleSchema>

export type Membership = {
  organizationId: string
  organizationName: string
  role: Role
}

export function useMemberships() {
  const { session } = useAuth()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['memberships', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Membership[]> => {
      const { data: members, error } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', userId!)
      if (error) throw error
      if (!members.length) return []

      const { data: orgs, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .in('id', members.map((m) => m.organization_id))
      if (orgError) throw orgError

      const names = new Map<string, string>(
        orgs.map((o): [string, string] => [o.id, o.name]),
      )
      return members.map((m) => ({
        organizationId: m.organization_id,
        organizationName: names.get(m.organization_id) ?? '—',
        role: RoleSchema.parse(m.role),
      }))
    },
  })
}