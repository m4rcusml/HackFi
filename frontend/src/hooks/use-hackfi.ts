"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { ADDRESSES, FACTORY_ABI, MONAD_TESTNET, OFFER_ABI, STATUS_LABELS, TOKEN_ABI } from "@/lib/contracts";

type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  owner: string;
};

export type OfferDetails = {
  address: string;
  participant: string;
  hackathonName: string;
  receiptSymbol: string;
  receiptToken: string;
  validationHash: string;
  statusCode: number;
  statusLabel: string;
  prizeAmount: string;
  fundingTarget: string;
  fundedAmount: string;
  soldReceipts: string;
  releasedToParticipant: string;
  expectedPaymentDate: number;
  discountBps: number;
  receiptBalance: string;
  claimable: string;
  prizeAmountRaw: bigint;
  fundingTargetRaw: bigint;
};

export function formatAddress(value?: string) {
  if (!value) return "-";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function formatAmount(value: bigint, decimals: number) {
  const formatted = ethers.formatUnits(value, decimals);
  const [integer, fraction] = formatted.split(".");
  if (!fraction) return integer;
  const trimmed = fraction.slice(0, 4).replace(/0+$/, "");
  return trimmed ? `${integer}.${trimmed}` : integer;
}

async function safeCall<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

async function loadAllOfferAddresses(factoryRead: ethers.Contract) {
  const counted = await safeCall(() => factoryRead.offersCount(), null as bigint | null);
  const addresses: string[] = [];

  if (counted !== null) {
    for (let index = 0; index < Number(counted); index += 1) {
      // eslint-disable-next-line no-await-in-loop
      addresses.push(await factoryRead.allOffers(index));
    }
    return addresses;
  }

  for (let index = 0; index < 100; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    const value = await safeCall(() => factoryRead.allOffers(index), "");
    if (!value) break;
    addresses.push(value);
  }

  return addresses;
}

export function useHackfi() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState("");
  const [factoryOwner, setFactoryOwner] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [offers, setOffers] = useState<OfferDetails[]>([]);
  const [participantOffers, setParticipantOffers] = useState<OfferDetails[]>([]);
  const [busy, setBusy] = useState(false);

  const factory = useMemo(
    () => (signer ? new ethers.Contract(ADDRESSES.factory, FACTORY_ABI, signer) : null),
    [signer]
  );

  const factoryRead = useMemo(
    () => ((provider || signer) ? new ethers.Contract(ADDRESSES.factory, FACTORY_ABI, provider || signer) : null),
    [provider, signer]
  );

  const paymentToken = useMemo(
    () => (signer ? new ethers.Contract(ADDRESSES.token, TOKEN_ABI, signer) : null),
    [signer]
  );

  const paymentTokenRead = useMemo(
    () => ((provider || signer) ? new ethers.Contract(ADDRESSES.token, TOKEN_ABI, provider || signer) : null),
    [provider, signer]
  );

  const isAdminWallet = !!account && !!factoryOwner && account.toLowerCase() === factoryOwner.toLowerCase();

  const switchToMonad = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask nao encontrada.");

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET.chainIdHex }],
      });
    } catch (error: unknown) {
      const walletError = error as { code?: number };
      if (walletError.code !== 4902) throw error;
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [MONAD_TESTNET],
      });
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask nao encontrada.");

    await switchToMonad();
    const nextProvider = new ethers.BrowserProvider(window.ethereum);
    await nextProvider.send("eth_requestAccounts", []);
    const nextSigner = await nextProvider.getSigner();
    const nextAccount = await nextSigner.getAddress();

    setProvider(nextProvider);
    setSigner(nextSigner);
    setAccount(nextAccount);
  }, [switchToMonad]);

  const readOffer = useCallback(
    async (offerAddress: string, decimals: number, accountAddress: string) => {
      if (!provider && !signer) return null;

      try {
        const runner = provider || signer;
        const offer = new ethers.Contract(offerAddress, OFFER_ABI, runner);
        const participant = await safeCall(() => offer.participant(), ethers.ZeroAddress);
        const hackathonName = await safeCall(() => offer.hackathonName(), "Offer");
        const receiptTokenAddress = await safeCall(() => offer.receiptToken(), ethers.ZeroAddress);
        const discountBps = await safeCall(() => offer.discountBps(), BigInt(0));
        const summary = await safeCall(
          () => offer.getSummary(),
          [0, BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), ethers.ZeroHash] as const
        );

        const receiptToken = new ethers.Contract(receiptTokenAddress, TOKEN_ABI, runner);
        const receiptSymbol = await safeCall(() => offer.receiptSymbol(), await safeCall(() => receiptToken.symbol(), "RCPT"));
        const [receiptBalance, claimable] = await Promise.all([
          accountAddress
            ? safeCall(() => receiptToken.balanceOf(accountAddress), BigInt(0))
            : Promise.resolve(BigInt(0)),
          accountAddress
            ? safeCall(() => offer.previewClaim(accountAddress), BigInt(0))
            : Promise.resolve(BigInt(0)),
        ]);

        return {
          address: offerAddress,
          participant,
          hackathonName,
          receiptSymbol,
          receiptToken: receiptTokenAddress,
          validationHash: summary[7],
          statusCode: Number(summary[0]),
          statusLabel: STATUS_LABELS[Number(summary[0])] ?? `Unknown ${summary[0]}`,
          prizeAmount: formatAmount(summary[1], decimals),
          fundingTarget: formatAmount(summary[2], decimals),
          fundedAmount: formatAmount(summary[3], decimals),
          soldReceipts: formatAmount(summary[4], decimals),
          releasedToParticipant: formatAmount(summary[5], decimals),
          expectedPaymentDate: Number(summary[6]),
          discountBps: Number(discountBps),
          receiptBalance: formatAmount(receiptBalance, decimals),
          claimable: formatAmount(claimable, decimals),
          prizeAmountRaw: summary[1],
          fundingTargetRaw: summary[2],
        } satisfies OfferDetails;
      } catch (error) {
        console.error(`Falha ao ler offer ${offerAddress}`, error);
        return null;
      }
    },
    [provider, signer]
  );

  const refresh = useCallback(async () => {
    if (!factoryRead || !paymentTokenRead || !account) return;

    try {
      const [name, symbol, decimalsValue, balance, owner, ownOffers, tokenOwner] = await Promise.all([
        paymentTokenRead.name(),
        paymentTokenRead.symbol(),
        paymentTokenRead.decimals(),
        paymentTokenRead.balanceOf(account),
        factoryRead.owner(),
        factoryRead.getParticipantOffers(account),
        paymentTokenRead.owner().catch(() => ""),
      ]);

      const decimals = Number(decimalsValue);
      setFactoryOwner(owner);
      setTokenInfo({
        name,
        symbol,
        decimals,
        balance: formatAmount(balance, decimals),
        owner: tokenOwner,
      });

      const offerAddresses = await loadAllOfferAddresses(factoryRead);

      const allOffers = (await Promise.all(offerAddresses.map((address) => readOffer(address, decimals, account)))).filter(
        Boolean
      ) as OfferDetails[];
      const ownOfferSet = new Set((ownOffers as string[]).map((value) => value.toLowerCase()));

      setOffers(allOffers);
      setParticipantOffers(allOffers.filter((offer) => ownOfferSet.has(offer.address.toLowerCase())));
    } catch (error) {
      console.error("Falha ao atualizar dados onchain", error);
    }
  }, [account, factoryRead, paymentTokenRead, readOffer]);

  useEffect(() => {
    if (!window.ethereum) return;

    void (async () => {
      try {
        const ethereum = window.ethereum;
        if (!ethereum) return;

        const existingAccounts = (await ethereum.request({ method: "eth_accounts" })) as string[];
        if (!existingAccounts?.length) return;

        const nextProvider = new ethers.BrowserProvider(ethereum);
        const nextSigner = await nextProvider.getSigner();
        const nextAccount = await nextSigner.getAddress();

        setProvider(nextProvider);
        setSigner(nextSigner);
        setAccount(nextAccount);
      } catch (error) {
        console.error("Falha ao restaurar wallet conectada", error);
      }
    })();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setSigner(null);
        setProvider(null);
        setAccount("");
        setOffers([]);
        setParticipantOffers([]);
        return;
      }

      void connect();
    };

    const handleChainChanged = () => {
      void connect();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [connect]);

  useEffect(() => {
    if (!signer || !account) return;
    void refresh().catch((error) => {
      console.error("Falha no effect de refresh", error);
    });
  }, [account, refresh, signer]);

  const run = useCallback(async <T,>(operation: () => Promise<T>) => {
    setBusy(true);
    try {
      const result = await operation();
      const maybeTx = result as { wait?: () => Promise<unknown> };
      if (maybeTx?.wait) {
        await maybeTx.wait();
      }
      await refresh();
      return result;
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  const createOffer = useCallback(
    async (input: {
      hackathonName: string;
      symbol: string;
      proofSeed: string;
      prizeAmount: string;
      discountBps: string;
      expectedPaymentDate: string;
    }) => {
      if (!factory || !tokenInfo) throw new Error("Conecte a wallet primeiro.");

      return run(() =>
        factory.createOffer(
          input.hackathonName,
          input.symbol,
          ethers.id(input.proofSeed),
          ethers.parseUnits(input.prizeAmount || "0", tokenInfo.decimals),
          BigInt(input.discountBps),
          BigInt(input.expectedPaymentDate)
        )
      );
    },
    [factory, run, tokenInfo]
  );

  const mint = useCallback(
    async (recipient: string, amount: string) => {
      if (!paymentToken || !tokenInfo) throw new Error("Conecte a wallet primeiro.");
      return run(() => paymentToken.mint(recipient, ethers.parseUnits(amount || "0", tokenInfo.decimals)));
    },
    [paymentToken, run, tokenInfo]
  );

  const approve = useCallback(
    async (spender: string, amount: string) => {
      if (!paymentToken || !tokenInfo) throw new Error("Conecte a wallet primeiro.");
      return run(() => paymentToken.approve(spender, ethers.parseUnits(amount || "0", tokenInfo.decimals)));
    },
    [paymentToken, run, tokenInfo]
  );

  const buy = useCallback(
    async (offerAddress: string, amount: string) => {
      if (!signer || !tokenInfo) throw new Error("Conecte a wallet primeiro.");
      const offer = new ethers.Contract(offerAddress, OFFER_ABI, signer);
      return run(() => offer.buy(ethers.parseUnits(amount || "0", tokenInfo.decimals)));
    },
    [run, signer, tokenInfo]
  );

  const claim = useCallback(
    async (offerAddress: string) => {
      if (!signer) throw new Error("Conecte a wallet primeiro.");
      const offer = new ethers.Contract(offerAddress, OFFER_ABI, signer);
      return run(() => offer.claim());
    },
    [run, signer]
  );

  const activateOffer = useCallback(
    async (offerAddress: string, proofSeed: string) => {
      if (!factory) throw new Error("Conecte a wallet primeiro.");
      return run(() => factory.activateOffer(offerAddress, ethers.id(`validated-${proofSeed}`)));
    },
    [factory, run]
  );

  const rejectOffer = useCallback(
    async (offerAddress: string) => {
      if (!factory) throw new Error("Conecte a wallet primeiro.");
      return run(() => factory.rejectOffer(offerAddress));
    },
    [factory, run]
  );

  const settleOffer = useCallback(
    async (offerAddress: string, amount: string) => {
      if (!factory || !tokenInfo) throw new Error("Conecte a wallet primeiro.");
      return run(() => factory.settleOffer(offerAddress, ethers.parseUnits(amount || "0", tokenInfo.decimals)));
    },
    [factory, run, tokenInfo]
  );

  const getQuote = useCallback(
    async (offerAddress: string, amount: string) => {
      if (!tokenInfo) return "0";
      const parsedAmount = ethers.parseUnits(amount || "0", tokenInfo.decimals);

      try {
        if (!(provider || signer)) throw new Error("Sem runner");
        const offer = new ethers.Contract(offerAddress, OFFER_ABI, provider || signer);
        const quoteValue = await offer.quote(parsedAmount);
        return formatAmount(quoteValue, tokenInfo.decimals);
      } catch (error) {
        const fallbackOffer = offers.find((entry) => entry.address.toLowerCase() === offerAddress.toLowerCase());
        if (!fallbackOffer || fallbackOffer.prizeAmountRaw === BigInt(0)) {
          console.error("Falha ao obter quote", error);
          return "0";
        }

        const quoteValue = (parsedAmount * fallbackOffer.fundingTargetRaw) / fallbackOffer.prizeAmountRaw;
        return formatAmount(quoteValue, tokenInfo.decimals);
      }
    },
    [offers, provider, signer, tokenInfo]
  );

  return {
    account,
    connect,
    refresh,
    busy,
    provider,
    signer,
    tokenInfo,
    offers,
    participantOffers,
    factoryAddress: ADDRESSES.factory,
    tokenAddress: ADDRESSES.token,
    factoryOwner,
    isAdminWallet,
    mint,
    approve,
    buy,
    claim,
    createOffer,
    activateOffer,
    rejectOffer,
    settleOffer,
    getQuote,
  };
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, listener: (...args: never[]) => void) => void;
      removeListener: (event: string, listener: (...args: never[]) => void) => void;
    };
  }
}
