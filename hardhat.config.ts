import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "ethers";
import dotenv from "dotenv";

dotenv.config();

const {
  Web3Q_GALILEO_TEST_URL,
  Web3Q_ACCOUNT_PRIVATE_KEYS = "",
  Web3Q_GALILEO_TEST_CHAIN_ID,
  HARDHAT_LOCAL_URL,
  HARDHAT_LOCAL_ACCOUNT_PRIVATE_KEYS = "",
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // 低 "runs" 值可以进一步减少大小，通常在 200 以内。
      },
    },
  },
  networks: {
    web3qtest: {
      url: Web3Q_GALILEO_TEST_URL,
      chainId: Number(Web3Q_GALILEO_TEST_CHAIN_ID),
      accounts: Web3Q_ACCOUNT_PRIVATE_KEYS.split(","),
    },
    localhost: {
      url: HARDHAT_LOCAL_URL,
      accounts: HARDHAT_LOCAL_ACCOUNT_PRIVATE_KEYS.split(","),
    },
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
