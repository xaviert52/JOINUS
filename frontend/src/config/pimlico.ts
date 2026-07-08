import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

// Pimlico API KEY configuration
export const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || 'pimlico_placeholder_key';

// URLs provided by Pimlico
export const pimlicoPaymasterUrl = `https://api.pimlico.io/v2/arbitrum-sepolia/rpc?apikey=${PIMLICO_API_KEY}`;
export const pimlicoBundlerUrl = `https://api.pimlico.io/v1/arbitrum-sepolia/rpc?apikey=${PIMLICO_API_KEY}`;

// Paymaster Client to sponsor gas fees (ERC-4337)
export const paymasterClient = createPimlicoPaymasterClient({
  transport: http(pimlicoPaymasterUrl),
  entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', // Standard EntryPoint v0.6
});

// Note: SmartAccountClient is instantiated dynamically per user session 
// within a React context/hook (e.g. using Safe, SimpleAccount, or Biconomy)
// once the user connects their EOA signer.
