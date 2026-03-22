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
  actionLabel = "Conectar carteira",
}: {
  active?: string;
  actionLabel?: string;
}) {
  const items: NavItem[] = [
    { href: "/", label: "Ecossistema" },
    { href: "/marketplace", label: "Premios" },
    { href: "/investor", label: "Investidores" },
    { href: "/admin", label: "Administracao" },
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
            Entrar
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
  const links = ["Privacidade", "Termos", "Seguranca", "Status"];

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
          2024 MONAD KINETIC. Construido para o vazio.
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
          <Icon name="person" className="h-5 w-5" />
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
            <Icon name={item.icon} className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-6">
        <button className="kinetic-gradient w-full rounded-xl py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform active:scale-95">
          Resgatar recompensas
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
          <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant">
            {subtitle}
          </p>
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
        <span className="mb-4 inline-flex text-primary">
          <Icon name={icon} className="h-6 w-6" />
        </span>
      ) : null}
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>
      <h3 className="mt-2 break-words font-headline text-3xl font-black text-white">
        {value}
      </h3>
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

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "person":
      return <svg {...props}><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M4 20a8 8 0 0 1 16 0" /></svg>;
    case "monitoring":
    case "query_stats":
      return <svg {...props}><path d="M4 19h16" /><path d="m6 15 4-4 3 3 5-6" /></svg>;
    case "military_tech":
    case "workspace_premium":
    case "emoji_events":
    case "trophy":
      return <svg {...props}><path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" /><path d="M6 6H4a2 2 0 0 0 2 2" /><path d="M18 6h2a2 2 0 0 1-2 2" /><path d="M12 11v4" /><path d="M9 21h6" /><path d="M10 17h4" /></svg>;
    case "admin_panel_settings":
      return <svg {...props}><path d="M12 3 5 6v5c0 5 3.5 8 7 10 3.5-2 7-5 7-10V6l-7-3Z" /><path d="M9.5 12.5 11 14l3.5-3.5" /></svg>;
    case "check_circle":
    case "verified":
    case "check":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.3 2.3 4.7-5" /></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></svg>;
    case "grid_view":
      return <svg {...props}><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>;
    case "account_balance_wallet":
    case "account_balance":
      return <svg {...props}><path d="M3 7h15a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /><path d="M3 9V7a2 2 0 0 1 2-2h11" /><circle cx="17" cy="13" r="1" /></svg>;
    case "gavel":
      return <svg {...props}><path d="m14 6 4 4" /><path d="m12 8 4 4" /><path d="m3 21 8-8" /><path d="m9 5 10 10" /></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" /></svg>;
    case "layers":
      return <svg {...props}><path d="m12 4 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4" /><path d="m4 16 8 4 8-4" /></svg>;
    case "bolt":
      return <svg {...props}><path d="M13 2 6 13h5l-1 9 8-12h-5V2Z" /></svg>;
    case "info":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 10v6" /><path d="M12 7h.01" /></svg>;
    case "warning":
      return <svg {...props}><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
    case "token":
      return <svg {...props}><circle cx="12" cy="12" r="8" /><path d="M9 9h6v6H9z" /></svg>;
    case "tune":
      return <svg {...props}><path d="M4 6h8" /><path d="M16 6h4" /><circle cx="14" cy="6" r="2" /><path d="M4 12h4" /><path d="M12 12h8" /><circle cx="10" cy="12" r="2" /><path d="M4 18h10" /><path d="M18 18h2" /><circle cx="16" cy="18" r="2" /></svg>;
    case "open_in_new":
      return <svg {...props}><path d="M14 4h6v6" /><path d="M10 14 20 4" /><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" /></svg>;
    case "shopping_cart":
      return <svg {...props}><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /><path d="M5 5h2l2.2 9.2a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.8L21 8H8" /></svg>;
    case "rocket_launch":
      return <svg {...props}><path d="M5 19c2-4 5-6 8-8 2-2 4-5 4-8-3 0-6 2-8 4-2 3-4 6-8 8l4 4Z" /><path d="M9 15 5 19" /><path d="M13 11l4 4" /></svg>;
    case "group":
      return <svg {...props}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M4 19a5 5 0 0 1 10 0" /><path d="M14 19a4 4 0 0 1 6 0" /></svg>;
    case "route":
      return <svg {...props}><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 6h4a4 4 0 0 1 4 4v4" /></svg>;
    case "payments":
      return <svg {...props}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 12h10" /><path d="M7 9h3" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="8" /></svg>;
  }
}
