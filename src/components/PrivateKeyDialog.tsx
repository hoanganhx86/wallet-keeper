import { WalletInfo } from '@/types/wallet';
import { PrivateKeyDisplay } from './PrivateKeyDisplay';
import { Cross, Crosshair, CrossIcon, Delete, LucideCross, X } from 'lucide-react';

interface PrivateKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletInfo;
  privateKey: string;
  onDone: () => void;
}

export function PrivateKeyDialog({
  isOpen,
  onClose,
  wallet,
  privateKey,
  onDone,
}: PrivateKeyDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <X
          onClick={onClose}
          role="button"
          aria-label="close"
          className=" absolute top-2 right-2 h-6 w-6 text-gray-900"
        />
        <PrivateKeyDisplay wallet={wallet} privateKey={privateKey} onDone={onDone} />
      </div>
    </div>
  );
}
