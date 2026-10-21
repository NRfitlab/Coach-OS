import { useExerciseImageUrls } from '../athletes/exerciseImages'

export default function ExerciseImages({ paths, alt }: { paths: string[]; alt: string }) {
  const urls = useExerciseImageUrls(paths)
  if (paths.length === 0) return null
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2">
        {urls.isPending && <div className="h-40 w-40 animate-pulse rounded bg-slate-100" />}
        {(urls.data ?? []).map((u, i) => (
          <img
            key={u}
            src={u}
            alt={`${alt} (position ${i + 1})`}
            loading="lazy"
            className="h-40 w-auto rounded border bg-white object-contain"
          />
        ))}
      </div>
      {urls.isError && <p className="text-xs text-red-600">Images indisponibles.</p>}
      <p className="text-xs text-slate-500">
        Illustrations :{' '}
        <a href="https://repdb.co" target="_blank" rel="noreferrer" className="underline">RepDB</a>
      </p>
    </div>
  )
}