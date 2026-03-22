import Link from "next/link";
import { Chip, Footer, Icon, TopNav } from "@/components/kinetic";

const pathCards = [
  {
    title: "Investidor",
    text: "Acesse tokens de premio com desconto e receba rendimento de nivel institucional em recompensas verificadas.",
    cta: "Entrar como investidor",
    href: "/cadastro/investidor",
    icon: "monitoring",
  },
  {
    title: "Vencedor",
    text: "Tokenize suas recompensas futuras. Libere liquidez imediata para hackathons vencidos e grants de protocolo.",
    cta: "Entrar como vencedor",
    href: "/cadastro/vencedor",
    icon: "military_tech",
  },
  {
    title: "Admin de Hackathon",
    text: "Gerencie a distribuicao de premios, valide vencedores e integre a liquidez Kinetic aos seus eventos.",
    cta: "Entrar como admin",
    href: "/cadastro/admin",
    icon: "admin_panel_settings",
  },
];

const featureCards = [
  {
    title: "Para vencedores",
    description:
      "Nao espere meses pelo vesting do seu premio. Transforme recompensas futuras em ativos liquidos e libere capital agora.",
    icon: "workspace_premium",
    stats: ["94% Relacao LTV", "< 1s Liquidacao"],
  },
  {
    title: "Para investidores",
    description:
      "Acesse retornos institucionais comprando pools de premios com desconto de hackathons e incentivos do ecossistema.",
    icon: "monitoring",
    stats: ["24 vaults ativos", "18,4% APY medio"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav active="Ecossistema" actionLabel="Cadastrar" />
      <main className="relative overflow-hidden pt-20">
        <div className="hero-orb right-[-12rem] top-[-8rem] h-[32rem] w-[32rem] bg-primary-container/30" />
        <div className="hero-orb bottom-[-10rem] left-[-12rem] h-[32rem] w-[32rem] bg-secondary-container/20" />

        <section className="mx-auto max-w-7xl px-6 py-24 text-center md:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <Chip tone="tertiary">Infraestrutura de rendimento de alta performance</Chip>
            <h1 className="font-headline text-5xl font-black leading-[0.92] tracking-tight md:text-8xl">
              TOKENIZE SUA{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                VITORIA.
              </span>
              <br />
              LIQUIDE SEUS{" "}
              <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">
                PREMIOS.
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-light leading-8 text-on-surface-variant md:text-2xl">
              O primeiro mercado secundario para recompensas de protocolo e premios
              de hackathon. Liquidez para vencedores, alto alpha para investidores.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/marketplace"
                className="rounded-2xl bg-[linear-gradient(135deg,#6e54ff_0%,#0566d9_100%)] px-10 py-5 font-headline text-lg font-bold text-white shadow-xl shadow-primary-container/20 transition-all hover:scale-[1.03]"
              >
                Conectar carteira
              </Link>
              <Link
                href="/marketplace"
                className="rounded-2xl border border-white/10 bg-surface-container-low px-10 py-5 font-headline text-lg font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Explorar vaults
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 md:px-8">
          <div className="mb-14 text-center">
            <h2 className="font-headline text-4xl font-black tracking-tight md:text-5xl">
              ESCOLHA SUA <span className="text-primary">TRILHA</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-on-surface-variant">
              Escolha seu perfil para acessar um painel Kinetic moldado aos seus objetivos.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pathCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.75rem] border border-white/8 bg-surface-container-low p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                  <Icon name={card.icon} className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 font-headline text-2xl font-bold">{card.title}</h3>
                <p className="mt-4 min-h-28 leading-7 text-on-surface-variant">{card.text}</p>
                <Link
                  href={card.href}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-white/8 bg-surface-container-highest px-4 py-4 text-center font-bold transition-all hover:bg-primary hover:text-on-primary"
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
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-primary">
                  <Icon name={card.icon} className="h-6 w-6" />
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
                    <p className="break-words font-mono text-xl font-bold text-primary">{stat}</p>
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
                <h2 className="font-headline text-4xl font-bold">Fluxo de liquidez Kinetic</h2>
                <p className="mt-2 text-on-surface-variant">
                  Metricas em tempo real de tokenizacao e liquidacao de premios em todo o ecossistema Monad.
                </p>
              </div>
              <Chip tone="tertiary">Mainnet ativa</Chip>
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
                  FACA PARTE DA <span className="text-tertiary">KINETIC.</span>
                </h2>
                <p className="mt-6 text-xl font-light leading-8 text-on-surface-variant">
                  Voce organiza protocolos ou hackathons? Entre na lista para integrar a infraestrutura da Kinetic e oferecer liquidez imediata aos vencedores.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    "Calendario automatizado de vesting",
                    "Acesso whitelist ao mercado secundario",
                    "Exposicao a investidores institucionais",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Icon name="check_circle" className="h-5 w-5 text-tertiary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <form className="rounded-[2rem] border border-white/8 bg-surface-container-lowest/80 p-8">
                <div className="space-y-5">
                  {["Nome", "Organizacao", "Email"].map((field) => (
                    <label key={field} className="block">
                      <span className="mb-2 block px-1 font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">
                        {field}
                      </span>
                      <input
                        type={field === "Email" ? "email" : "text"}
                        placeholder={
                          field === "Nome"
                            ? "Joao Silva"
                            : field === "Organizacao"
                              ? "Monad Protocol"
                              : "joao@protocolo.io"
                        }
                        className="w-full rounded-2xl border border-white/10 bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                      />
                    </label>
                  ))}
                  <button className="w-full rounded-2xl bg-tertiary px-5 py-4 font-headline text-lg font-bold text-on-tertiary transition-transform hover:scale-[1.02]">
                    Entrar na lista
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
