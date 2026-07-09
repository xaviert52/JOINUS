'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { hardhat } from 'wagmi/chains';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet, metaMaskWallet, walletConnectWallet, coinbaseWallet],
    },
  ],
  {
    appName: 'JNS Ecosistema',
    projectId: 'YOUR_PROJECT_ID',
  }
);

// En el despliegue de Producción Final (Fase de Mainnet), el array de cadenas aceptadas contendrá única y exclusivamente a [arbitrum]. Todo usuario en otra red sufrirá un rechazo estricto (Wrong Network).
const config = createConfig({
  connectors,
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
  },
  multiInjectedProviderDiscovery: true, // Habilitar EIP-6963 explícitamente para solucionar problemas en Brave
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="[&_button]:!font-normal [&_button]:!font-mono">
          <RainbowKitProvider 
            locale="en-US"
            theme={darkTheme({
              accentColor: '#dc2626', // red-600
              accentColorForeground: 'white',
              borderRadius: 'small',
              fontStack: 'system',
            })}
          >
            {children}
          </RainbowKitProvider>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
