"use client";

import { ReactNode } from "react";
import { Chip, Icon } from "@/components/kinetic";
import { OfferDetails, formatAddress } from "@/hooks/use-hackfi";

export function WalletPanel({
  account,
  tokenSymbol,
  tokenBalance,
  isAdminWallet,
  onConnect,
  onRefresh,
}: {
  account: string;
  tokenSymbol?: string;
  tokenBalance?: string;
  isAdminWallet: boolean;
  onConnect: () => void;
  onRefresh: () => void;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-12 md:gap-6">
      <div className="glass-panel kinetic-border rounded-3xl p-5 md:col-span-7 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Wallet conectada
            </p>
            <h2 className="mt-2 break-all font-headline text-xl font-black text-white sm:text-2xl">
              {account || "Conecte sua MetaMask"}
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Chain: Monad Testnet. Todas as acoes desta interface escrevem no contrato real.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={onConnect}
              className="rounded-2xl bg-[linear-gradient(135deg,#6e54ff_0%,#0566d9_100%)] px-5 py-3 font-headline text-sm font-bold text-white"
            >
              {account ? "Trocar wallet" : "Conectar carteira"}
            </button>
            <button
              onClick={onRefresh}
              className="rounded-2xl border border-white/10 bg-surface-container-low px-5 py-3 text-sm font-semibold text-white"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel kinetic-border rounded-3xl p-5 md:col-span-3 md:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          Saldo
        </p>
        <h3 className="mt-2 break-words font-headline text-2xl font-black text-white md:text-3xl">
          {tokenBalance || "-"} {tokenSymbol || ""}
        </h3>
      </div>

      <div className="glass-panel kinetic-border rounded-3xl p-5 md:col-span-2 md:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          Permissao
        </p>
        <div className="mt-3">
          <Chip tone={isAdminWallet ? "tertiary" : "default"}>
            {isAdminWallet ? "Admin wallet" : "Carteira de usuario"}
          </Chip>
        </div>
      </div>
    </section>
  );
}

export function OfferCard({
  offer,
  action,
}: {
  offer: OfferDetails;
  action?: ReactNode;
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/8 bg-surface-container-low p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-headline text-lg font-bold text-white sm:text-xl">{offer.hackathonName}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            {offer.receiptSymbol} · {formatAddress(offer.address)}
          </p>
        </div>
        <Chip
          tone={
            offer.statusCode === 4
              ? "tertiary"
              : offer.statusCode === 1 || offer.statusCode === 3
                ? "primary"
                : "default"
          }
        >
          {offer.statusLabel}
        </Chip>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:gap-4">
        <Info label="Premio" value={offer.prizeAmount} />
        <Info label="Funding target" value={offer.fundingTarget} />
        <Info label="Funded" value={offer.fundedAmount} />
        <Info label="Pago ao hacker" value={offer.releasedToParticipant} />
        <Info label="Recibos vendidos" value={offer.soldReceipts} />
        <Info label="Seu claim" value={offer.claimable} accent />
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#6e54ff_0%,#4edea3_100%)]"
          style={{
            width: `${Math.min(
              100,
              Math.max(0, Number(offer.fundingTarget) > 0 ? (Number(offer.fundedAmount) / Number(offer.fundingTarget)) * 100 : 0)
            )}%`,
          }}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="text-xs text-zinc-500">
          Pagamento esperado:{" "}
          <span className="font-semibold text-zinc-200">
            {new Date(offer.expectedPaymentDate * 1000).toLocaleDateString()}
          </span>
        </div>
        {action}
      </div>
    </article>
  );
}

export function ActionFeedback({
  message,
  error,
}: {
  message: string;
  error?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        error
          ? "border-red-400/20 bg-red-950/30 text-red-200"
          : "border-white/8 bg-surface-container-low text-zinc-200"
      }`}
    >
      {message}
    </div>
  );
}

function Info({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>
      <p className={`mt-2 break-words font-mono text-sm ${accent ? "text-tertiary" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

export function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/10 bg-surface-container-lowest p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-zinc-500">
        <Icon name="monitoring" className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-headline text-xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-zinc-500">{text}</p>
    </div>
  );
}
