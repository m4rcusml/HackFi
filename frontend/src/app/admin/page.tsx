import {
  AppShell,
  AppSidebar,
  Chip,
  Icon,
  MetricCard,
  SectionHeading,
} from "@/components/kinetic";

const sideItems = [
  { href: "/admin", label: "Painel", icon: "grid_view" },
  { href: "/marketplace", label: "Prêmios ativos", icon: "military_tech" },
  { href: "/investor", label: "Vaults de yield", icon: "account_balance_wallet" },
  { href: "/admin", label: "Governanca", icon: "gavel" },
  { href: "/winner", label: "Configuracoes", icon: "settings" },
];

const winners = [
  {
    name: "HyperLend Protocol",
    wallet: "0x71C...123a",
    category: "1o lugar - DeFi",
    prize: "$10.000",
    status: "Autorizado",
    button: "Emitir NFT",
  },
  {
    name: "Quantum Vaults",
    wallet: "0x3fA...B9e2",
    category: "Finalista - Infra",
    prize: "$5.000",
    status: "Pendente",
    button: "Ver detalhes",
  },
];

export default function AdminPage() {
  return (
    <AppShell
      topActive="Administracao"
      sidebar={
        <AppSidebar
          profileName="Operador Kinetic"
          profileMeta="0x71C...39A2"
          items={sideItems}
        />
      }
    >
      <SectionHeading
        title="Painel administrativo"
        subtitle="Monitore a verificacao dos vencedores, a emissao dos premios e os estados de liberacao em escrow."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total em prêmios" value="$2,5M" accent="+12%" />
        <MetricCard label="Vencedores" value="45" />
        <MetricCard label="Rodadas ativas" value="12" />
        <MetricCard label="Total liquidado" value="$1,1M" />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-headline text-2xl font-black uppercase italic">
            Vencedores registrados
          </h2>
          <div className="rounded-2xl bg-surface-container-low px-4 py-2 text-xs text-zinc-400">
            Todas as categorias
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-surface-container-lowest">
          <div className="hidden grid-cols-5 bg-white/5 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 md:grid">
            <span>Nome do vencedor</span>
            <span>Categoria</span>
            <span className="text-right">Prêmio</span>
            <span className="text-center">Status NFT</span>
            <span className="text-right">Acoes</span>
          </div>
          {winners.map((winner, index) => (
            <div
              key={winner.name}
              className="grid gap-4 border-t border-white/5 px-6 py-5 md:grid-cols-5 md:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-purple-400">
                  <Icon
                    name={index === 0 ? "workspace_premium" : "token"}
                    className="h-4 w-4"
                  />
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
              Pagamentos de prêmios
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Status das liberacoes via smart contract
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-950/30 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-red-300">
            <Icon name="warning" className="h-4 w-4" />
            Deposito obrigatorio no escrow antes da emissao
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/5 bg-surface-container-lowest p-6">
          <div className="grid gap-4 md:grid-cols-4 md:items-center">
            <div>
              <p className="text-sm font-bold text-white">HyperLend Protocol</p>
              <p className="font-mono text-[10px] text-zinc-500">Vencimento: 15 dias</p>
            </div>
            <div className="md:text-center">
              <p className="font-mono text-sm text-white">$10.000</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Valor do prêmio
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Contrato escrow
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-400">0xAbC123...890</p>
            </div>
            <div className="md:text-right">
              <button className="rounded-xl bg-tertiary-container px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-tertiary-container transition-colors hover:bg-tertiary">
                Confirmar pagamento
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
