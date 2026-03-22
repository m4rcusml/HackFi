import Link from "next/link";
import { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
};

type SideItem = {
  href: string;
  label: string;
  icon: string;
};

export function Brand() {
  return (
    <Link
      href="/"
      className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text font-headline text-2xl font-black tracking-tight text-transparent"
    >
      MONAD KINETIC
    </Link>
  );
}

export function TopNav({
  active,
  actionLabel = "Connect Wallet",
}: {
  active?: string;
  actionLabel?: string;
}) {
  const items: NavItem[] = [
    { href: "/", label: "Ecosystem" },
    { href: "/marketplace", label: "Prizes" },
    { href: "/investor", label: "Investors" },
    { href: "/admin", label: "Docs" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#131313]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-10">
          <Brand />
          <nav className="hidden items-center gap-8 font-headline text-sm tracking-tight md:flex">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  active === item.label
                    ? "border-b-2 border-purple-500 pb-1 text-purple-400"
                    : "text-zinc-400 transition-colors hover:text-white"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-sm font-medium text-on-surface transition-colors hover:text-primary sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/marketplace"
            className="rounded-xl bg-[linear-gradient(135deg,#6e54ff_0%,#0566d9_100%)] px-5 py-2.5 font-headline text-sm font-bold text-white transition-transform active:scale-95"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const links = ["Privacy", "Terms", "Security", "Status"];

  return (
    <footer className="border-t border-white/5 bg-[#131313] py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-8">
        <div className="font-headline text-lg font-black tracking-[0.18em] text-white">
          MONAD KINETIC
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-mono text-xs uppercase tracking-[0.25em] text-zinc-600">
          {links.map((link) => (
            <a key={link} href="#" className="transition-colors hover:text-purple-400">
              {link}
            </a>
          ))}
        </div>
        <p className="border-t border-white/5 pt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-700">
          © 2024 MONAD KINETIC. Built for the Void.
        </p>
      </div>
    </footer>
  );
}

export function AppSidebar({
  profileName,
  profileMeta,
  items,
}: {
  profileName: string;
  profileMeta: string;
  items: SideItem[];
}) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-white/5 bg-[#131313] pt-24 pb-8 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{profileName}</p>
          <p className="truncate font-mono text-[10px] text-zinc-500">{profileMeta}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={
              index === 0
                ? "flex items-center gap-3 rounded-r-xl border-r-4 border-purple-500 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-400"
                : "flex items-center gap-3 px-6 py-3 text-sm font-medium text-zinc-500 transition-all hover:translate-x-1 hover:bg-white/5 hover:text-zinc-200"
            }
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-6">
        <button className="kinetic-gradient w-full rounded-xl py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform active:scale-95">
          Claim Rewards
        </button>
      </div>
    </aside>
  );
}

export function AppShell({
  children,
  topActive,
  sidebar,
}: {
  children: ReactNode;
  topActive?: string;
  sidebar: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav active={topActive} />
      {sidebar}
      <main className="px-6 pt-28 pb-20 lg:ml-64 lg:px-10">
        <div className="mx-auto max-w-[1280px] space-y-10">{children}</div>
      </main>
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-headline text-3xl font-black tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  accent,
  detail,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  accent?: string;
  detail?: string;
  icon?: string;
  className?: string;
}) {
  return (
    <div className={`glass-panel kinetic-border rounded-3xl p-6 ${className}`}>
      {icon ? (
        <span className="material-symbols-outlined mb-4 inline-flex text-2xl text-primary">
          {icon}
        </span>
      ) : null}
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>
      <h3 className="mt-2 font-headline text-3xl font-black text-white">{value}</h3>
      {accent ? <p className="mt-3 font-mono text-sm text-tertiary">{accent}</p> : null}
      {detail ? <p className="mt-1 text-xs text-zinc-500">{detail}</p> : null}
    </div>
  );
}

export function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "primary" | "secondary" | "tertiary";
}) {
  const styles = {
    default: "border-white/10 bg-white/5 text-zinc-300",
    primary: "border-primary/20 bg-primary/10 text-primary",
    secondary: "border-secondary/20 bg-secondary/10 text-secondary",
    tertiary: "border-tertiary/20 bg-tertiary/10 text-tertiary",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${styles}`}
    >
      {children}
    </span>
  );
}
