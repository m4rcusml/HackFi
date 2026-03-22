import Link from "next/link";
import { Chip, Footer, TopNav } from "@/components/kinetic";

const pathCards = [
  {
    title: "Investor",
    text: "Access discounted prize tokens and earn institutional-grade yields from verified ecosystem bounties.",
    cta: "Connect as Investor",
    href: "/investor",
    icon: "monitoring",
  },
  {
    title: "Winner",
    text: "Tokenize your future rewards. Unlock instant liquidity from your hackathon wins and protocol grants.",
    cta: "Connect as Winner",
    href: "/winner",
    icon: "military_tech",
  },
  {
    title: "Hackathon Admin",
    text: "Manage prize distributions, verify winners, and integrate Kinetic liquidity into your ecosystem events.",
    cta: "Connect as Admin",
    href: "/admin",
    icon: "admin_panel_settings",
  },
];

const featureCards = [
  {
    title: "For Winners",
    description:
      "Don't wait months for your prize vestings. Tokenize your future rewards into liquid assets and unlock your capital instantly.",
    icon: "workspace_premium",
    stats: ["94% LTV Ratio", "< 1s Settlement"],
  },
  {
    title: "For Investors",
    description:
      "Access institutional-grade yields by purchasing discounted prize pools from top-tier hackathons and ecosystem incentives.",
    icon: "monitoring",
    stats: ["24 Active Vaults", "18.4% Avg. APY"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav active="Ecosystem" actionLabel="Register" />
      <main className="relative overflow-hidden pt-20">
        <div className="hero-orb right-[-12rem] top-[-8rem] h-[32rem] w-[32rem] bg-primary-container/30" />
        <div className="hero-orb bottom-[-10rem] left-[-12rem] h-[32rem] w-[32rem] bg-secondary-container/20" />

        <section className="mx-auto max-w-7xl px-6 py-24 text-center md:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <Chip tone="tertiary">High-Performance Yield Infrastructure</Chip>
            <h1 className="font-headline text-5xl font-black leading-[0.92] tracking-tight md:text-8xl">
              TOKENIZE YOUR{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                VICTORY.
              </span>
              <br />
              LIQUIDATE YOUR{" "}
              <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">
                PRIZES.
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-light leading-8 text-on-surface-variant md:text-2xl">
              The first secondary market for protocol rewards and hackathon
              bounties. Unlocking liquidity for winners, high-alpha for
              investors.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/marketplace"
                className="rounded-2xl bg-[linear-gradient(135deg,#6e54ff_0%,#0566d9_100%)] px-10 py-5 font-headline text-lg font-bold text-white shadow-xl shadow-primary-container/20 transition-all hover:scale-[1.03]"
              >
                Connect Wallet
              </Link>
              <Link
                href="/marketplace"
                className="rounded-2xl border border-white/10 bg-surface-container-low px-10 py-5 font-headline text-lg font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Explore Vaults
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 md:px-8">
          <div className="mb-14 text-center">
            <h2 className="font-headline text-4xl font-black tracking-tight md:text-5xl">
              CHOOSE YOUR <span className="text-primary">PATH</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-on-surface-variant">
              Select your role to access the specialized Kinetic dashboard
              tailored for your goals.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pathCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.75rem] border border-white/8 bg-surface-container-low p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    {card.icon}
                  </span>
                </div>
                <h3 className="mt-6 font-headline text-2xl font-bold">
                  {card.title}
                </h3>
                <p className="mt-4 min-h-24 leading-7 text-on-surface-variant">
                  {card.text}
                </p>
                <Link
                  href={card.href}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-white/8 bg-surface-container-highest px-4 py-4 font-bold transition-all hover:bg-primary hover:text-on-primary"
                >
                  {card.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-28 md:grid-cols-12 md:px-8">
          {featureCards.map((card, index) => (
            <div
              key={card.title}
              className={`rounded-[2rem] border border-white/8 bg-surface-container-low p-8 ${
                index === 0 ? "md:col-span-7" : "md:col-span-5"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-primary">
                  <span className="material-symbols-outlined">{card.icon}</span>
                </span>
                <h3 className="font-headline text-3xl font-bold">{card.title}</h3>
              </div>
              <p className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant">
                {card.description}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {card.stats.map((stat) => (
                  <div
                    key={stat}
                    className="rounded-2xl border border-white/6 bg-surface-container-highest/60 p-4"
                  >
                    <p className="font-mono text-xl font-bold text-primary">{stat}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 md:px-8">
          <div className="rounded-[2rem] border border-white/8 bg-surface-container-lowest p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-headline text-4xl font-bold">
                  Kinetic Liquidity Flow
                </h2>
                <p className="mt-2 text-on-surface-variant">
                  Real-time prize tokenization and liquidation metrics across
                  Monad Ecosystem.
                </p>
              </div>
              <Chip tone="tertiary">Mainnet Live</Chip>
            </div>
            <div className="mt-10 flex h-64 items-end gap-2">
              {[40, 55, 45, 70, 65, 85, 75, 95, 100].map((height, index) => (
                <div
                  key={height}
                  className={`flex-1 rounded-t-xl ${
                    index < 5
                      ? "bg-primary/50"
                      : index < 7
                        ? "bg-secondary/60"
                        : "bg-tertiary/70"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-32 md:px-8">
          <div className="rounded-[2.5rem] border border-white/8 bg-[linear-gradient(135deg,#1b1b1b_0%,#131313_100%)] p-8 md:p-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-headline text-4xl font-black leading-tight tracking-tight md:text-5xl">
                  PARTNER WITH <span className="text-tertiary">KINETIC.</span>
                </h2>
                <p className="mt-6 text-xl font-light leading-8 text-on-surface-variant">
                  Are you a protocol or hackathon organizer? Join our waitlist
                  to integrate Kinetic&apos;s yield infrastructure and provide
                  instant liquidity to your winners.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    "Automated prize vesting schedules",
                    "Whitelisted secondary market access",
                    "Institutional investor exposure",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-tertiary">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <form className="rounded-[2rem] border border-white/8 bg-surface-container-lowest/80 p-8">
                <div className="space-y-5">
                  {["Name", "Organization", "Email"].map((field) => (
                    <label key={field} className="block">
                      <span className="mb-2 block px-1 font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">
                        {field}
                      </span>
                      <input
                        type={field === "Email" ? "email" : "text"}
                        placeholder={
                          field === "Name"
                            ? "John Doe"
                            : field === "Organization"
                              ? "Monad Protocol"
                              : "john@protocol.io"
                        }
                        className="w-full rounded-2xl border border-white/10 bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                      />
                    </label>
                  ))}
                  <button className="w-full rounded-2xl bg-tertiary px-5 py-4 font-headline text-lg font-bold text-on-tertiary transition-transform hover:scale-[1.02]">
                    Join Waitlist
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
