"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { ADDRESSES, FACTORY_ABI, MONAD_TESTNET, OFFER_ABI, STATUS_LABELS, TOKEN_ABI } from "../lib/contracts";

const defaults = {
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

export default function HomePage() {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [factoryAddress, setFactoryAddress] = useState(ADDRESSES.factory);
  const [tokenAddress, setTokenAddress] = useState(ADDRESSES.token);
  const [offerAddress, setOfferAddress] = useState("");
  const [form, setForm] = useState(defaults);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [offerInfo, setOfferInfo] = useState(null);
  const [receiptInfo, setReceiptInfo] = useState(null);
  const [offers, setOffers] = useState([]);
  const [log, setLog] = useState("Conecte a wallet para comecar.");
  const [loading, setLoading] = useState(false);

  const factory = useMemo(() => signer && factoryAddress ? new ethers.Contract(factoryAddress, FACTORY_ABI, signer) : null, [signer, factoryAddress]);
  const token = useMemo(() => signer && tokenAddress ? new ethers.Contract(tokenAddress, TOKEN_ABI, signer) : null, [signer, tokenAddress]);
  const offer = useMemo(() => signer && offerAddress ? new ethers.Contract(offerAddress, OFFER_ABI, signer) : null, [signer, offerAddress]);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const appendLog = (message) => setLog((current) => `${new Date().toLocaleTimeString()} ${message}\n${current}`.trim());
  const parseUnits = (value) => ethers.parseUnits(value || "0", tokenInfo?.decimals ?? 6);

  async function switchToMonad() {
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: MONAD_TESTNET.chainIdHex }] });
    } catch (error) {
      if (error.code !== 4902) throw error;
      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [MONAD_TESTNET] });
    }
  }

  async function connect() {
    if (!window.ethereum) return appendLog("MetaMask nao encontrada.");
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
        token.name(), token.symbol(), token.decimals(), token.balanceOf(account),
      ]);
      setTokenInfo({ name, symbol, decimals: Number(decimals), balance: ethers.formatUnits(balance, decimals) });
    }
    if (factory && account) {
      const nextOffers = await factory.getParticipantOffers(account);
      setOffers(nextOffers);
    }
    if (offer && account) {
      const summary = await offer.getSummary();
      const receiptAddress = await offer.receiptToken();
      const receiptToken = new ethers.Contract(receiptAddress, TOKEN_ABI, signer);
      const [receiptBalance, claimable] = await Promise.all([
        receiptToken.balanceOf(account), offer.previewClaim(account),
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
  }, [signer, offerAddress]);

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
      <section className="hero">
        <div>
          <h1>HackFi Frontend Mockado</h1>
          <p>Conecta MetaMask e cobre mint, createOffer, activateOffer, approve, buy, settle e claim.</p>
        </div>
        <button className="primary" onClick={connect}>{account ? "Wallet conectada" : "Conectar MetaMask"}</button>
      </section>

      <section className="grid">
        <article className="card third">
          <h3>Config</h3>
          <div className="stack subtle">
            <span className="mono">Wallet: {account || "-"}</span>
            <span className="mono">Factory: {factoryAddress}</span>
            <span className="mono">Token: {tokenAddress}</span>
          </div>
        </article>

        <article className="card third">
          <h3>Payment Token</h3>
          <div className="stack subtle">
            <span>{tokenInfo?.name || "-"}</span>
            <span>{tokenInfo?.symbol || "-"}</span>
            <span>Saldo: {tokenInfo?.balance || "-"}</span>
          </div>
        </article>

        <article className="card third">
          <h3>Offer</h3>
          <div className="stack subtle">
            <span className="mono">{offerAddress || "-"}</span>
            <span>Status: {offerInfo?.status || "-"}</span>
            <span>Claim: {receiptInfo?.claimable || "-"}</span>
          </div>
        </article>

        <article className="card half">
          <h2>Mint Token</h2>
          <div className="row">
            <div className="field">
              <label>Recipient</label>
              <input value={form.mintRecipient} onChange={(e) => setField("mintRecipient", e.target.value)} />
            </div>
            <div className="field">
              <label>Amount</label>
              <input value={form.mintAmount} onChange={(e) => setField("mintAmount", e.target.value)} />
            </div>
          </div>
          <div className="actions">
            <button className="primary" disabled={!token || loading} onClick={() => exec("Mint", () => token.mint(form.mintRecipient, parseUnits(form.mintAmount)))}>Mint</button>
            <button className="secondary" onClick={refresh}>Refresh</button>
          </div>
        </article>

        <article className="card half">
          <h2>Create Offer</h2>
          <div className="row">
            <div className="field"><label>Hackathon</label><input value={form.hackathonName} onChange={(e) => setField("hackathonName", e.target.value)} /></div>
            <div className="field"><label>Symbol</label><input value={form.symbol} onChange={(e) => setField("symbol", e.target.value)} /></div>
            <div className="field"><label>Proof</label><input value={form.proof} onChange={(e) => setField("proof", e.target.value)} /></div>
            <div className="field"><label>Prize</label><input value={form.prizeAmount} onChange={(e) => setField("prizeAmount", e.target.value)} /></div>
            <div className="field"><label>Discount BPS</label><input value={form.discountBps} onChange={(e) => setField("discountBps", e.target.value)} /></div>
            <div className="field"><label>Expected Date</label><input value={form.expectedPaymentDate} onChange={(e) => setField("expectedPaymentDate", e.target.value)} /></div>
          </div>
          <div className="actions">
            <button className="primary" disabled={!factory || loading} onClick={() => exec("Create offer", () => factory.createOffer(form.hackathonName, form.symbol, ethers.id(form.proof), parseUnits(form.prizeAmount), BigInt(form.discountBps), BigInt(form.expectedPaymentDate)))}>Create</button>
            <button className="secondary" disabled={!factory || loading} onClick={refresh}>Load My Offers</button>
          </div>
          <div className="stack">
            {offers.map((value) => <button key={value} className="secondary mono" onClick={() => setOfferAddress(value)}>{value}</button>)}
          </div>
        </article>

        <article className="card half">
          <h2>Admin</h2>
          <div className="field">
            <label>Offer Address</label>
            <input value={offerAddress} onChange={(e) => setOfferAddress(e.target.value)} />
          </div>
          <div className="row">
            <div className="field"><label>Approve settle amount</label><input value={form.approveSettleAmount} onChange={(e) => setField("approveSettleAmount", e.target.value)} /></div>
            <div className="field"><label>Settle amount</label><input value={form.settleAmount} onChange={(e) => setField("settleAmount", e.target.value)} /></div>
          </div>
          <div className="actions">
            <button className="primary" disabled={!factory || !offerAddress || loading} onClick={() => exec("Activate", () => factory.activateOffer(offerAddress, ethers.id("validated-proof-1")))}>Activate</button>
            <button className="secondary" disabled={!token || !offerAddress || loading} onClick={() => exec("Approve settle", () => token.approve(offerAddress, parseUnits(form.approveSettleAmount)))}>Approve settle</button>
            <button className="primary" disabled={!factory || !offerAddress || loading} onClick={() => exec("Settle", () => factory.settleOffer(offerAddress, parseUnits(form.settleAmount)))}>Settle</button>
          </div>
        </article>

        <article className="card half">
          <h2>Investor</h2>
          <div className="row">
            <div className="field"><label>Approve buy amount</label><input value={form.approveBuyAmount} onChange={(e) => setField("approveBuyAmount", e.target.value)} /></div>
            <div className="field"><label>Buy receipts</label><input value={form.buyAmount} onChange={(e) => setField("buyAmount", e.target.value)} /></div>
          </div>
          <div className="actions">
            <button className="secondary" disabled={!token || !offerAddress || loading} onClick={() => exec("Approve buy", () => token.approve(offerAddress, parseUnits(form.approveBuyAmount)))}>Approve buy</button>
            <button className="primary" disabled={!offer || loading} onClick={() => exec("Buy", () => offer.buy(parseUnits(form.buyAmount)))}>Buy</button>
            <button className="primary" disabled={!offer || loading} onClick={() => exec("Claim", () => offer.claim())}>Claim</button>
          </div>
        </article>

        <article className="card">
          <h2>Onchain State</h2>
          <div className="stats">
            <div className="stat"><span className="subtle">Status</span><strong>{offerInfo?.status || "-"}</strong></div>
            <div className="stat"><span className="subtle">Prize</span><strong>{offerInfo?.prizeAmount || "-"}</strong></div>
            <div className="stat"><span className="subtle">Funding Target</span><strong>{offerInfo?.fundingTarget || "-"}</strong></div>
            <div className="stat"><span className="subtle">Funded</span><strong>{offerInfo?.fundedAmount || "-"}</strong></div>
            <div className="stat"><span className="subtle">Sold Receipts</span><strong>{offerInfo?.soldReceipts || "-"}</strong></div>
            <div className="stat"><span className="subtle">Released</span><strong>{offerInfo?.releasedToParticipant || "-"}</strong></div>
            <div className="stat"><span className="subtle">Receipt Balance</span><strong>{receiptInfo?.balance || "-"}</strong></div>
            <div className="stat"><span className="subtle">Claimable</span><strong>{receiptInfo?.claimable || "-"}</strong></div>
          </div>
          <div className="stack subtle" style={{ marginTop: 16 }}>
            <span className="mono">Validation hash: {offerInfo?.validationHash || "-"}</span>
            <span className="mono">Receipt token: {receiptInfo?.address || "-"}</span>
          </div>
        </article>

        <article className="card">
          <h2>Log</h2>
          <div className="log">{loading ? "Executando...\n" : ""}{log}</div>
        </article>
      </section>
    </main>
  );
}
