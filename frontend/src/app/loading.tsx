export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4" aria-live="polite" aria-busy="true">
      <div
        className="w-10 h-10 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"
        aria-hidden
      />
      <p className="text-underground-muted text-sm">Cargando…</p>
    </div>
  );
}
