"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, AppSidebar, Chip, MetricCard, SectionHeading } from "@/components/kinetic";
import { ActionFeedback, EmptyState, OfferCard, WalletPanel } from "@/components/hackfi-panels";
import { ProtectedRoute } from "@/components/auth-guard";
import { getSession } from "@/lib/auth";
import { formatAddress, useHackfi } from "@/hooks/use-hackfi";

const sideItems = [
  { href: "/admin", label: "Painel", icon: "grid_view" },
  { href: "/marketplace", label: "Premios ativos", icon: "military_tech" },
  { href: "/investor", label: "Vaults de yield", icon: "account_balance_wallet" },
  { href: "/admin", label: "Governanca", icon: "gavel" },
  { href: "/winner", label: "Configuracoes", icon: "settings" },
];

export default function AdminPage() {
  const session = getSession();
  const {
    account,
    connect,
    refresh,
    busy,
    tokenInfo,
    offers,
    isAdminWallet,
    mint,
    approve,
    activateOffer,
    rejectOffer,
    settleOffer,
  } = useHackfi();

  const [selectedOffer, setSelectedOffer] = useState("");
  const [proofSeed, setProofSeed] = useState("proof-frontend-1");
  const [mintAmount, setMintAmount] = useState("1000");
  const [approveSettleAmount, setApproveSettleAmount] = useState("1000");
  const [settleAmount, setSettleAmount] = useState("1000");
  const [feedback, setFeedback] = useState("Conecte a wallet administradora para validar ofertas e liquidar premios.");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!selectedOffer && offers.length > 0) {
      setSelectedOffer(offers[0].address);
    }
  }, [offers, selectedOffer]);

  const activeOffer = useMemo(
    () => offers.find((offer) => offer.address === selectedOffer) ?? offers[0] ?? null,
    [offers, selectedOffer]
  );

  const pendingOffers = offers.filter((offer) => offer.statusCode === 0).length;
  const settledOffers = offers.filter((offer) => offer.statusCode === 4).length;

  async function handleActivate() {
    if (!activeOffer) return;
    try {
      setHasError(false);
      setFeedback("Ativando oferta...");
      await activateOffer(activeOffer.address, proofSeed);
      setFeedback("Oferta ativada.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao ativar.");
    }
  }

  async function handleReject() {
    if (!activeOffer) return;
    try {
      setHasError(false);
      setFeedback("Rejeitando oferta...");
      await rejectOffer(activeOffer.address);
      setFeedback("Oferta rejeitada.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao rejeitar.");
    }
  }

  async function handleApproveSettle() {
    if (!activeOffer) return;
    try {
      setHasError(false);
      setFeedback("Aprovando hfUSD para liquidacao...");
      await approve(activeOffer.address, approveSettleAmount);
      setFeedback("Approve de liquidacao confirmado.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao aprovar a liquidacao.");
    }
  }

  async function handleMint() {
    if (!account) return;
    try {
      setHasError(false);
      setFeedback("Mintando hfUSD para a wallet administradora...");
      await mint(account, mintAmount);
      setFeedback("hfUSD pronto para liquidacao.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao mintar hfUSD.");
    }
  }

  async function handleSettle() {
    if (!activeOffer) return;
    try {
      setHasError(false);
      setFeedback("Liquidando premio...");
      await settleOffer(activeOffer.address, settleAmount);
      setFeedback("Oferta liquidada com sucesso.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao liquidar.");
    }
  }

  return (
    <ProtectedRoute allowedRole="admin">
      <AppShell
        topActive="Administracao"
        sidebar={
          <AppSidebar
            profileName={session?.name || "Admin"}
            profileMeta={account ? formatAddress(account) : "wallet desconectada"}
            items={sideItems}
          />
        }
      >
        <SectionHeading
          title="Painel administrativo"
          subtitle="Monitore as offers da PrizeFactory, valide vencedores e liquide os recebiveis quando o premio chegar."
          action={<Chip tone={isAdminWallet ? "tertiary" : "default"}>{isAdminWallet ? "Owner detectado" : "Wallet sem permissao"}</Chip>}
        />

        <WalletPanel
          account={account}
          tokenBalance={tokenInfo?.balance}
          tokenSymbol={tokenInfo?.symbol}
          isAdminWallet={isAdminWallet}
          onConnect={() => void connect()}
          onRefresh={() => void refresh()}
        />

        <section className="grid gap-6 md:grid-cols-4">
          <MetricCard label="Ofertas totais" value={String(offers.length)} detail="Registradas na factory" />
          <MetricCard label="Pendentes" value={String(pendingOffers)} detail="Aguardando validacao" />
          <MetricCard label="Liquidadas" value={String(settledOffers)} detail="Com claim disponivel" />
          <MetricCard
            label="Selecionada"
            value={activeOffer ? activeOffer.hackathonName : "-"}
            detail={activeOffer ? activeOffer.statusLabel : "Nenhuma"}
          />
        </section>

        <ActionFeedback message={busy ? "Executando transacao..." : feedback} error={hasError} />

        <section className="grid gap-8 xl:grid-cols-[1fr_1.35fr]">
          <div className="rounded-[2rem] border border-white/5 bg-surface-container-low p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Governanca operacional
            </p>
            <h2 className="mt-3 font-headline text-2xl font-black text-white">
              Validacao e liquidacao
            </h2>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">
              O contrato exige que a wallet owner da factory execute ativacao, rejeicao e settle. O approve do hfUSD tambem deve usar o endereco da offer selecionada.
            </p>

            <div className="mt-8 space-y-5">
              <Field label="Offer address" value={selectedOffer} onChange={setSelectedOffer} />
              <Field label="Validation seed" value={proofSeed} onChange={setProofSeed} />
              <Field label="Mint hfUSD demo" value={mintAmount} onChange={setMintAmount} />
              <Field label="Approve para settle" value={approveSettleAmount} onChange={setApproveSettleAmount} />
              <Field label="Valor de settle" value={settleAmount} onChange={setSettleAmount} />
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
                onClick={() => void handleActivate()}
                disabled={!activeOffer || busy}
                className="rounded-full bg-[linear-gradient(135deg,#6e54ff_0%,#0566d9_100%)] px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60"
              >
                Ativar oferta
              </button>
              <button
                onClick={() => void handleReject()}
                disabled={!activeOffer || busy}
                className="rounded-full border border-red-400/20 bg-red-950/30 px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-red-200 disabled:opacity-60"
              >
                Rejeitar
              </button>
              <button
                onClick={() => void handleApproveSettle()}
                disabled={!activeOffer || busy}
                className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 font-headline text-sm font-semibold text-white disabled:opacity-60"
              >
                Aprovar liquidacao
              </button>
              <button
                onClick={() => void handleSettle()}
                disabled={!activeOffer || busy}
                className="rounded-full bg-tertiary px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-on-tertiary disabled:opacity-60"
              >
                Liquidar premio
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {offers.length === 0 ? (
              <EmptyState
                title="Nenhuma oferta registrada"
                text="Assim que os vencedores criarem ofertas, elas aparecerao aqui para ativacao, rejeicao e settle."
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
                      Operar
                    </button>
                  }
                />
              ))
            )}
          </div>
        </section>
      </AppShell>
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
