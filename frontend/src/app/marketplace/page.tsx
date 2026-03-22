"use client";

import { useMemo, useState } from "react";
import { Footer, Icon, TopNav } from "@/components/kinetic";
import { ActionFeedback, EmptyState, OfferCard, WalletPanel } from "@/components/hackfi-panels";
import { useHackfi } from "@/hooks/use-hackfi";

export default function MarketplacePage() {
  const {
    account,
    connect,
    refresh,
    busy,
    loading,
    tokenInfo,
    offers,
    isAdminWallet,
    approve,
    buy,
  } = useHackfi();

  const [selectedOffer, setSelectedOffer] = useState("");
  const [buyAmount, setBuyAmount] = useState("500");
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);

  const activeOffer = useMemo(
    () => offers.find((offer) => offer.address === selectedOffer) ?? offers[0] ?? null,
    [offers, selectedOffer]
  );

  const activeCount = offers.filter((offer) => offer.statusCode === 0 || offer.statusCode === 1).length;
  const totalFunding = offers.reduce((sum, offer) => sum + Number(offer.fundedAmount || "0"), 0);

  async function handleBuy() {
    if (!activeOffer) return;
    try {
      setHasError(false);
      setFeedback("Executando compra...");
      await buy(activeOffer.address, buyAmount);
      setFeedback("Compra concluida.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao comprar.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav active="Marketplace" actionLabel={account ? "Abrir painel" : "Conectar carteira"} actionHref={account ? "/investor" : "/marketplace"} />
      <main className="mx-auto max-w-7xl px-6 pt-28 pb-20 md:px-8">
        <section className="space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-white">
                Marketplace
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant">
                Ofertas onchain vindas da PrizeFactory na Monad Testnet, com compra fracionada e claim proporcional.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Stat title="Ofertas ativas" value={String(activeCount)} />
              <Stat title="Funding total" value={`${totalFunding.toFixed(2)} ${tokenInfo?.symbol || ""}`} accent />
            </div>
          </div>

          <WalletPanel
            account={account}
            tokenBalance={tokenInfo?.balance}
            tokenSymbol={tokenInfo?.symbol}
            isAdminWallet={isAdminWallet}
          />

          {loading && (
            <div className="rounded-2xl border border-white/8 bg-surface-container-low px-4 py-3 text-sm text-zinc-200">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Carregando dados dos contratos...
              </div>
            </div>
          )}

          {(busy || feedback) && (
            <ActionFeedback message={busy ? "Executando transacao..." : feedback} error={hasError} />
          )}
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[0.92fr_1.35fr]">
          <div className="rounded-[2rem] border border-white/5 bg-surface-container-low p-6 md:p-8 xl:sticky xl:top-28 xl:self-start">
            <div className="flex items-center gap-3">
              <Icon name="shopping_cart" className="h-5 w-5 text-primary" />
              <h2 className="font-headline text-2xl font-black text-white">
                Comprar no marketplace
              </h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              Selecione uma oferta e a quantidade de recibos. A compra transfere hfUSD automaticamente.
            </p>

            <div className="mt-8 space-y-5">
              <Field label="Offer address" value={selectedOffer} onChange={setSelectedOffer} />
              <Field label="Recibos a comprar" value={buyAmount} onChange={setBuyAmount} />
            </div>

            <button
              onClick={() => void handleBuy()}
              disabled={!activeOffer || busy}
              className="mt-8 w-full rounded-full bg-[linear-gradient(135deg,#6e54ff_0%,#0566d9_100%)] px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60"
            >
              Comprar recibos
            </button>
          </div>

          <div className="space-y-4 md:space-y-6">
            {offers.length === 0 ? (
              <EmptyState
                title="Nenhuma oferta listada"
                text="Conecte a wallet e atualize. Se ainda estiver vazio, nenhum vencedor criou uma oferta na factory."
              />
            ) : (
              offers.map((offer) => (
                <OfferCard
                  key={offer.address}
                  offer={offer}
                  action={
                    <button
                      onClick={() => setSelectedOffer(offer.address)}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white"
                    >
                      Investir
                    </button>
                  }
                />
              ))
            )}
          </div>
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
    <div className="rounded-2xl border border-white/8 bg-surface-container-low px-5 py-4 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-outline">
        {title}
      </p>
      <p className={`mt-1 break-words font-headline text-lg font-bold sm:text-xl ${accent ? "text-tertiary" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-w-0 rounded-[1.35rem] border border-white/8 bg-surface-container-lowest px-4 py-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-primary focus:ring-2 focus:ring-primary/35 md:px-5"
      />
    </label>
  );
}
