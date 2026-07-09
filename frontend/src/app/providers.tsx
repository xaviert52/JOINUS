'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  rabbyWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { arbitrum, arbitrumSepolia, hardhat } from 'wagmi/chains';
import { WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

// Configuración exclusiva de carteras criptográficas (Sin Oauth/Social log-in por privacidad)
const config = getDefaultConfig({
  appName: 'JNS Ecosistema',
  projectId: 'YOUR_PROJECT_ID',
  chains: [hardhat, arbitrumSepolia, arbitrum],
  transports: {
    [hardhat.id]: http(),
    [arbitrumSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
  wallets: [
    {
      groupName: 'Institutional Cryptography',
      wallets: [metaMaskWallet, rabbyWallet, walletConnectWallet, coinbaseWallet, injectedWallet],
    },
  ],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          locale="en-US"
          theme={darkTheme({
            accentColor: '#dc2626', // red-600
            accentColorForeground: 'white',
            borderRadius: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
