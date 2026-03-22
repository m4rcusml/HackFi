"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import {
  ADDRESSES,
  FACTORY_ABI,
  MONAD_TESTNET,
  OFFER_ABI,
  STATUS_LABELS,
  TOKEN_ABI,
} from "../lib/contracts";

const initialForm = {
  hackathonName: "Monad Hackathon",
  symbol: "MHACK",
  proof: "proof-frontend-1",
  prizeAmount: "1000",
  discountBps: "1000",
  expectedPaymentDate: String(Math.floor(Date.now() / 1000) + 2592000),
  mintRecipient: "0xb6855cf7C8531a4ee0deBFC7d6f96a8f98e3Fa12",
  mintAmount: "1000",
  approveBuyAmount: "900",
  buyAmount: "500",
  approveSettleAmount: "1000",
  settleAmount: "1000",
};

const roleCopy = {
  hacker: {
    title: "Painel do Hacker",
    description: "Registre o premio, acompanhe a captacao e veja quanto ja foi antecipado para sua wallet.",
  },
  investor: {
    title: "Painel do Investidor",
    description: "Avalie ofertas, aprove saldo de hfUSD, compre recibos e saque o claim na liquidacao.",
  },
  admin: {
    title: "Painel do Admin",
    description: "Valide ofertas, ative ou rejeite oportunidades e liquide os recebiveis quando o premio chegar.",
  },
};

