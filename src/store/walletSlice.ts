import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptPrivateKey, decryptPrivateKey } from '@/lib/encryption';
import { networks } from '@/lib/networks';
import { Network } from '@/types/wallet';

export interface NetworkBalance {
  network: Network;
  balance: string;
  symbol: string;
}

export interface WalletInfo {
  id: string;
  name: string;
  address: string;
  encryptedPrivateKey: string;
  createdAt: string;
  balances: NetworkBalance[];
}

export interface DecryptedWallet {
  address: string;
  privateKey: string;
}

export interface CreateWalletParams {
  password: string;
  name?: string;
}

export interface VerifyPasswordParams {
  walletId: string;
  password: string;
}

interface WalletState {
  wallets: WalletInfo[];
  selectedNetwork: Network;
  isLoading: boolean;
  error: string | null;
}

export const createWallet = createAsyncThunk(
  'wallet/createWallet',
  async (params: CreateWalletParams, { rejectWithValue }) => {
    try {
      const wallet = ethers.Wallet.createRandom();

      const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey, params.password);

      const walletName = params.name?.trim() || `Wallet ${Date.now().toString(36)}`;

      const balances: NetworkBalance[] = [
        { network: 'ethereum', balance: '0.00000', symbol: networks.ethereum.symbol },
        { network: 'binance', balance: '0.00000', symbol: networks.binance.symbol },
      ];

      const walletInfo: WalletInfo = {
        id: uuidv4(),
        name: walletName,
        address: wallet.address,
        encryptedPrivateKey,
        createdAt: new Date().toISOString(),
        balances,
      };

      return { walletInfo, privateKey: wallet.privateKey };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getWalletBalance = createAsyncThunk(
  'wallet/getWalletBalance',
  async (params: { walletId: string; network: Network }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wallet: WalletState };
      const wallet = state.wallet.wallets.find(w => w.id === params.walletId);

      if (!wallet) {
        return rejectWithValue('Wallet not found');
      }

      const networkConfig = networks[params.network];
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

      const balanceInWei = await provider.getBalance(wallet.address);

      // Convert to ETH/BNB with only 5 decimals for display
      const balance = ethers.formatEther(balanceInWei);
      const trimmedBalance = parseFloat(balance).toFixed(5);

      const networkBalance: NetworkBalance = {
        network: params.network,
        balance: trimmedBalance,
        symbol: networkConfig.symbol,
      };

      return { walletId: params.walletId, networkBalance };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const refreshBalancesForSelectedNetwork = createAsyncThunk(
  'wallet/refreshBalancesForSelectedNetwork',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wallet: WalletState };
      const { wallets, selectedNetwork } = state.wallet;

      const networkConfig = networks[selectedNetwork];
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

      const updatedWallets = await Promise.all(
        wallets.map(async wallet => {
          try {
            const balanceInWei = await provider.getBalance(wallet.address);
            const balance = ethers.formatEther(balanceInWei);
            const trimmedBalance = parseFloat(balance).toFixed(5);

            const networkBalance: NetworkBalance = {
              network: selectedNetwork,
              balance: trimmedBalance,
              symbol: networkConfig.symbol,
            };

            return {
              ...wallet,
              balances: [networkBalance], // Replace balances with the selected network's balance
            };
          } catch (error) {
            console.error(`Error fetching balance for wallet ${wallet.id}:`, error);
            return wallet; // Return wallet unchanged on error
          }
        })
      );

      return updatedWallets;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getPrivateKey = createAsyncThunk(
  'wallet/getPrivateKey',
  async (params: VerifyPasswordParams, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wallet: WalletState };
      const wallet = state.wallet.wallets.find(w => w.id === params.walletId);

      if (!wallet) {
        return rejectWithValue('Wallet not found');
      }

      try {
        const privateKey = decryptPrivateKey(wallet.encryptedPrivateKey, params.password);

        if (!privateKey.startsWith('0x')) {
          return rejectWithValue('Invalid password');
        }

        return {
          address: wallet.address,
          privateKey,
        };
      } catch (_) {
        return rejectWithValue('Invalid password');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: WalletState = {
  wallets: [],
  selectedNetwork: 'ethereum',
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setSelectedNetwork(state, action: PayloadAction<Network>) {
      state.selectedNetwork = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Handle createWallet
    builder.addCase(createWallet.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createWallet.fulfilled, (state, action) => {
      const { walletInfo } = action.payload;
      state.wallets.push(walletInfo);
      state.isLoading = false;
    });
    builder.addCase(createWallet.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Handle getPrivateKey
    builder.addCase(getPrivateKey.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getPrivateKey.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getPrivateKey.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Handle refreshBalancesForSelectedNetwork
    builder.addCase(refreshBalancesForSelectedNetwork.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(refreshBalancesForSelectedNetwork.fulfilled, (state, action) => {
      state.wallets = action.payload;
      state.isLoading = false;
    });
    builder.addCase(refreshBalancesForSelectedNetwork.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Handle getWalletBalance
    builder.addCase(getWalletBalance.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getWalletBalance.fulfilled, (state, action) => {
      const { walletId, networkBalance } = action.payload;
      const walletIndex = state.wallets.findIndex(w => w.id === walletId);

      if (walletIndex >= 0) {
        const networkIndex = state.wallets[walletIndex].balances.findIndex(
          b => b.network === networkBalance.network
        );

        if (networkIndex >= 0) {
          state.wallets[walletIndex].balances[networkIndex] = networkBalance;
        } else {
          state.wallets[walletIndex].balances.push(networkBalance);
        }
      }

      state.isLoading = false;
    });
    builder.addCase(getWalletBalance.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

const persistConfig = {
  key: 'wallet',
  storage,
  whitelist: ['wallets', 'selectedNetwork'], // Only persist these fields
};

export const { setSelectedNetwork, clearError } = walletSlice.actions;
export default persistReducer(persistConfig, walletSlice.reducer);
