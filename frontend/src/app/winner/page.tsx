import { AppShell, AppSidebar, Chip, Icon, SectionHeading } from "@/components/kinetic";

const sideItems = [
  { href: "/winner", label: "Painel", icon: "grid_view" },
  { href: "/marketplace", label: "Prêmios ativos", icon: "military_tech" },
  { href: "/winner", label: "Meu yield", icon: "account_balance_wallet" },
  { href: "/admin", label: "Governanca", icon: "gavel" },
  { href: "/winner", label: "Configuracoes", icon: "settings" },
];

export default function WinnerPage() {
  return (
    <AppShell
      topActive="Ecossistema"
      sidebar={
        <AppSidebar
          profileName="Joao Kinetic"
          profileMeta="0x71C...4f92"
          items={sideItems}
        />
      }
    >
      <SectionHeading
        title="Painel do vencedor"
        subtitle="Gerencie a antecipacao do premio e os fluxos de liquidez do seu pool."
        action={<Chip tone="tertiary">Arquiteto autorizado</Chip>}
      />

      <section className="space-y-6">
        <h2 className="font-headline text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">
          Performance da antecipacao
        </h2>
        <div className="grid gap-6 md:grid-cols-12">
          <div className="grid gap-4 md:col-span-4">
            {[
              ["Valor do prêmio", "$15.000", "trophy", "text-purple-500"],
              ["Total antecipado", "$12.000", "rocket_launch", "text-blue-500"],
              ["Investidores unicos", "24", "group", "text-tertiary"],
            ].map(([label, value, icon, accent]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[1.5rem] border border-white/5 bg-surface-container-low p-6"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    {label}
                  </p>
                  <h3 className="mt-2 font-mono text-2xl font-bold">{value}</h3>
                </div>
                <Icon name={icon} className={`h-6 w-6 ${accent}`} />
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-surface-container-low p-8 md:col-span-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-400">Pool de captacao</p>
                <h3 className="mt-1 font-headline text-2xl font-bold">
                  ETH Global Paris Pool
                </h3>
              </div>
              <a href="#" className="text-[10px] uppercase tracking-[0.2em] text-primary">
                Explorer
              </a>
            </div>
            <div className="my-6 space-y-4">
              <div className="flex items-end justify-between">
                <span className="font-mono text-5xl font-bold">80%</span>
                <span className="font-mono text-xs text-zinc-500">$12 mil / $15 mil</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full w-[80%] rounded-full bg-[linear-gradient(90deg,#6e54ff_0%,#4edea3_100%)] shadow-[0_0_15px_rgba(110,84,255,0.4)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="Liquido agora" value="$9.600" accent="text-tertiary" />
              <MiniStat label="Travado" value="$2.400" accent="text-zinc-200" />
            </div>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(147,51,234,0.25),rgba(59,130,246,0.2))] p-px md:col-span-3">
            <div className="flex h-full flex-col items-center rounded-[calc(2rem-1px)] bg-[#131313] p-6 text-center">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-surface-container-lowest">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4edea322,transparent_35%),linear-gradient(135deg,#0e0e0e,#182227)]" />
                <div className="relative z-10">
                  <Icon name="verified" className="mx-auto h-12 w-12 text-tertiary" />
                  <p className="mt-2 font-headline text-lg font-black tracking-[0.22em]">
                    VALIDADO
                  </p>
                </div>
              </div>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Token on-chain
              </p>
              <p className="mt-1 font-mono text-xs text-primary">0x...789_NFT</p>
              <button className="mt-5 w-full rounded-xl border border-white/10 py-2.5 font-headline text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-white/5">
                Detalhes
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="flex items-center gap-2 font-headline text-sm font-bold text-zinc-400">
          <Icon name="route" className="h-4 w-4" />
          Ciclo de vida do prêmio
        </h3>
        <div className="relative rounded-[2rem] border border-white/5 bg-surface-container-lowest p-8">
          <div className="absolute top-1/2 left-8 right-8 hidden h-px -translate-y-1/2 bg-white/5 md:block" />
          <div className="grid gap-8 md:grid-cols-4">
            {[
              ["Vencedor anunciado", "12 out. 2023", "check", "bg-tertiary text-on-tertiary"],
              ["Ativos verificados", "14 out. 2023", "check", "bg-tertiary text-on-tertiary"],
              ["Antecipacao ativa", "Em andamento", "payments", "bg-primary-container text-white ring-4 ring-background"],
              ["Liquidacao final", "12 dez. 2023", "account_balance", "border border-white/10 bg-surface-container-high text-zinc-500"],
            ].map(([title, date, icon, styles], index) => (
              <div key={title} className="relative z-10 flex flex-col items-center text-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${styles}`}>
                  <Icon name={icon} className="h-4 w-4" />
                </div>
                <p
                  className={`mt-3 font-headline text-xs font-bold ${
                    index === 2 ? "text-primary" : "text-white"
                  }`}
                >
                  {title}
                </p>
                <p className="mt-1 font-mono text-[10px] text-zinc-500">{date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <StatusPanel
          eyebrow="Status da verificacao"
          title="Aguardando autorizacao"
          description="A organizacao ETH Global esta validando os parametros de governanca do seu contrato."
          icon="settings"
          tone="muted"
        />
        <StatusPanel
          eyebrow="Acoes disponiveis"
          title="Pronto para antecipacao"
          description="Voce esta autorizado a tokenizar sua liquidez futura. Comece a captar agora."
          icon="emoji_events"
          tone="active"
        />
      </section>
    </AppShell>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>
      <p className={`mt-2 font-mono text-lg font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function StatusPanel({
  eyebrow,
  title,
  description,
  icon,
  tone,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  tone: "muted" | "active";
}) {
  return (
    <div className="space-y-4">
      <p className="ml-4 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600">
        {eyebrow}
      </p>
      <div
        className={`rounded-[2rem] border p-8 text-center ${
          tone === "active"
            ? "border-purple-500/20 bg-surface-container-low"
            : "border-dashed border-white/10 bg-surface-container-lowest"
        }`}
      >
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            tone === "active" ? "bg-purple-500/10" : "bg-surface-container-low"
          }`}
        >
          <Icon
            name={icon}
            className={`h-6 w-6 ${tone === "active" ? "text-purple-500" : "text-zinc-500"}`}
          />
        </div>
        <h4 className="mt-4 font-headline text-sm font-bold">{title}</h4>
        <p className="mx-auto mt-2 max-w-sm text-[11px] leading-6 text-zinc-500">
          {description}
        </p>
        {tone === "active" ? (
          <button className="mt-5 rounded-full bg-white px-6 py-2.5 font-headline text-[10px] font-black uppercase tracking-[0.25em] text-zinc-900 transition-colors hover:bg-zinc-200">
            Configurar pool
          </button>
        ) : null}
      </div>
    </div>
  );
}
