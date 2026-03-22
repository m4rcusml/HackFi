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
  token: "0x0849c76D22704C4427aC155712d0b3A911a230fb",
  factory: "0x9b293Eaf3441DA20f9D113E20A7593407c31700C",
};

export const FACTORY_ABI = [
  "function paymentToken() view returns (address)",
  "function owner() view returns (address)",
  "function allOffers(uint256) view returns (address)",
  "function offersCount() view returns (uint256)",
  "function getParticipantOffers(address) view returns (address[])",
  "function createOffer(string hackathonName,string symbol,bytes32 validationHash,uint256 prizeAmount,uint256 discountBps,uint256 expectedPaymentDate) returns (address offer)",
  "function activateOffer(address offer,bytes32 validationHash)",
  "function rejectOffer(address offer)",
  "function settleOffer(address offer,uint256 amount)"
];

export const OFFER_ABI = [
  "function participant() view returns (address)",
  "function paymentToken() view returns (address)",
  "function receiptToken() view returns (address)",
  "function status() view returns (uint8)",
  "function fundedAmount() view returns (uint256)",
  "function releasedToParticipant() view returns (uint256)",
  "function soldReceipts() view returns (uint256)",
  "function fundingTarget() view returns (uint256)",
  "function prizeAmount() view returns (uint256)",
  "function quote(uint256 receiptAmount) view returns (uint256)",
  "function previewClaim(address investor) view returns (uint256)",
  "function getSummary() view returns (uint8,uint256,uint256,uint256,uint256,uint256,uint256,bytes32)",
  "function buy(uint256 receiptAmount)",
  "function claim()"
];

export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address spender,uint256 value) returns (bool)",
  "function mint(address to,uint256 value)"
];

export const STATUS_LABELS = ["Pending", "Active", "Rejected", "Funded", "Settled", "Cancelled"];
