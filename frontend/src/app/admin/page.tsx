import {
  AppShell,
  AppSidebar,
  Chip,
  MetricCard,
  SectionHeading,
} from "@/components/kinetic";

const sideItems = [
  { href: "/admin", label: "Dashboard", icon: "grid_view" },
  { href: "/marketplace", label: "Active Prizes", icon: "military_tech" },
  { href: "/investor", label: "Yield Vaults", icon: "account_balance_wallet" },
  { href: "/admin", label: "Governance", icon: "gavel" },
  { href: "/winner", label: "Settings", icon: "settings" },
];

const winners = [
  {
    name: "HyperLend Protocol",
    wallet: "0x71C...123a",
    category: "1st Place - DeFi",
    prize: "$10,000",
    status: "Autorizado",
    button: "Emitir NFT",
  },
  {
    name: "Quantum Vaults",
    wallet: "0x3fA...B9e2",
    category: "Finalist - Infra",
    prize: "$5,000",
    status: "Pending",
    button: "Ver Detalhes",
  },
];

export default function AdminPage() {
  return (
    <AppShell
      topActive="Docs"
      sidebar={
        <AppSidebar
          profileName="Kinetic Operator"
          profileMeta="0x71C...39A2"
          items={sideItems}
        />
      }
    >
      <SectionHeading
        title="Admin Dashboard"
        subtitle="Monitor winner verification, prize emission, and escrow release states."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Prizes" value="$2.5M" accent="+12%" />
        <MetricCard label="Winners" value="45" />
        <MetricCard label="Active Trials" value="12" />
        <MetricCard label="Total Yielded" value="$1.1M" />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl font-black uppercase italic">
            Vencedores Registrados
          </h2>
          <div className="rounded-2xl bg-surface-container-low px-4 py-2 text-xs text-zinc-400">
            All Categories
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-surface-container-lowest">
          <div className="hidden grid-cols-5 bg-white/5 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 md:grid">
            <span>Nome do vencedor</span>
            <span>Categoria</span>
            <span className="text-right">Prêmio</span>
            <span className="text-center">Status NFT</span>
            <span className="text-right">Ações</span>
          </div>
          {winners.map((winner, index) => (
            <div
              key={winner.name}
              className="grid gap-4 border-t border-white/5 px-6 py-5 md:grid-cols-5 md:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-purple-400">
                  <span className="material-symbols-outlined text-sm">
                    {index === 0 ? "workspace_premium" : "token"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{winner.name}</p>
                  <p className="font-mono text-[10px] text-zinc-500">{winner.wallet}</p>
                </div>
              </div>
              <div>
                <Chip tone={index === 0 ? "primary" : "default"}>{winner.category}</Chip>
              </div>
              <p className="font-mono text-sm text-white md:text-right">{winner.prize}</p>
              <div className="md:text-center">
                <Chip tone={index === 0 ? "tertiary" : "default"}>{winner.status}</Chip>
              </div>
              <div className="md:text-right">
                <button
                  className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                    index === 0
                      ? "bg-primary-container text-white hover:opacity-90"
                      : "border border-white/10 text-white hover:bg-white/5"
                  }`}
                >
                  {winner.button}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/5 bg-surface-container-low p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-black uppercase italic">
              Pagamentos de Prêmios
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Status de liberações via smart contract
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-950/30 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-red-300">
            <span className="material-symbols-outlined text-sm">warning</span>
            Depósito obrigatório no escrow antes da emissão
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/5 bg-surface-container-lowest p-6">
          <div className="grid gap-4 md:grid-cols-4 md:items-center">
            <div>
              <p className="text-sm font-bold text-white">HyperLend Protocol</p>
              <p className="font-mono text-[10px] text-zinc-500">Vencimento: 15 Dias</p>
            </div>
            <div className="md:text-center">
              <p className="font-mono text-sm text-white">$10,000</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Valor do prêmio
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Contrato Escrow
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-400">0xAbC123...890</p>
            </div>
            <div className="md:text-right">
              <button className="rounded-xl bg-tertiary-container px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-tertiary-container transition-colors hover:bg-tertiary">
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
