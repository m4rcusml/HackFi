import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const paymentTokenAddress = process.env.PAYMENT_TOKEN_ADDRESS;

if (typeof paymentTokenAddress !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(paymentTokenAddress)) {
  throw new Error("PAYMENT_TOKEN_ADDRESS must be a valid 0x-prefixed address in .env");
}

export default buildModule("PrizeFactoryModule", (m) => {
  const prizeFactory = m.contract("PrizeFactory", [paymentTokenAddress]);

  return { prizeFactory };
});
