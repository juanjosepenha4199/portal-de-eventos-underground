import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto py-12 text-underground-muted">Cargando…</div>}>
      <LoginForm />
    </Suspense>
  );
}
