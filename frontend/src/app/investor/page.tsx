import {
  AppShell,
  AppSidebar,
  Chip,
  Icon,
  MetricCard,
  SectionHeading,
} from "@/components/kinetic";
import { ProtectedRoute } from "@/components/auth-guard";

const sideItems = [
  { href: "/investor", label: "Painel", icon: "grid_view" },
  { href: "/marketplace", label: "Prêmios ativos", icon: "military_tech" },
  { href: "/investor", label: "Vaults de yield", icon: "account_balance_wallet" },
  { href: "/admin", label: "Governanca", icon: "gavel" },
  { href: "/winner", label: "Configuracoes", icon: "settings" },
];

const positions = [
  {
    name: "Solar Grid Alpha",
    category: "Imoveis tokenizados",
    ownership: "4,25%",
    invested: "$5.000",
    expected: "$5.850",
    payout: "15 dez.",
  },
  {
    name: "Bio-Tech Yield Fund",
    category: "Venture Capital",
    ownership: "1,10%",
    invested: "$12.000",
    expected: "$14.200",
    payout: "12 nov.",
  },
  {
    name: "Cyber-Fleet Logistics",
    category: "Supply Chain",
    ownership: "0,85%",
    invested: "$3.000",
    expected: "$3.450",
    payout: "fev. 2027",
  },
];

export default function InvestorPage() {
  return (
    <ProtectedRoute allowedRole="investidor">
      <AppShell
        topActive="Investidores"
        sidebar={
          <AppSidebar
            profileName="Operador Kinetic"
            profileMeta="0x71C...39A2"
            items={sideItems}
          />
        }
      >
        <SectionHeading
          title="Painel do investidor"
          subtitle="Acompanhe a performance do portfolio e as posicoes de rendimento no marketplace Kinetic."
        />

      <section className="grid gap-6 md:grid-cols-5">
        <MetricCard
          label="Valor total do portfolio"
          value="$28.500,00"
          accent="+14% ROI medio"
          detail="Lucro projetado: $3.500"
          className="md:col-span-2"
        />
        <MetricCard label="Total investido" value="$25.000" icon="account_balance" />
        <MetricCard label="Posicoes" value="08" icon="layers" />
        <div className="kinetic-gradient rounded-3xl p-6 text-center text-white">
          <span className="inline-flex">
            <Icon name="bolt" className="h-10 w-10" />
          </span>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
            Score de performance
          </p>
          <h3 className="mt-2 font-headline text-4xl font-black">A+</h3>
        </div>
      </section>

      <div className="rounded-r-3xl border-l-4 border-primary-container bg-primary-container/10 p-6">
        <div className="flex items-center gap-4">
          <Icon name="info" className="h-5 w-5 text-primary" />
          <p className="font-medium">
            Automatico, proporcional e transparente{" "}
            <span className="font-mono text-sm text-primary">
              (verificado em blockchain)
            </span>
          </p>
        </div>
      </div>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-headline text-3xl font-black tracking-tight">
            POSICOES ATIVAS
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            Sincronizando com a mainnet...
          </p>
        </div>
        <div className="space-y-4">
          {positions.map((position, index) => (
            <div
              key={position.name}
              className="rounded-3xl border border-white/6 bg-surface-container-low p-6"
            >
              <div className="grid gap-6 md:grid-cols-12 md:items-center">
                <div className="md:col-span-3">
                  <h3 className="text-lg font-bold text-white">{position.name}</h3>
                  <p className="text-sm text-zinc-500">{position.category}</p>
                </div>
                <InfoBlock label="Participacao" value={position.ownership} />
                <InfoBlock label="Investido" value={position.invested} />
                <InfoBlock label="Retorno esperado" value={position.expected} accent />
                <div className="md:col-span-3 md:text-right">
                  <Chip tone={index === 1 ? "secondary" : index === 2 ? "default" : "tertiary"}>
                    Pagamento: {position.payout}
                  </Chip>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                {index === 0 ? (
                  <>
                    <div className="mb-2 flex justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      <span>Progresso ate o pagamento</span>
                      <span>54 dias restantes</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
                      <div className="h-full w-[72%] rounded-full bg-primary-container" />
                    </div>
                  </>
                ) : (
                  <p className="text-sm leading-6 text-zinc-300">
                    {index === 1
                      ? "Em 12 nov. 2026, voce recebera $1.500 automaticamente na carteira."
                      : "Posicao de longo prazo com liquidacao final prevista para o inicio de 2027."}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-headline text-3xl font-black tracking-tight">HISTORICO</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ["Protocol X Liquidity", "Pago em 12 out. 2024", "+22,4%", "$1.240,00"],
            ["Deep Sea Mining NFT", "Pago em 05 ago. 2024", "+18,1%", "$890,00"],
          ].map(([name, date, roi, profit]) => (
            <div key={name} className="glass-panel kinetic-border rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white">{name}</h3>
                  <p className="text-xs text-zinc-500">{date}</p>
                </div>
                <Chip tone="tertiary">Pago</Chip>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    ROI final
                  </p>
                  <p className="mt-2 font-bold text-tertiary">{roi}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    Lucro total
                  </p>
                  <p className="mt-2 font-bold text-white">{profit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </AppShell>
    </ProtectedRoute>
  );
}

function InfoBlock({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="md:col-span-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>
      <p className={`break-words font-mono ${accent ? "text-tertiary" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
