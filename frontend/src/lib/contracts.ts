export const MONAD_TESTNET = {
  chainId: 10143,
  chainIdHex: "0x279f",
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadscan.com"],
};

export const ADDRESSES = {
  token: "0xE0f36c09978b7Cf6f02dDf5080076EfA37D892AA",
  factory: "0xe09D7e6fd49F650521c7fE29AB9a693aDF952B0a",
} as const;

export const STATUS_LABELS: Record<number, string> = {
  0: "Active",
  1: "Funded",
  2: "Settled",
  3: "Cancelled",
};

export const FACTORY_ABI = [
  "function owner() view returns (address)",
  "function paymentToken() view returns (address)",
  "function offersCount() view returns (uint256)",
  "function allOffers(uint256) view returns (address)",
  "function getParticipantOffers(address participant) view returns (address[])",
  "function createOffer(string hackathonName,string symbol,bytes32 validationHash,uint256 prizeAmount,uint256 discountBps,uint256 expectedPaymentDate) returns (address)",
  "function activateOffer(address offer,bytes32 validationHash)",
  "function rejectOffer(address offer)",
  "function settleOffer(address offer,uint256 amount)",
] as const;

export const OFFER_ABI = [
  "function participant() view returns (address)",
  "function paymentToken() view returns (address)",
  "function receiptToken() view returns (address)",
  "function hackathonName() view returns (string)",
  "function receiptSymbol() view returns (string)",
  "function validationHash() view returns (bytes32)",
  "function prizeAmount() view returns (uint256)",
  "function discountBps() view returns (uint256)",
  "function fundingTarget() view returns (uint256)",
  "function expectedPaymentDate() view returns (uint256)",
  "function status() view returns (uint8)",
  "function soldReceipts() view returns (uint256)",
  "function fundedAmount() view returns (uint256)",
  "function releasedToParticipant() view returns (uint256)",
  "function releasedTranches() view returns (uint256)",
  "function quote(uint256 receiptAmount) view returns (uint256)",
  "function previewClaim(address investor) view returns (uint256)",
  "function getSummary() view returns (uint8,uint256,uint256,uint256,uint256,uint256,uint256,bytes32)",
  "function buy(uint256 receiptAmount)",
  "function claim()",
] as const;

export const TOKEN_ABI = [
  "function owner() view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner,address spender) view returns (uint256)",
  "function approve(address spender,uint256 value) returns (bool)",
  "function mint(address to,uint256 value)",
] as const;
