"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDashboardPath, getSession, UserRole } from "@/lib/auth";

export function ProtectedRoute({
  allowedRole,
  children,
}: {
  allowedRole: UserRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const session = getSession();

  useEffect(() => {
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (session.role !== allowedRole) {
      router.replace(getDashboardPath(session.role));
    }
  }, [allowedRole, pathname, router, session]);

  if (!session || session.role !== allowedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-zinc-400">
        Validando sessao...
      </div>
    );
  }

  return <>{children}</>;
}
