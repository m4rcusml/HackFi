"use client";

import { ReactNode } from "react";
import { useAccount } from "wagmi";

export function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isConnected, isConnecting } = useAccount();

  if (isConnecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-zinc-400">
        Conectando wallet...
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-zinc-400">
        <p>Conecte sua wallet para acessar esta pagina</p>
      </div>
    );
  }

  return <>{children}</>;
}
