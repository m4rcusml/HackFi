"use client";

import Link from "next/link";
import { Chip, Footer, Icon, TopNav } from "@/components/kinetic";

const flowCards = [
  {
    title: "Hacker",
    text: "Registra o premio, anexa prova e links do projeto, cria a antecipacao e acompanha os micropagamentos na wallet.",
    cta: "Acessar painel",
    href: "/winner",
    icon: "military_tech",
    bullets: ["Criar antecipacao", "Acompanhar funding", "Receber liberacoes em tranches"],
  },
  {
    title: "Investidor",
    text: "Avalia ofertas verificadas, aprova hfUSD, compra fracoes do premio e recebe o claim quando a liquidacao acontece.",
    cta: "Acessar painel",
    href: "/investor",
    icon: "monitoring",
    bullets: ["Filtrar oportunidades", "Comprar recibos", "Sacar retorno proporcional"],
  },
];

const steps = [
  {
    title: "1. Vencedor cria o recebivel",
    text: "O hacker informa hackathon, valor do premio, desconto e hash da prova. Isso vira uma oferta onchain.",
  },
  {
    title: "2. Investidor financia",
    text: "Cada compra gera recibos fracionados e libera capital em tranches para o vencedor conforme o funding avanca.",
  },
  {
    title: "3. Liquidacao e claim",
    text: "Quando o prazo chega, os investidores sacam o retorno proporcional diretamente na carteira.",
  },
];

export default function Home() {
  const dashboardHref = "/marketplace";
  const heroPrimary = "Ver oportunidades";
  const heroSecondary = "Explorar marketplace";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav
        active="Ecossistema"
        actionLabel="Explorar"
        actionHref={dashboardHref}
      />

      <main className="relative overflow-hidden pt-20">
        <div className="hero-orb right-[-12rem] top-[-8rem] h-[32rem] w-[32rem] bg-primary-container/30" />
        <div className="hero-orb bottom-[-10rem] left-[-12rem] h-[32rem] w-[32rem] bg-secondary-container/20" />

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-5xl space-y-8">
              <Chip tone="tertiary">Infraestrutura de antecipacao de premios na Monad</Chip>
              <h1 className="font-headline text-5xl font-black leading-[0.92] tracking-tight md:text-8xl">
                VENCA.
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ANTECIPE.
                </span>
                <br />
                LIQUIDE.
              </h1>
              <p className="max-w-3xl text-lg font-light leading-8 text-on-surface-variant md:text-2xl">
                O HackFi conecta vencedores de hackathons e investidores em um fluxo unico:
                o vencedor transforma um premio futuro em liquidez agora, e o investidor compra
                recibos com desconto esperando o retorno na data de liquidacao.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href={dashboardHref}
                  className="rounded-2xl bg-[linear-gradient(135deg,#6e54ff_0%,#0566d9_100%)] px-10 py-5 text-center font-headline text-lg font-bold text-white shadow-xl shadow-primary-container/20 transition-all hover:scale-[1.03]"
                >
                  {heroPrimary}
                </Link>
                <Link
                  href="/marketplace"
                  className="rounded-2xl border border-white/10 bg-surface-container-low px-10 py-5 text-center font-headline text-lg font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  {heroSecondary}
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-surface-container-low p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                Fluxo do produto
              </p>
              <div className="mt-6 space-y-5">
                {steps.map((step) => (
                  <div key={step.title} className="rounded-[1.35rem] border border-white/6 bg-white/[0.03] p-5">
                    <h2 className="font-headline text-lg font-bold text-white">{step.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-on-surface-variant">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 md:px-8">
          <div className="mb-14 text-center">
            <h2 className="font-headline text-4xl font-black tracking-tight md:text-5xl">
              CADA PERFIL TEM UM <span className="text-primary">FLUXO CLARO</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-on-surface-variant">
              A plataforma foi desenhada para conectar hackers e investidores de forma direta e transparente.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {flowCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.75rem] border border-white/8 bg-surface-container-low p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                  <Icon name={card.icon} className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 font-headline text-2xl font-bold">{card.title}</h3>
                <p className="mt-4 min-h-28 leading-7 text-on-surface-variant">{card.text}</p>
                <div className="space-y-3">
                  {card.bullets.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Icon name="check_circle" className="h-4 w-4 text-tertiary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
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
          <ValueCard
            title="Para vencedores"
            description="A proposta original do produto e reduzir o tempo entre vencer e receber. O painel do hacker foca em criar a antecipacao, acompanhar o funding e visualizar o valor ja liberado."
            stats={["Premio tokenizado", "Micropagamentos em tranches", "Mesmo login para futuras vitorias"]}
            className="md:col-span-7"
          />
          <ValueCard
            title="Para investidores"
            description="O investidor nao navega em NFTs abstratos. Ele avalia oportunidades de recebiveis verificadas, aprova hfUSD, compra fracoes do premio e acompanha claim e retorno."
            stats={["Compra fracionada", "Quote onchain", "Claim proporcional apos settle"]}
            className="md:col-span-5"
          />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 md:px-8">
          <div className="rounded-[2rem] border border-white/8 bg-surface-container-lowest p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-headline text-4xl font-bold">Leituras e acoes reais do contrato</h2>
                <p className="mt-2 text-on-surface-variant">
                  O frontend ja foi adaptado para usar a `PrizeFactory`, as `PrizeOffer` e o `TestERC20` deployados na Monad testnet.
                </p>
              </div>
              <Chip tone="tertiary">Monad Testnet</Chip>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Winner", "Create offer, acompanhar status, funding e liberacao"],
                ["Investor", "Approve, buy, claim e quote da oferta"],
                ["Marketplace", "Listagem onchain das offers disponiveis"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/6 bg-surface-container-highest/60 p-5">
                  <p className="font-headline text-lg font-bold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ValueCard({
  title,
  description,
  stats,
  className,
}: {
  title: string;
  description: string;
  stats: string[];
  className: string;
}) {
  return (
    <div className={`rounded-[2rem] border border-white/8 bg-surface-container-low p-8 ${className}`}>
      <h3 className="font-headline text-3xl font-bold">{title}</h3>
      <p className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant">
        {description}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-1">
        {stats.map((stat) => (
          <div
            key={stat}
            className="rounded-2xl border border-white/6 bg-surface-container-highest/60 p-4"
          >
            <p className="break-words font-mono text-sm font-bold text-primary">{stat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
