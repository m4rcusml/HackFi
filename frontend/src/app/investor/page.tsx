"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip, MetricCard, SectionHeading, TopNav } from "@/components/kinetic";
import { ActionFeedback, EmptyState, OfferCard, WalletPanel } from "@/components/hackfi-panels";
import { ProtectedRoute } from "@/components/auth-guard";
import { useHackfi } from "@/hooks/use-hackfi";

export default function InvestorPage() {
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
    claim,
    getQuote,
    mint,
  } = useHackfi();

  const [selectedOffer, setSelectedOffer] = useState("");
  const [buyAmount, setBuyAmount] = useState("500");
  const [mintAmount, setMintAmount] = useState("1000");
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);
  const [quote, setQuote] = useState("0");

  useEffect(() => {
    if (!selectedOffer && offers.length > 0) {
      setSelectedOffer(offers[0].address);
    }
  }, [offers, selectedOffer]);

  useEffect(() => {
    if (!selectedOffer) return;
    void getQuote(selectedOffer, buyAmount).then(setQuote).catch(() => setQuote("0"));
  }, [buyAmount, getQuote, selectedOffer]);

  const activeOffer = useMemo(
    () => offers.find((offer) => offer.address === selectedOffer) ?? offers[0] ?? null,
    [offers, selectedOffer]
  );

  const claimableOffers = offers.filter((offer) => Number(offer.claimable) > 0);

  async function handleBuy() {
    if (!activeOffer) return;
    try {
      setHasError(false);
      setFeedback("Executando compra de recibos...");
      await buy(activeOffer.address, buyAmount);
      setFeedback("Compra confirmada onchain.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao comprar.");
    }
  }

  async function handleClaim() {
    if (!activeOffer) return;
    try {
      setHasError(false);
      setFeedback("Solicitando claim...");
      await claim(activeOffer.address);
      setFeedback("Claim recebido com sucesso.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao executar claim.");
    }
  }

  async function handleMint() {
    if (!account) return;
    try {
      setHasError(false);
      setFeedback("Mintando hfUSD de teste para sua wallet...");
      await mint(account, mintAmount);
      setFeedback("hfUSD creditado na wallet conectada.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao mintar hfUSD.");
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <TopNav active="Investidor" />
        <main className="mx-auto max-w-7xl px-6 pt-28 pb-20 md:px-8">
          <div className="mx-auto max-w-[1280px] space-y-10">
            <SectionHeading
              title="Painel do investidor"
              subtitle="Acompanhe oportunidades reais, aprove hfUSD, compre recibos e saque o retorno na liquidacao."
              action={<Chip tone="tertiary">Portfolio onchain</Chip>}
            />

        <WalletPanel
          account={account}
          tokenBalance={tokenInfo?.balance}
          tokenSymbol={tokenInfo?.symbol}
          isAdminWallet={isAdminWallet}
        />

        <section className="grid gap-6 md:grid-cols-4">
          <MetricCard label="Ofertas disponiveis" value={String(offers.length)} detail="Leitura da PrizeFactory" />
          <MetricCard
            label="Selecionada"
            value={activeOffer ? activeOffer.hackathonName : "-"}
            detail={activeOffer ? `${activeOffer.discountBps / 100}% de desconto` : "Sem oferta"}
          />
          <MetricCard
            label="Quote da compra"
            value={`${quote} ${tokenInfo?.symbol || ""}`}
            detail={`Para ${buyAmount || "0"} recibos`}
          />
          <MetricCard
            label="Claims disponiveis"
            value={String(claimableOffers.length)}
            detail="Ofertas com saldo pronto para saque"
          />
        </section>

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

        <section className="grid gap-8 xl:grid-cols-[1fr_1.35fr]">
          <div className="rounded-[2rem] border border-white/5 bg-surface-container-low p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Execucao da compra
            </p>
            <h2 className="mt-3 font-headline text-2xl font-black text-white">
              Comprar fracao do premio
            </h2>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">
              Selecione a oferta e a quantidade de recibos que deseja comprar. A compra transfere hfUSD automaticamente.
            </p>

            <div className="mt-8 space-y-5">
              <Field label="Mint hfUSD demo" value={mintAmount} onChange={setMintAmount} />
              <Field label="Offer address" value={selectedOffer} onChange={setSelectedOffer} />
              <Field label="Recibos a comprar" value={buyAmount} onChange={setBuyAmount} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => void handleMint()}
                disabled={!account || busy}
                className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 font-headline text-sm font-semibold text-white disabled:opacity-60"
              >
                Mintar hfUSD
              </button>
              <button
                onClick={() => void handleBuy()}
                disabled={!activeOffer || busy}
                className="rounded-full bg-[linear-gradient(135deg,#6e54ff_0%,#0566d9_100%)] px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60"
              >
                Comprar recibos
              </button>
              <button
                onClick={() => void handleClaim()}
                disabled={!activeOffer || busy}
                className="rounded-full bg-tertiary px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-on-tertiary disabled:opacity-60"
              >
                Sacar claim
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {offers.length === 0 ? (
              <EmptyState
                title="Nenhuma oferta encontrada"
                text="Assim que um hacker criar ofertas, elas aparecerao aqui para compra."
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
                      Selecionar
                    </button>
                  }
                />
              ))
            )}
          </div>
        </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
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
        className="w-full rounded-[1.35rem] border border-white/8 bg-surface-container-lowest px-5 py-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-primary focus:ring-2 focus:ring-primary/35"
      />
    </label>
  );
}
