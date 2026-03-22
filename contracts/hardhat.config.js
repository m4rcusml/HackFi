import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const validPrivateKey =
  typeof privateKey === "string" && /^0x[a-fA-F0-9]{64}$/.test(privateKey)
    ? privateKey
    : undefined;

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  paths: {
    sources: "./src",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "prague",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    monadTestnet: {
      type: "http",
      chainType: "generic",
      url: "https://testnet-rpc.monad.xyz",
      chainId: 10143,
      accounts: validPrivateKey ? [validPrivateKey] : [],
    },
  },
});
