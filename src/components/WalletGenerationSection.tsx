import { WalletForm } from './WalletForm';

interface WalletGenerationSectionProps {
  isLoading: boolean;
  error: string | null;
  onGenerateWallet: (data: { password: string; name: string }) => void;
}

export function WalletGenerationSection({
  isLoading,
  error,
  onGenerateWallet,
}: WalletGenerationSectionProps) {

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-800 mb-6">Generate New Wallet</h2>
      <WalletForm onSubmit={onGenerateWallet} isLoading={isLoading} error={error} />
    </div>
  );
}
