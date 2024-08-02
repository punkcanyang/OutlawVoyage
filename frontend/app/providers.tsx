"use client"

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { http, WagmiProvider } from 'wagmi';
import { mainnet, hardhat } from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const w3q = Object.freeze({
  id: 3334,
  name: 'Web3Q Galileo',
  nativeCurrency: {
    decimals: 18,
    name: 'W3Q',
    symbol: 'W3Q',
  },
  rpcUrls: {
    default: { http: ['https://galileo.web3q.io:8545'] },
  },
})

const config = getDefaultConfig({
  appName: "Web3 App",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
  chains: [w3q, hardhat],
  transports: {
    [w3q.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545/"),
  },
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
