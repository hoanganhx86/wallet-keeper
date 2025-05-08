export interface NetworkBalance {
  network: 'ethereum' | 'binance';
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

export interface CreateWalletParams {
  password: string;
  name?: string;
}

export interface DecryptedWallet {
  address: string;
  privateKey: string;
}

export type Network = 'ethereum' | 'binance';

export interface VerifyPasswordParams {
  walletId: string;
  password: string;
}