export default function HomePage() {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [factoryAddress] = useState(ADDRESSES.factory);
  const [tokenAddress] = useState(ADDRESSES.token);
  const [offerAddress, setOfferAddress] = useState("");
  const [form, setForm] = useState(initialForm);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [offerInfo, setOfferInfo] = useState(null);
  const [receiptInfo, setReceiptInfo] = useState(null);
  const [offers, setOffers] = useState([]);
  const [log, setLog] = useState("Conecte a wallet para carregar os dados do HackFi.");
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("hacker");

  const factory = useMemo(
    () => (signer ? new ethers.Contract(factoryAddress, FACTORY_ABI, signer) : null),
    [signer, factoryAddress]
  );
  const token = useMemo(
    () => (signer ? new ethers.Contract(tokenAddress, TOKEN_ABI, signer) : null),
    [signer, tokenAddress]
  );
  const offer = useMemo(
    () => (signer && offerAddress ? new ethers.Contract(offerAddress, OFFER_ABI, signer) : null),
    [signer, offerAddress]
  );

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const appendLog = (message) => setLog((current) => `${new Date().toLocaleTimeString()} ${message}\n${current}`.trim());
  const parseUnits = (value) => ethers.parseUnits(value || "0", tokenInfo?.decimals ?? 6);

  async function switchToMonad() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET.chainIdHex }],
      });
    } catch (error) {
      if (error.code !== 4902) throw error;
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [MONAD_TESTNET],
      });
    }
  }

  async function connect() {
    if (!window.ethereum) {
      appendLog("MetaMask nao encontrada.");
      return;
    }

    await switchToMonad();
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const nextSigner = await provider.getSigner();
    const nextAccount = await nextSigner.getAddress();
    setSigner(nextSigner);
    setAccount(nextAccount);
    setField("mintRecipient", nextAccount);
    appendLog(`Wallet conectada: ${nextAccount}`);
  }

  async function refresh() {
    if (!signer) return;

    if (token && account) {
      const [name, symbol, decimals, balance] = await Promise.all([
        token.name(),
        token.symbol(),
        token.decimals(),
        token.balanceOf(account),
      ]);

      setTokenInfo({
        name,
        symbol,
        decimals: Number(decimals),
        balance: ethers.formatUnits(balance, decimals),
      });
    }

    if (factory && account) {
      const nextOffers = await factory.getParticipantOffers(account);
      setOffers(nextOffers);
      if (!offerAddress && nextOffers.length > 0) {
        setOfferAddress(nextOffers[nextOffers.length - 1]);
      }
    }

    if (offer && account) {
      const summary = await offer.getSummary();
      const receiptAddress = await offer.receiptToken();
      const receiptToken = new ethers.Contract(receiptAddress, TOKEN_ABI, signer);
      const [receiptBalance, claimable] = await Promise.all([
        receiptToken.balanceOf(account),
        offer.previewClaim(account),
      ]);
      const decimals = tokenInfo?.decimals ?? 6;

      setOfferInfo({
        status: STATUS_LABELS[Number(summary[0])] ?? `Unknown ${summary[0]}`,
        prizeAmount: ethers.formatUnits(summary[1], decimals),
        fundingTarget: ethers.formatUnits(summary[2], decimals),
        fundedAmount: ethers.formatUnits(summary[3], decimals),
        soldReceipts: ethers.formatUnits(summary[4], decimals),
        releasedToParticipant: ethers.formatUnits(summary[5], decimals),
        expectedPaymentDate: Number(summary[6]),
        validationHash: summary[7],
      });

      setReceiptInfo({
        address: receiptAddress,
        balance: ethers.formatUnits(receiptBalance, decimals),
        claimable: ethers.formatUnits(claimable, decimals),
      });
    }
  }

  useEffect(() => {
    refresh();
  }, [signer, offerAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  async function exec(label, fn) {
    try {
      setLoading(true);
      appendLog(`Iniciando: ${label}`);
      const tx = await fn();
      if (tx?.wait) {
        const receipt = await tx.wait();
        appendLog(`${label} confirmado. Tx: ${receipt.hash}`);
      } else {
        appendLog(`${label} concluido.`);
      }
      await refresh();
    } catch (error) {
      appendLog(`${label} falhou: ${error.shortMessage || error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero hero-product">
        <div className="hero-copy">
          <span className="eyebrow">HackFi on Monad</span>
          <h1>Antecipacao de premios para hackers, investidores e operadores</h1>
          <p>
            Esta interface ja se comporta como produto para usuario final. O hacker cria a antecipacao,
            o investidor compra fracoes do premio e o admin valida e liquida o recebivel.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={connect}>
              {account ? "Wallet conectada" : "Conectar MetaMask"}
            </button>
            <button className="secondary" onClick={refresh}>
              Atualizar dados
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-stat">
            <span className="subtle">Wallet ativa</span>
            <strong className="mono">{account || "desconectada"}</strong>
          </div>
          <div className="hero-stat">
            <span className="subtle">Token de pagamento</span>
            <strong>{tokenInfo?.symbol || "hfUSD"}</strong>
          </div>
          <div className="hero-stat">
            <span className="subtle">Saldo atual</span>
            <strong>{tokenInfo?.balance || "-"}</strong>
          </div>
        </div>
      </section>

      <section className="role-switch">
        {Object.entries(roleCopy).map(([role, copy]) => (
          <button
            key={role}
            className={activeRole === role ? "role-pill active" : "role-pill"}
            onClick={() => setActiveRole(role)}
          >
            {copy.title}
          </button>
        ))}
      </section>

      <section className="card role-banner">
        <h2>{roleCopy[activeRole].title}</h2>
        <p className="subtle">{roleCopy[activeRole].description}</p>
      </section>

      <section className="grid">
        <article className="card third">
          <h3>Infraestrutura</h3>
          <div className="stack subtle">
            <span>Chain: Monad Testnet</span>
            <span className="mono">Factory: {factoryAddress}</span>
            <span className="mono">Payment Token: {tokenAddress}</span>
            <span className="mono">Offer ativa: {offerAddress || "-"}</span>
          </div>
        </article>

        <article className="card third">
          <h3>Recibos do Investidor</h3>
          <div className="stack subtle">
            <span>
              Address: <span className="mono">{receiptInfo?.address || "-"}</span>
            </span>
            <span>Saldo: {receiptInfo?.balance || "-"}</span>
            <span>Claimavel: {receiptInfo?.claimable || "-"}</span>
          </div>
        </article>

        <article className="card third">
          <h3>Oferta Selecionada</h3>
          <div className="stack subtle">
            <span>Status: {offerInfo?.status || "-"}</span>
            <span>
              Funding: {offerInfo?.fundedAmount || "-"} / {offerInfo?.fundingTarget || "-"}
            </span>
            <span>Released: {offerInfo?.releasedToParticipant || "-"}</span>
          </div>
        </article>

        <article className="card half">
          <h2>Hacker</h2>
          <p className="subtle">Crie uma nova antecipacao e acompanhe as ofertas emitidas pela sua wallet.</p>
          <div className="row">
            <div className="field">
              <label>Hackathon</label>
              <input value={form.hackathonName} onChange={(e) => setField("hackathonName", e.target.value)} />
            </div>
            <div className="field">
              <label>Simbolo</label>
              <input value={form.symbol} onChange={(e) => setField("symbol", e.target.value)} />
            </div>
            <div className="field">
              <label>Proof seed</label>
              <input value={form.proof} onChange={(e) => setField("proof", e.target.value)} />
            </div>
            <div className="field">
              <label>Valor do premio</label>
              <input value={form.prizeAmount} onChange={(e) => setField("prizeAmount", e.target.value)} />
            </div>
            <div className="field">
              <label>Desconto BPS</label>
              <input value={form.discountBps} onChange={(e) => setField("discountBps", e.target.value)} />
            </div>
            <div className="field">
              <label>Pagamento esperado</label>
              <input value={form.expectedPaymentDate} onChange={(e) => setField("expectedPaymentDate", e.target.value)} />
            </div>
          </div>
          <div className="actions">
            <button
              className="primary"
              disabled={!factory || loading}
              onClick={() =>
                exec("Create offer", () =>
                  factory.createOffer(
                    form.hackathonName,
                    form.symbol,
                    ethers.id(form.proof),
                    parseUnits(form.prizeAmount),
                    BigInt(form.discountBps),
                    BigInt(form.expectedPaymentDate)
                  )
                )
              }
            >
              Criar antecipacao
            </button>
            <button className="secondary" disabled={!factory || loading} onClick={refresh}>
              Atualizar minhas ofertas
            </button>
          </div>
          <div className="offer-list">
            {offers.length === 0 ? (
              <span className="subtle">Nenhuma oferta criada por esta wallet ainda.</span>
            ) : (
              offers.map((value) => (
                <button key={value} className="offer-chip mono" onClick={() => setOfferAddress(value)}>
                  {value}
                </button>
              ))
            )}
          </div>
        </article>

        <article className="card half">
          <h2>Investidor</h2>
          <p className="subtle">Abasteca hfUSD, aprove o gasto, compre fracoes do premio e saque o claim.</p>
          <div className="row">
            <div className="field">
              <label>Wallet para mint</label>
              <input value={form.mintRecipient} onChange={(e) => setField("mintRecipient", e.target.value)} />
            </div>
            <div className="field">
              <label>Mint hfUSD</label>
              <input value={form.mintAmount} onChange={(e) => setField("mintAmount", e.target.value)} />
            </div>
            <div className="field">
              <label>Aprovar hfUSD para buy</label>
              <input value={form.approveBuyAmount} onChange={(e) => setField("approveBuyAmount", e.target.value)} />
            </div>
            <div className="field">
              <label>Comprar recibos</label>
              <input value={form.buyAmount} onChange={(e) => setField("buyAmount", e.target.value)} />
            </div>
          </div>
          <div className="actions">
            <button
              className="secondary"
              disabled={!token || loading}
              onClick={() => exec("Mint", () => token.mint(form.mintRecipient, parseUnits(form.mintAmount)))}
            >
              Mintar hfUSD
            </button>
            <button
              className="secondary"
              disabled={!token || !offerAddress || loading}
              onClick={() => exec("Approve buy", () => token.approve(offerAddress, parseUnits(form.approveBuyAmount)))}
            >
              Aprovar compra
            </button>
            <button
              className="primary"
              disabled={!offer || loading}
              onClick={() => exec("Buy", () => offer.buy(parseUnits(form.buyAmount)))}
            >
              Comprar fracoes
            </button>
            <button className="primary" disabled={!offer || loading} onClick={() => exec("Claim", () => offer.claim())}>
              Sacar claim
            </button>
          </div>
        </article>

        <article className="card">
          <h2>Admin</h2>
          <p className="subtle">Selecione a offer, ative ou rejeite, aprove o token e liquide o premio recebido.</p>
          <div className="row">
            <div className="field">
              <label>Offer address</label>
              <input value={offerAddress} onChange={(e) => setOfferAddress(e.target.value)} />
            </div>
            <div className="field">
              <label>Aprovar settle</label>
              <input value={form.approveSettleAmount} onChange={(e) => setField("approveSettleAmount", e.target.value)} />
            </div>
            <div className="field">
              <label>Liquidar valor</label>
              <input value={form.settleAmount} onChange={(e) => setField("settleAmount", e.target.value)} />
            </div>
            <div className="field">
              <label>Validation hash seed</label>
              <input value={form.proof} onChange={(e) => setField("proof", e.target.value)} />
            </div>
          </div>
          <div className="actions">
            <button
              className="primary"
              disabled={!factory || !offerAddress || loading}
              onClick={() => exec("Activate", () => factory.activateOffer(offerAddress, ethers.id(`validated-${form.proof}`)))}
            >
              Ativar oferta
            </button>
            <button
              className="danger"
              disabled={!factory || !offerAddress || loading}
              onClick={() => exec("Reject", () => factory.rejectOffer(offerAddress))}
            >
              Rejeitar oferta
            </button>
            <button
              className="secondary"
              disabled={!token || !offerAddress || loading}
              onClick={() => exec("Approve settle", () => token.approve(offerAddress, parseUnits(form.approveSettleAmount)))}
            >
              Aprovar liquidacao
            </button>
            <button
              className="primary"
              disabled={!factory || !offerAddress || loading}
              onClick={() => exec("Settle", () => factory.settleOffer(offerAddress, parseUnits(form.settleAmount)))}
            >
              Liquidar premio
            </button>
          </div>
        </article>

        <article className="card">
          <h2>Visao do Contrato</h2>
          <div className="stats">
            <div className="stat">
              <span className="subtle">Status</span>
              <strong>{offerInfo?.status || "-"}</strong>
            </div>
            <div className="stat">
              <span className="subtle">Premio</span>
              <strong>{offerInfo?.prizeAmount || "-"}</strong>
            </div>
            <div className="stat">
              <span className="subtle">Funding Target</span>
              <strong>{offerInfo?.fundingTarget || "-"}</strong>
            </div>
            <div className="stat">
              <span className="subtle">Funded</span>
              <strong>{offerInfo?.fundedAmount || "-"}</strong>
            </div>
            <div className="stat">
              <span className="subtle">Receipts vendidas</span>
              <strong>{offerInfo?.soldReceipts || "-"}</strong>
            </div>
            <div className="stat">
              <span className="subtle">Pago ao hacker</span>
              <strong>{offerInfo?.releasedToParticipant || "-"}</strong>
            </div>
            <div className="stat">
              <span className="subtle">Receipt balance</span>
              <strong>{receiptInfo?.balance || "-"}</strong>
            </div>
            <div className="stat">
              <span className="subtle">Claim disponivel</span>
              <strong>{receiptInfo?.claimable || "-"}</strong>
            </div>
          </div>
          <div className="stack subtle contract-meta">
            <span>Expected payment: {offerInfo ? new Date(offerInfo.expectedPaymentDate * 1000).toLocaleString() : "-"}</span>
            <span className="mono">Validation hash: {offerInfo?.validationHash || "-"}</span>
            <span className="mono">Receipt token: {receiptInfo?.address || "-"}</span>
          </div>
        </article>

        <article className="card">
          <h2>Atividade</h2>
          <div className="log">{loading ? "Executando...\n" : ""}{log}</div>
        </article>
      </section>
    </main>
  );
}
