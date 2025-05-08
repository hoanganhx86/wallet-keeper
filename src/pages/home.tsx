import { WalletGenerator } from '@/components/WalletGenerator';
import { Wallet } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6">
        <div className="container max-w-6xl mx-auto px-4">
          {/* <div className="flex items-center justify-between"> */}
          <div className="flex items-center space-x-2">
            <Wallet role="img" aria-label="wallet" className="h-6 w-6 text-blue-400" />
            <h1 className="text-2xl font-bold">Wallet Keeper</h1>
          </div>
          {/* </div> */}
        </div>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-4 pb-8">
        <WalletGenerator />
      </main>

      <footer className="w-full bg-slate-200 py-4 items-center text-center text-sm">
        <p>Wallet Keeper - Secure EVM Wallet Management</p>
      </footer>
    </div>
  );
}
