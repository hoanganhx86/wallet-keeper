import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import {
  createWallet,
  refreshBalancesForSelectedNetwork,
  setSelectedNetwork,
  getPrivateKey,
  type WalletInfo,
  type DecryptedWallet,
} from '@/store/walletSlice';
import { Network } from '@/types/wallet';

export function useWalletManagement() {
  const dispatch = useAppDispatch();
  const {
    wallets,
    selectedNetwork,
    isLoading,
    error: apiError,
  } = useAppSelector(state => state.wallet);

  const [currentWallet, setCurrentWallet] = useState<WalletInfo | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isViewingPrivateKey, setIsViewingPrivateKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateWallet = React.useCallback(async ({ password, name }: { password: string; name: string }) => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const resultAction = await dispatch(createWallet({ password, name }));

    if (createWallet.fulfilled.match(resultAction)) {
      const { walletInfo, privateKey } = resultAction.payload;
      setCurrentWallet(walletInfo);
      setPrivateKey(privateKey);
      setShowPrivateKey(true);
      setError(null);

      // Auto-hide private key after 30 seconds for security
      setTimeout(() => {
        setShowPrivateKey(false);
        setPrivateKey(null);
      }, 30000);
    }
  }, [dispatch]);

  const handleDoneViewing = () => {
    setShowPrivateKey(false);
    setPrivateKey(null);
    setCurrentWallet(null);
  };

  const handleRefreshBalances = React.useCallback(() => {
    dispatch(refreshBalancesForSelectedNetwork());
  }, []);

  const handleNetworkChange = React.useCallback((network: Network) => {
    dispatch(setSelectedNetwork(network));
  }, []);

  const handleViewPrivateKey = React.useCallback(async (walletId: string) => {
    try {
      setIsViewingPrivateKey(true);

      const passwordInput = prompt('Enter your wallet password to view the private key:');
      if (!passwordInput) {
        setIsViewingPrivateKey(false);
        return;
      }

      const resultAction = await dispatch(
        getPrivateKey({
          walletId,
          password: passwordInput,
        })
      );

      if (getPrivateKey.fulfilled.match(resultAction)) {
        const decryptedWallet = resultAction.payload as DecryptedWallet;

        const wallet = wallets.find(w => w.id === walletId);
        if (wallet) {
          setCurrentWallet(wallet);
          setPrivateKey(decryptedWallet.privateKey);
          setShowPrivateKey(true);

          // Auto-hide after 30 seconds for security
          setTimeout(() => {
            setShowPrivateKey(false);
            setPrivateKey(null);
            setCurrentWallet(null);
          }, 30000);
        }
      } else {
        alert('Invalid password. Please try again.');
      }
    } catch (err) {
      console.error('Error viewing private key:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsViewingPrivateKey(false);
    }
  }, [dispatch, wallets]);

  return {
    // State
    wallets,
    selectedNetwork,
    isLoading,
    error: error || apiError,
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
  };
}
