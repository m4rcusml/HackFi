import { Footer, Icon, TopNav } from "@/components/kinetic";

const cards = [
  ["Motor de Liquidez ZK Rollup", "On-chain", "ETH Global Paris", "$15.000", "18,2%", "45 dias", 80, "tertiary"],
  ["Yield Aggregator v3", "Verificado", "Polygon Guild", "$8.500", "14,5%", "12 dias", 45, "primary"],
  ["Carbon Credit DAO", "Docs verificados", "Chainlink Spring", "$12.000", "9,8%", "88 dias", 92, "secondary"],
  ["Bridge NFT Cross-chain", "Nao verificado", "Open Track Hack", "$5.000", "22,0%", "120 dias", 15, "default"],
  ["Camada Social do Metaverso", "Verificado", "Monad", "$6.000", "14,0%", "36 dias", 66, "primary"],
  ["Hub de Agentes IA", "Verificado", "Base", "$9.500", "16,5%", "28 dias", 24, "primary"],
  ["Bolsa de Creditos Solares", "Docs verificados", "Eco Fund", "$11.000", "8,2%", "64 dias", 84, "secondary"],
  ["Liquidity Router X", "On-chain", "Nexus", "$13.000", "19,1%", "21 dias", 52, "tertiary"],
] as const;

const toneClasses: Record<string, string> = {
  tertiary: "border-tertiary/25",
  primary: "border-primary/25",
  secondary: "border-secondary/25",
  default: "border-outline-variant/30",
};

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav active="Prêmios" />
      <main className="mx-auto max-w-7xl px-6 pt-28 pb-20 md:px-8">
        <section className="mb-12 space-y-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-white">
                Marketplace
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant">
                Descubra e negocie liquidez de pools de prêmios em todo o ecossistema.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Stat title="Volume total" value="$450 mil" />
              <Stat title="ROI medio" value="12,5%" accent />
            </div>
          </div>
          <div className="glass-panel kinetic-border flex flex-wrap items-center gap-4 rounded-[2rem] p-4">
            <div className="relative min-w-[280px] flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                <Icon name="search" className="h-5 w-5" />
              </span>
              <input
                className="w-full rounded-2xl bg-surface-container-lowest py-3 pr-4 pl-12 text-sm outline-none placeholder:text-outline/50"
                placeholder="Buscar projetos ou hackathons..."
              />
            </div>
            {["Categoria: todas", "Hackathon: todos", "ROI: maior para menor"].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-surface-container-highest px-4 py-3 text-xs font-bold uppercase tracking-[0.2em]"
              >
                {item}
              </div>
            ))}
            <button className="rounded-2xl bg-surface-container-high p-3 transition-colors hover:bg-surface-bright">
              <Icon name="tune" className="h-5 w-5" />
            </button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(([title, badge, brand, target, roi, payout, progress, tone], index) => (
            <article
              key={title}
              className={`overflow-hidden rounded-[1.75rem] border bg-surface-container-low transition-all duration-300 hover:-translate-y-2 ${toneClasses[tone]}`}
            >
              <div
                className={`relative h-48 ${
                  index % 4 === 0
                    ? "bg-[radial-gradient(circle_at_top_left,#4edea344,transparent_40%),linear-gradient(135deg,#0e0e0e,#19342a)]"
                    : index % 4 === 1
                      ? "bg-[radial-gradient(circle_at_top_right,#6e54ff44,transparent_40%),linear-gradient(135deg,#0e0e0e,#251b47)]"
                      : index % 4 === 2
                        ? "bg-[radial-gradient(circle_at_center,#0566d955,transparent_35%),linear-gradient(135deg,#10151f,#102338)]"
                        : "bg-[radial-gradient(circle_at_bottom_right,#ffffff22,transparent_30%),linear-gradient(135deg,#0e0e0e,#252525)]"
                }`}
              >
                <div className="absolute left-4 top-4 rounded-full bg-black/30 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                  {badge}
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="font-bold text-white">{brand}</p>
                  <p className="text-xs text-white/70">Oportunidade curada</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-headline text-lg leading-6 font-bold text-white">
                    {title}
                  </h2>
                  <Icon name="open_in_new" className="mt-1 h-4 w-4 shrink-0 text-outline" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-outline">
                    <span>Progresso</span>
                    <span className="text-white">{progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
                    <div
                      className={`h-full rounded-full ${
                        tone === "tertiary"
                          ? "bg-tertiary"
                          : tone === "primary"
                            ? "bg-primary"
                            : tone === "secondary"
                              ? "bg-secondary"
                              : "bg-outline"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 border-y border-white/8 py-4">
                  <DetailBlock label="Meta" value={target} />
                  <DetailBlock label="ROI esperado" value={roi} accent />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-outline-variant">
                    Pagamento em <span className="font-bold text-white">{payout}</span>
                  </p>
                  <button className="rounded-xl bg-surface-container-highest p-2 transition-colors hover:bg-tertiary hover:text-on-tertiary">
                    <Icon name="shopping_cart" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({
  title,
  value,
  accent = false,
}: {
  title: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-surface-container-low px-6 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-outline">
        {title}
      </p>
      <p className={`mt-1 font-headline text-xl font-bold ${accent ? "text-tertiary" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function DetailBlock({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-outline">
        {label}
      </p>
      <p className={`mt-1 break-words text-sm font-bold ${accent ? "text-tertiary" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
