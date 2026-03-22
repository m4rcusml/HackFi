"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDashboardPath, getSession, SessionUser, UserRole } from "@/lib/auth";

export function ProtectedRoute({
  allowedRole,
  children,
}: {
  allowedRole: UserRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    setSession(getSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (session.role !== allowedRole) {
      router.replace(getDashboardPath(session.role));
    }
  }, [allowedRole, hydrated, pathname, router, session]);

  if (!hydrated || !session || session.role !== allowedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-zinc-400">
        Validando sessao...
      </div>
    );
  }

  return <>{children}</>;
}
