import { useWalletManagement } from '@/hooks/use-wallet-management';
import { WalletGenerationSection } from './WalletGenerationSection';
import { WalletList } from './WalletList';
import { SectionSeparator } from './SectionSeparator';
import { PrivateKeyDialog } from './PrivateKeyDialog';

export function WalletGenerator() {
  const {
    // State
    wallets,
    selectedNetwork,
    isLoading,
    error,
    currentWallet,
    privateKey,
    showPrivateKey,
    isViewingPrivateKey,

    // Actions
    handleGenerateWallet,
    handleDoneViewing,
    handleRefreshBalances,
    handleNetworkChange,
    handleViewPrivateKey,
  } = useWalletManagement();

  return (
    <div className="rounded-xl border border-slate-200 p-8 shadow-sm">
      <WalletGenerationSection
        isLoading={isLoading}
        error={error}
        onGenerateWallet={handleGenerateWallet}
      />

      {wallets.length > 0 && (
        <>
          <SectionSeparator />
          <WalletList
            wallets={wallets}
            selectedNetwork={selectedNetwork}
            isLoading={isLoading}
            isViewingPrivateKey={isViewingPrivateKey}
            onNetworkChange={handleNetworkChange}
            onRefreshBalances={handleRefreshBalances}
            onViewPrivateKey={handleViewPrivateKey}
          />
        </>
      )}

      <PrivateKeyDialog
        isOpen={currentWallet && privateKey && showPrivateKey}
        onClose={() => handleDoneViewing()}
        wallet={currentWallet}
        privateKey={privateKey}
        onDone={() => {
          handleDoneViewing();
        }}
      />
    </div>
  );
}
