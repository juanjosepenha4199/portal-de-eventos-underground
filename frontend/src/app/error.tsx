"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-underground-bg text-underground-fg">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-bold text-underground-fg">Algo ha fallado</h1>
        <p className="text-underground-muted text-sm">
          La página no ha podido cargarse. Puedes volver al inicio o intentar de nuevo.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-neon-purple text-white font-medium hover:bg-neon-magenta transition"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-underground-border text-underground-fg font-medium hover:border-neon-purple transition"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
