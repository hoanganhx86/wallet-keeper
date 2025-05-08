import { WalletInfo } from '@/store/walletSlice';

interface WalletCardProps {
  wallet: WalletInfo;
  balance: string;
  onViewPrivateKey: () => void;
  isViewingPrivateKey: boolean;
}

export function WalletCard({
  wallet,
  balance,
  onViewPrivateKey,
  isViewingPrivateKey,
}: WalletCardProps) {
  return (
    <div role="listitem" className="p-4 bg-slate-50 rounded-lg mb-4 border border-slate-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
        <h4 className="m-0 text-base font-semibold">{wallet.name}</h4>
        <span className="text-xs text-slate-500 md:text-right">
          Created: {new Date(wallet.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="text-xs font-mono bg-slate-100 p-2 rounded overflow-x-auto mb-2.5">
        {wallet.address}
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="text-sm font-medium text-slate-600">{balance}</div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => {
              navigator.clipboard.writeText(wallet.address);
              alert('Address copied to clipboard!');
            }}
            className="bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            Copy Address
          </button>
          <button
            onClick={onViewPrivateKey}
            disabled={isViewingPrivateKey}
            className="bg-blue-800 text-white border-none rounded px-3 py-1.5 text-xs font-medium cursor-pointer disabled:opacity-70 disabled:cursor-wait"
          >
            View Private Key
          </button>
        </div>
      </div>
    </div>
  );
}
