import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWalletManagement } from '../use-wallet-management';
import { useAppDispatch, useAppSelector } from '../use-redux';
import { createWallet, setSelectedNetwork, getPrivateKey } from '@/store/walletSlice';
import type { WalletInfo, DecryptedWallet } from '@/store/walletSlice';
import { Network } from '@/types/wallet';

vi.mock('../use-redux', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

const mockPrompt = vi.fn();
Object.defineProperty(window, 'prompt', {
  value: mockPrompt,
  writable: true,
});

const mockAlert = vi.fn();
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true,
});

describe('useWalletManagement', () => {
  const mockDispatch = vi.fn();
  const mockWallets: WalletInfo[] = [
    {
      id: '1',
      name: 'Test Wallet',
      address: '0x123',
      encryptedPrivateKey: 'encrypted123',
      createdAt: new Date().toISOString(),
      balances: [
        { network: 'ethereum', balance: '1.0', symbol: 'ETH' },
        { network: 'binance', balance: '0.0', symbol: 'BNB' },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (useAppSelector as Mock).mockReturnValue({
      wallets: mockWallets,
      selectedNetwork: 'ethereum' as Network,
      isLoading: false,
      error: null,
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useWalletManagement());

    expect(result.current.wallets).toEqual(mockWallets);
    expect(result.current.selectedNetwork).toBe('ethereum');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.currentWallet).toBeNull();
    expect(result.current.privateKey).toBeNull();
    expect(result.current.showPrivateKey).toBe(false);
    expect(result.current.isViewingPrivateKey).toBe(false);
  });

  describe('handleGenerateWallet', () => {
    it('should reject password less than 8 characters', async () => {
      const { result } = renderHook(() => useWalletManagement());

      await act(async () => {
        await result.current.handleGenerateWallet({ password: 'short', name: 'Test' });
      });

      expect(result.current.error).toBe('Password must be at least 8 characters long');
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should create wallet with valid password', async () => {
      const mockWalletInfo: WalletInfo = {
        id: '2',
        name: 'New Wallet',
        address: '0x456',
        encryptedPrivateKey: 'encrypted456',
        createdAt: new Date().toISOString(),
        balances: [
          { network: 'ethereum', balance: '0.0', symbol: 'ETH' },
          { network: 'binance', balance: '0.0', symbol: 'BNB' },
        ],
      };

      mockDispatch.mockResolvedValueOnce({
        type: createWallet.fulfilled.type,
        payload: {
          walletInfo: mockWalletInfo,
          privateKey: '0xabc',
        },
      });

      const { result } = renderHook(() => useWalletManagement());

      await act(async () => {
        await result.current.handleGenerateWallet({
          password: 'validpassword',
          name: 'New Wallet',
        });
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(result.current.currentWallet).toEqual(mockWalletInfo);
      expect(result.current.privateKey).toBe('0xabc');
      expect(result.current.showPrivateKey).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should auto-hide private key after 30 seconds', async () => {
      const mockWalletInfo: WalletInfo = {
        id: '2',
        name: 'New Wallet',
        address: '0x456',
        encryptedPrivateKey: 'encrypted456',
        createdAt: new Date().toISOString(),
        balances: [
          { network: 'ethereum', balance: '0.0', symbol: 'ETH' },
          { network: 'binance', balance: '0.0', symbol: 'BNB' },
        ],
      };

      mockDispatch.mockResolvedValueOnce({
        type: createWallet.fulfilled.type,
        payload: {
          walletInfo: mockWalletInfo,
          privateKey: '0xabc',
        },
      });

      const { result } = renderHook(() => useWalletManagement());

      await act(async () => {
        await result.current.handleGenerateWallet({
          password: 'validpassword',
          name: 'New Wallet',
        });
      });

      expect(result.current.showPrivateKey).toBe(true);

      // Fast-forward 30 seconds
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      expect(result.current.showPrivateKey).toBe(false);
      expect(result.current.privateKey).toBeNull();
    });
  });

  describe('handleDoneViewing', () => {
    it('should clear private key and current wallet', () => {
      const { result } = renderHook(() => useWalletManagement());

      act(() => {
        result.current.handleDoneViewing();
      });

      expect(result.current.showPrivateKey).toBe(false);
      expect(result.current.privateKey).toBeNull();
      expect(result.current.currentWallet).toBeNull();
    });
  });

  describe('handleRefreshBalances', () => {
    it('should dispatch refreshAllBalances action', () => {
      const { result } = renderHook(() => useWalletManagement());

      act(() => {
        result.current.handleRefreshBalances();
      });
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('handleNetworkChange', () => {
    it('should dispatch setSelectedNetwork action', () => {
      const { result } = renderHook(() => useWalletManagement());

      act(() => {
        result.current.handleNetworkChange('binance');
      });

      expect(mockDispatch).toHaveBeenCalledWith(setSelectedNetwork('binance'));
    });
  });

  describe('handleViewPrivateKey', () => {
    it('should handle cancelled password prompt', async () => {
      mockPrompt.mockReturnValueOnce(null);

      const { result } = renderHook(() => useWalletManagement());

      await act(async () => {
        await result.current.handleViewPrivateKey('1');
      });

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(result.current.isViewingPrivateKey).toBe(false);
    });

    it('should handle successful private key viewing', async () => {
      mockPrompt.mockReturnValueOnce('validpassword');

      const mockDecryptedWallet: DecryptedWallet = {
        address: '0x123',
        privateKey: '0xabc',
      };

      mockDispatch.mockResolvedValueOnce({
        type: getPrivateKey.fulfilled.type,
        payload: mockDecryptedWallet,
      });

      const { result } = renderHook(() => useWalletManagement());

      await act(async () => {
        await result.current.handleViewPrivateKey('1');
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(result.current.currentWallet).toEqual(mockWallets[0]);
      expect(result.current.privateKey).toBe('0xabc');
      expect(result.current.showPrivateKey).toBe(true);
      expect(result.current.isViewingPrivateKey).toBe(false);
    });

    it('should handle invalid password', async () => {
      mockPrompt.mockReturnValueOnce('wrongpassword');

      mockDispatch.mockResolvedValueOnce({
        type: getPrivateKey.rejected.type,
        payload: 'Invalid password',
      });

      const { result } = renderHook(() => useWalletManagement());

      await act(async () => {
        await result.current.handleViewPrivateKey('1');
      });

      expect(mockAlert).toHaveBeenCalledWith('Invalid password. Please try again.');
      expect(result.current.isViewingPrivateKey).toBe(false);
    });

    it('should handle errors', async () => {
      mockPrompt.mockReturnValueOnce('validpassword');

      mockDispatch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useWalletManagement());

      await act(async () => {
        await result.current.handleViewPrivateKey('1');
      });

      expect(mockAlert).toHaveBeenCalledWith('Something went wrong. Please try again.');
      expect(result.current.isViewingPrivateKey).toBe(false);
    });
  });
});
