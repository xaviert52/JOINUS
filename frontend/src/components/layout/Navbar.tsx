'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-red-900/30 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-red-600 rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.6)] flex items-center justify-center font-bold text-black">
          JNS
        </div>
        <span className="font-bold tracking-widest uppercase text-gray-200">
          Ecosistema
        </span>
      </div>
      
      {/* Zona Web3 - Billeteras Anónimas (RainbowKit) */}
      <div className="flex items-center space-x-4">
        <ConnectButton 
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </nav>
  );
}
