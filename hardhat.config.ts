import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";

dotenv.config();

const {
  Web3Q_GALILEO_TEST_URL, Web3Q_ACCOUNT_PRIVATE_KEYS = "",
  HARDHAT_LOCAL_URL, HARDHAT_LOCAL_ACCOUNT_PRIVATE_KEYS = ""
} = process.env

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    web3qtest: {
      url: Web3Q_GALILEO_TEST_URL,
      accounts: Web3Q_ACCOUNT_PRIVATE_KEYS.split(",")
    },
    localhost: {
      url: HARDHAT_LOCAL_URL,
      accounts: HARDHAT_LOCAL_ACCOUNT_PRIVATE_KEYS.split(",")
    },
    
  },
  sourcify: {
    enabled: true
  }
};

export default config;
