import { useState } from 'react';
import { WalletInfo } from '@/store/walletSlice';

interface PrivateKeyDisplayProps {
  wallet: WalletInfo;
  privateKey: string;
  onDone: () => void;
}

export function PrivateKeyDisplay({ wallet, privateKey, onDone }: PrivateKeyDisplayProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  return (
    <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-green-600">
      <h3 className="text-base mt-0 text-slate-900 font-semibold mb-2">Wallet Information</h3>
      <div className="mb-2.5">
        <strong className="text-sm">Name:</strong>
        <span className="ml-2.5 text-sm">{wallet.name}</span>
      </div>
      <div className="mb-2.5">
        <strong className="text-sm">Address:</strong>
        <code className="block mt-1 p-2 bg-slate-200 rounded text-xs break-all font-mono">
          {wallet.address}
        </code>
      </div>
      <div className="mb-2.5">
        <strong className="text-sm">Private Key:</strong>
        <div className="mt-1">
          <code className="block p-2 bg-slate-200 rounded text-xs break-all font-mono">
            {showPrivateKey ? privateKey : '••••••••••••••••••••••••••••••••••••'}
          </code>
          <button
            id="toggle-private-key"
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="mt-2 text-blue-600 text-sm underline cursor-pointer"
          >
            {showPrivateKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="bg-red-100 rounded p-2.5 mb-4 text-xs text-red-800">
        <strong>IMPORTANT:</strong> Save your private key in a secure location. Anyone with access
        to your private key can access your funds.
      </div>
      <button
        onClick={onDone}
        className="bg-green-800 text-white px-4 py-2 border-none rounded text-sm cursor-pointer"
      >
        Done
      </button>
    </div>
  );
}
