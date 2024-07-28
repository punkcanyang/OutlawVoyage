import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";

dotenv.config();

const {  ETH_SEPOILA_URL, PRIVATE_EKY = "", ETHERSCAN_PAIKEY } = process.env

const config: HardhatUserConfig = {
  solidity: "0.8.6",
  networks: {
    sepolia: {
      url: ETH_SEPOILA_URL,
      // accounts: [PRIVATE_EKY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_PAIKEY
  },
  sourcify: {
    enabled: true
  }
};

export default config;
