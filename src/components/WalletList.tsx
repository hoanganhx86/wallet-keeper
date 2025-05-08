import { WalletInfo } from '@/store/walletSlice';
import { NetworkSelector } from './NetworkSelector';
import { WalletCard } from './WalletCard';
import { Network } from '@/types/wallet';
import React from 'react';

interface WalletListProps {
  wallets: WalletInfo[];
  selectedNetwork: Network;
  isLoading: boolean;
  isViewingPrivateKey: boolean;
  onNetworkChange: (network: Network) => void;
  onRefreshBalances: () => void;
  onViewPrivateKey: (walletId: string) => void;
}

export function WalletList({
  wallets,
  selectedNetwork,
  isLoading,
  isViewingPrivateKey,
  onNetworkChange,
  onRefreshBalances,
  onViewPrivateKey,
}: WalletListProps) {
  const isLoadignRef = React.useRef(false);

  const getBalanceDisplay = (wallet: WalletInfo) => {
    if (!wallet.balances) return 'Balance: Loading...';

    const networkBalance = wallet.balances.find(b => b.network === selectedNetwork);
    if (!networkBalance) return 'Balance: Not available';

    return `Balance: ${networkBalance.balance} ${networkBalance.symbol}`;
  };

  React.useEffect(() => {
    if (isLoadignRef.current) return;
    isLoadignRef.current = true;
    (async () => {
      onRefreshBalances();
      isLoadignRef.current = false;
    })();
  }, [selectedNetwork]);

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 gap-4">
        <h3 className="text-lg font-bold text-slate-900 m-0">Your Wallets</h3>
        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
          <div>
            <label className="block mb-1 text-xs text-slate-600">Select Network</label>
            <NetworkSelector selectedNetwork={selectedNetwork} onChange={onNetworkChange} />
          </div>
          <button
            onClick={onRefreshBalances}
            disabled={isLoading}
            className="bg-white border border-slate-300 rounded px-4 py-2 text-sm font-medium cursor-pointer disabled:opacity-70 disabled:cursor-wait"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Balances'}
          </button>
        </div>
      </div>
      <div className="mt-2.5">
        {wallets.map(wallet => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            balance={getBalanceDisplay(wallet)}
            onViewPrivateKey={() => onViewPrivateKey(wallet.id)}
            isViewingPrivateKey={isViewingPrivateKey}
          />
        ))}
      </div>
    </div>
  );
}
