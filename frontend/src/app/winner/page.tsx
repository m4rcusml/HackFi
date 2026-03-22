"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, AppSidebar, Chip, MetricCard, SectionHeading } from "@/components/kinetic";
import { ActionFeedback, EmptyState, OfferCard, WalletPanel } from "@/components/hackfi-panels";
import { ProtectedRoute } from "@/components/auth-guard";
import { getSession } from "@/lib/auth";
import { formatAddress, useHackfi } from "@/hooks/use-hackfi";

const sideItems = [
  { href: "/winner", label: "Painel", icon: "grid_view" },
  { href: "/marketplace", label: "Premios ativos", icon: "military_tech" },
  { href: "/winner", label: "Minhas ofertas", icon: "account_balance_wallet" },
  { href: "/admin", label: "Governanca", icon: "gavel" },
  { href: "/winner", label: "Configuracoes", icon: "settings" },
];

const initialForm = {
  hackathonName: "Monad Hackathon",
  symbol: "MHACK",
  proofSeed: "proof-frontend-1",
  prizeAmount: "1000",
  discountBps: "1000",
  expectedPaymentDate: String(Math.floor(Date.now() / 1000) + 2592000),
};

export default function WinnerPage() {
  const session = getSession();
  const {
    account,
    connect,
    refresh,
    busy,
    tokenInfo,
    participantOffers,
    createOffer,
    isAdminWallet,
  } = useHackfi();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState("Conecte sua wallet e registre a primeira antecipacao.");
  const [hasError, setHasError] = useState(false);

  const mainOffer = participantOffers[0] ?? null;

  useEffect(() => {
    if (participantOffers.length > 0) {
      setFeedback("Ofertas carregadas a partir do contrato da Monad.");
      setHasError(false);
    }
  }, [participantOffers]);

  const progress = useMemo(() => {
    if (!mainOffer) return 0;
    const funded = Number(mainOffer.fundedAmount);
    const target = Number(mainOffer.fundingTarget);
    if (!target) return 0;
    return Math.min(100, Math.round((funded / target) * 100));
  }, [mainOffer]);

  async function handleCreateOffer() {
    try {
      setHasError(false);
      setFeedback("Criando oferta onchain...");
      await createOffer(form);
      setFeedback("Oferta criada com sucesso. Atualize ou aguarde a sincronizacao.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Falha ao criar a oferta.");
    }
  }

  return (
    <ProtectedRoute allowedRole="vencedor">
      <AppShell
        topActive="Ecossistema"
        sidebar={
          <AppSidebar
            profileName={session?.name || "Vencedor"}
            profileMeta={account ? formatAddress(account) : "wallet desconectada"}
            items={sideItems}
          />
        }
      >
        <SectionHeading
          title="Painel do vencedor"
          subtitle="Crie antecipacoes reais, acompanhe a captacao de investidores e veja o valor liberado para sua wallet."
          action={<Chip tone="tertiary">Fluxo onchain ativo</Chip>}
        />

        <WalletPanel
          account={account}
          tokenBalance={tokenInfo?.balance}
          tokenSymbol={tokenInfo?.symbol}
          isAdminWallet={isAdminWallet}
          onConnect={() => void connect()}
          onRefresh={() => void refresh()}
        />

        <section className="grid gap-6 md:grid-cols-12">
          <MetricCard
            label="Minhas ofertas"
            value={String(participantOffers.length)}
            detail="Total criado pela sua wallet"
            className="md:col-span-3"
          />
          <MetricCard
            label="Premio principal"
            value={mainOffer ? `${mainOffer.prizeAmount} ${tokenInfo?.symbol || ""}` : "-"}
            detail="Valor bruto do recebivel"
            className="md:col-span-3"
          />
          <MetricCard
            label="Funding atual"
            value={mainOffer ? `${mainOffer.fundedAmount} ${tokenInfo?.symbol || ""}` : "-"}
            detail={`Progresso: ${progress}%`}
            className="md:col-span-3"
          />
          <MetricCard
            label="Liberado para voce"
            value={mainOffer ? `${mainOffer.releasedToParticipant} ${tokenInfo?.symbol || ""}` : "-"}
            detail="Micropagamentos a cada nova tranche"
            className="md:col-span-3"
          />
        </section>

        <ActionFeedback message={busy ? "Executando transacao..." : feedback} error={hasError} />

        <section className="grid gap-8 xl:grid-cols-[1.05fr_1.35fr]">
          <div className="rounded-[2rem] border border-white/5 bg-surface-container-low p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Nova antecipacao
            </p>
            <h2 className="mt-3 font-headline text-2xl font-black text-white">
              Registrar premio
            </h2>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">
              O backend pode armazenar documentos e links. Nesta camada, o frontend envia para o contrato apenas os dados financeiros e o hash da prova.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Field label="Hackathon" value={form.hackathonName} onChange={(value) => setForm((current) => ({ ...current, hackathonName: value }))} />
              <Field label="Simbolo" value={form.symbol} onChange={(value) => setForm((current) => ({ ...current, symbol: value }))} />
              <Field label="Proof seed" value={form.proofSeed} onChange={(value) => setForm((current) => ({ ...current, proofSeed: value }))} />
              <Field label="Valor do premio" value={form.prizeAmount} onChange={(value) => setForm((current) => ({ ...current, prizeAmount: value }))} />
              <Field label="Desconto BPS" value={form.discountBps} onChange={(value) => setForm((current) => ({ ...current, discountBps: value }))} />
              <Field label="Pagamento esperado" value={form.expectedPaymentDate} onChange={(value) => setForm((current) => ({ ...current, expectedPaymentDate: value }))} />
            </div>

            <button
              onClick={() => void handleCreateOffer()}
              disabled={busy}
              className="mt-8 rounded-full bg-[linear-gradient(135deg,#6e54ff_0%,#7c4dff_100%)] px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60"
            >
              Criar antecipacao
            </button>
          </div>

          <div className="space-y-6">
            {participantOffers.length === 0 ? (
              <EmptyState
                title="Nenhuma antecipacao criada ainda"
                text="Assim que voce criar a primeira oferta onchain, ela aparecera aqui com status, funding, valor liberado e metadados do contrato."
              />
            ) : (
              participantOffers.map((offer) => (
                <OfferCard
                  key={offer.address}
                  offer={offer}
                  action={<Chip tone="secondary">{offer.discountBps / 100}% desconto</Chip>}
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
