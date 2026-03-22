import {
  AppShell,
  AppSidebar,
  Chip,
  MetricCard,
  SectionHeading,
} from "@/components/kinetic";

const sideItems = [
  { href: "/investor", label: "Dashboard", icon: "grid_view" },
  { href: "/marketplace", label: "Active Prizes", icon: "military_tech" },
  { href: "/investor", label: "Yield Vaults", icon: "account_balance_wallet" },
  { href: "/admin", label: "Governance", icon: "gavel" },
  { href: "/winner", label: "Settings", icon: "settings" },
];

const positions = [
  {
    name: "Solar Grid Alpha",
    category: "Real Estate RWA",
    ownership: "4.25%",
    invested: "$5,000",
    expected: "$5,850",
    payout: "Dec 15",
  },
  {
    name: "Bio-Tech Yield Fund",
    category: "Venture Capital",
    ownership: "1.10%",
    invested: "$12,000",
    expected: "$14,200",
    payout: "Nov 12",
  },
  {
    name: "Cyber-Fleet Logistics",
    category: "Supply Chain",
    ownership: "0.85%",
    invested: "$3,000",
    expected: "$3,450",
    payout: "Feb 2027",
  },
];

export default function InvestorPage() {
  return (
    <AppShell
      topActive="Investors"
      sidebar={
        <AppSidebar
          profileName="Kinetic Operator"
          profileMeta="0x71C...39A2"
          items={sideItems}
        />
      }
    >
      <SectionHeading
        title="Investor Dashboard"
        subtitle="Manage portfolio performance and yield positions across the Kinetic marketplace."
      />

      <section className="grid gap-6 md:grid-cols-5">
        <MetricCard
          label="Total Portfolio Value"
          value="$28,500.00"
          accent="+14% Average ROI"
          detail="Projected Profit: $3,500"
          className="md:col-span-2"
        />
        <MetricCard label="Total Invested" value="$25,000" icon="account_balance" />
        <MetricCard label="Positions" value="08" icon="layers" />
        <div className="kinetic-gradient rounded-3xl p-6 text-center text-white">
          <span className="material-symbols-outlined inline-flex text-4xl">bolt</span>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
            Performance Score
          </p>
          <h3 className="mt-2 font-headline text-4xl font-black">A+</h3>
        </div>
      </section>

      <div className="rounded-r-3xl border-l-4 border-primary-container bg-primary-container/10 p-6">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary">info</span>
          <p className="font-medium">
            Automatic, proportional, and transparent{" "}
            <span className="font-mono text-sm text-primary">
              (blockchain verified)
            </span>
          </p>
        </div>
      </div>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="font-headline text-3xl font-black tracking-tight">
            ACTIVE POSITIONS
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            Syncing with mainnet...
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
                <InfoBlock label="Ownership" value={position.ownership} />
                <InfoBlock label="Invested" value={position.invested} />
                <InfoBlock label="Exp. Return" value={position.expected} accent />
                <div className="md:col-span-3 md:text-right">
                  <Chip tone={index === 1 ? "secondary" : index === 2 ? "default" : "tertiary"}>
                    Payout: {position.payout}
                  </Chip>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                {index === 0 ? (
                  <>
                    <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      <span>Progress to payout</span>
                      <span>54 days remaining</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
                      <div className="h-full w-[72%] rounded-full bg-primary-container" />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-zinc-300">
                    {index === 1
                      ? "On Nov 12, 2026, you will receive $1,500 automatically in your wallet."
                      : "Long-dated position scheduled for final settlement in early 2027."}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-headline text-3xl font-black tracking-tight">HISTORY</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ["Protocol X Liquidity", "Paid on Oct 12, 2024", "+22.4%", "$1,240.00"],
            ["Deep Sea Mining NFT", "Paid on Aug 05, 2024", "+18.1%", "$890.00"],
          ].map(([name, date, roi, profit]) => (
            <div key={name} className="glass-panel kinetic-border rounded-3xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white">{name}</h3>
                  <p className="text-xs text-zinc-500">{date}</p>
                </div>
                <Chip tone="tertiary">Pago</Chip>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    Final ROI
                  </p>
                  <p className="mt-2 font-bold text-tertiary">{roi}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    Total Profit
                  </p>
                  <p className="mt-2 font-bold text-white">{profit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
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
      <p className={accent ? "font-mono text-tertiary" : "font-mono text-white"}>
        {value}
      </p>
    </div>
  );
}
