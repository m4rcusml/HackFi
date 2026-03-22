import { Suspense } from "react";
import { LoginScreen } from "@/components/login-screen";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-zinc-400">
          Carregando acesso...
        </div>
      }
    >
      <LoginScreen />
    </Suspense>
  );
}
