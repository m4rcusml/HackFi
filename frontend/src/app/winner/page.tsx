"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip, MetricCard, SectionHeading, TopNav } from "@/components/kinetic";
import { ActionFeedback, EmptyState, OfferCard, WalletPanel } from "@/components/hackfi-panels";
import { ProtectedRoute } from "@/components/auth-guard";
import { useHackfi } from "@/hooks/use-hackfi";
import { parseBlockchainError, validateOfferForm, dateToTimestamp } from "@/lib/error-messages";

// Data padrão: 30 dias a partir de hoje
const getDefaultDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

const initialForm = {
  hackathonName: "Monad Hackathon",
  symbol: "MHACK",
  proofSeed: "proof-frontend-1",
  prizeAmount: "1000",
  discountBps: "1000",
  expectedPaymentDate: getDefaultDate(),
};

export default function WinnerPage() {
  const {
    account,
    connect,
    refresh,
    busy,
    loading,
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
      // Validar formulário
      const validation = validateOfferForm(form);
      if (!validation.valid) {
        setHasError(true);
        setFeedback(validation.error!);
        return;
      }

      setHasError(false);
      setFeedback("Criando oferta onchain...");

      // Converter data para timestamp Unix
      const timestampInSeconds = dateToTimestamp(form.expectedPaymentDate);

      await createOffer({
        ...form,
        expectedPaymentDate: String(timestampInSeconds),
      });

      setFeedback("Oferta criada com sucesso! Atualizando dados...");
    } catch (error) {
      setHasError(true);
      setFeedback(parseBlockchainError(error));
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <TopNav active="Vencedor" />
        <main className="mx-auto max-w-7xl px-6 pt-28 pb-20 md:px-8">
          <div className="mx-auto max-w-[1280px] space-y-10">
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

        {loading && (
          <div className="rounded-2xl border border-white/8 bg-surface-container-low px-4 py-3 text-sm text-zinc-200">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Carregando dados dos contratos...
            </div>
          </div>
        )}

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
              <Field
                label="Hackathon"
                value={form.hackathonName}
                onChange={(value) => setForm((current) => ({ ...current, hackathonName: value }))}
                placeholder="Nome do hackathon ou evento"
              />
              <Field
                label="Simbolo do Recibo"
                value={form.symbol}
                onChange={(value) => setForm((current) => ({ ...current, symbol: value }))}
                placeholder="Ex: MHACK, ETH2024"
              />
              <Field
                label="Proof Seed"
                value={form.proofSeed}
                onChange={(value) => setForm((current) => ({ ...current, proofSeed: value }))}
                placeholder="Hash ou identificador da prova"
              />
              <Field
                label="Valor do Premio"
                type="number"
                value={form.prizeAmount}
                onChange={(value) => setForm((current) => ({ ...current, prizeAmount: value }))}
                placeholder="1000"
                helper="Valor em tokens (hfUSD)"
              />
              <Field
                label="Desconto (BPS)"
                type="number"
                value={form.discountBps}
                onChange={(value) => setForm((current) => ({ ...current, discountBps: value }))}
                placeholder="1000 = 10%"
                helper="1000 BPS = 10%, 500 BPS = 5%"
              />
              <Field
                label="Data de Pagamento Esperada"
                type="date"
                value={form.expectedPaymentDate}
                onChange={(value) => setForm((current) => ({ ...current, expectedPaymentDate: value }))}
                helper="Quando você espera receber o prêmio"
              />
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
  type = "text",
  placeholder,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={type === "date" ? new Date().toISOString().split('T')[0] : undefined}
        step={type === "number" ? "any" : undefined}
        className="w-full rounded-[1.35rem] border border-white/8 bg-surface-container-lowest px-5 py-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-primary focus:ring-2 focus:ring-primary/35 [color-scheme:dark]"
      />
      {helper && (
        <p className="mt-1.5 text-xs text-zinc-500">{helper}</p>
      )}
    </label>
  );
}
