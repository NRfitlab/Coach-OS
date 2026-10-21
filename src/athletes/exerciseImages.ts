import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/context'

const BUCKET = 'exercise-images'
const EXPIRES_S = 3600

// Le bucket est privé (licence RepDB : aucune archive publique). Adresses signées d'une heure.
export function useExerciseImageUrls(paths: string[]) {
  const userId = useAuth().session?.user.id
  return useQuery({
    queryKey: ['exercise-image-urls', userId, paths.join('|')],
    enabled: !!userId && paths.length > 0,
    staleTime: (EXPIRES_S - 600) * 1000,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(paths, EXPIRES_S)
      if (error) throw error
      return data.map((d) => d.signedUrl ?? '').filter((u) => u !== '')
    },
  })
}