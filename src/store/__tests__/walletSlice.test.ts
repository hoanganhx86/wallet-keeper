import { describe, it, expect } from 'vitest';
import walletReducer, {
  createWallet,
  getWalletBalance,
  setSelectedNetwork,
  clearError,
  refreshBalancesForSelectedNetwork,
  getPrivateKey,
} from '../walletSlice';
import { Network } from '@/types/wallet';

interface WalletState {
  wallets: Array<{
    id: string;
    name: string;
    address: string;
    encryptedPrivateKey: string;
    createdAt: string;
    balances: Array<{
      network: Network;
      balance: string;
      symbol: string;
    }>;
  }>;
  selectedNetwork: Network;
  isLoading: boolean;
  error: string | null;
  _persist: {
    version: number;
    rehydrated: boolean;
  };
}

const testData = {
  networks: {
    ethereum: 'ethereum' as Network,
    binance: 'binance' as Network,
  },
  wallet: {
    id: '1',
    name: 'Test Wallet',
    address: '0x123',
    encryptedPrivateKey: 'encrypted123',
    createdAt: new Date().toISOString(),
    balances: [
      { network: 'ethereum' as Network, balance: '0.00000', symbol: 'ETH' },
      { network: 'binance' as Network, balance: '0.00000', symbol: 'BNB' },
    ],
  },
  updatedBalances: {
    ethereum: { network: 'ethereum' as Network, balance: '1.50000', symbol: 'ETH' },
    binance: { network: 'binance' as Network, balance: '2.50000', symbol: 'BNB' },
  },
  errorMessages: {
    createWallet: 'Failed to create wallet',
    getBalance: 'Failed to get balance',
    refreshBalances: 'Failed to refresh balances',
  },
  persist: {
    version: 1,
    rehydrated: true,
  },
};

const createInitialState = (): WalletState => ({
  wallets: [],
  selectedNetwork: testData.networks.ethereum,
  isLoading: false,
  error: null,
  _persist: testData.persist,
});

const createStateWithWallet = (): WalletState => ({
  ...createInitialState(),
  wallets: [testData.wallet],
});

describe('walletSlice', () => {
  describe('reducers', () => {
    it('should handle setSelectedNetwork', () => {
      const initialState = createInitialState();
      const nextState = walletReducer(initialState, setSelectedNetwork(testData.networks.binance));
      expect(nextState.selectedNetwork).toBe(testData.networks.binance);
    });

    it('should handle clearError', () => {
      const stateWithError = {
        ...createInitialState(),
        error: testData.errorMessages.createWallet,
      };
      const nextState = walletReducer(stateWithError, clearError());
      expect(nextState.error).toBeNull();
    });
  });

  describe('async thunks', () => {
    it('should handle createWallet.fulfilled', () => {
      const initialState = createInitialState();
      const action = createWallet.fulfilled(
        { walletInfo: testData.wallet, privateKey: '0xabc' },
        'requestId',
        {
          password: 'test123',
          name: testData.wallet.name,
        }
      );

      const nextState = walletReducer(initialState, action);
      expect(nextState.wallets).toHaveLength(1);
      expect(nextState.wallets[0]).toEqual(testData.wallet);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('should handle getWalletBalance.fulfilled', () => {
      const state = createStateWithWallet();
      const action = getWalletBalance.fulfilled(
        { walletId: testData.wallet.id, networkBalance: testData.updatedBalances.ethereum },
        'requestId',
        {
          walletId: testData.wallet.id,
          network: testData.networks.ethereum,
        }
      );

      const nextState = walletReducer(state, action);
      expect(nextState.wallets[0].balances[0]).toEqual(testData.updatedBalances.ethereum);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('should handle createWallet.pending', () => {
      const initialState = createInitialState();
      const action = createWallet.pending('requestId', {
        password: 'test123',
        name: testData.wallet.name,
      });

      const nextState = walletReducer(initialState, action);
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('should handle createWallet.rejected', () => {
      const initialState = createInitialState();
      const action = createWallet.rejected(
        new Error(testData.errorMessages.createWallet),
        'requestId',
        {
          password: 'test123',
          name: testData.wallet.name,
        },
        testData.errorMessages.createWallet
      );

      const nextState = walletReducer(initialState, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(testData.errorMessages.createWallet);
    });

    it('should handle getWalletBalance.pending', () => {
      const initialState = createInitialState();
      const action = getWalletBalance.pending('requestId', {
        walletId: testData.wallet.id,
        network: testData.networks.ethereum,
      });

      const nextState = walletReducer(initialState, action);
      expect(nextState.isLoading).toBe(true);
    });

    it('should handle getWalletBalance.rejected', () => {
      const initialState = createInitialState();
      const action = getWalletBalance.rejected(
        new Error(testData.errorMessages.getBalance),
        'requestId',
        {
          walletId: testData.wallet.id,
          network: testData.networks.ethereum,
        },
        testData.errorMessages.getBalance
      );

      const nextState = walletReducer(initialState, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(testData.errorMessages.getBalance);
    });

    it('should handle refreshBalancesForSelectedNetwork.fulfilled', () => {
      const state = createStateWithWallet();
      const updatedWallets = [{
        ...testData.wallet,
        balances: [
          testData.updatedBalances.ethereum,
          testData.updatedBalances.binance,
        ],
      }];

      const action = refreshBalancesForSelectedNetwork.fulfilled(updatedWallets, 'requestId', undefined);

      const nextState = walletReducer(state, action);
      expect(nextState.wallets).toEqual(updatedWallets);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('should handle refreshBalancesForSelectedNetwork.rejected', () => {
      const initialState = createInitialState();
      const action = refreshBalancesForSelectedNetwork.rejected(
        new Error(testData.errorMessages.refreshBalances),
        'requestId',
        undefined,
        testData.errorMessages.refreshBalances
      );

      const nextState = walletReducer(initialState, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(testData.errorMessages.refreshBalances);
    });

    it('should handle getPrivateKey.fulfilled', () => {
      const state = createStateWithWallet();
      const action = getPrivateKey.fulfilled(
        { address: testData.wallet.address, privateKey: '0xabc' },
        'requestId',
        {
          walletId: testData.wallet.id,
          password: 'test123',
        }
      );

      const nextState = walletReducer(state, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('should handle getPrivateKey.rejected', () => {
      const state = createStateWithWallet();
      const action = getPrivateKey.rejected(
        new Error('Invalid password'),
        'requestId',
        {
          walletId: testData.wallet.id,
          password: 'wrong123',
        },
        'Invalid password'
      );

      const nextState = walletReducer(state, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe('Invalid password');
    });
  });
});
