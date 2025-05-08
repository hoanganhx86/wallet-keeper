import { ethers } from 'ethers';
import { Network, NetworkBalance } from '@/types/wallet';

export interface NetworkConfig {
  name: string;
  value: string;
  rpcUrl: string;
  explorerUrl: string;
  symbol: string;
  decimals: number;
}

export const networks: Record<Network, NetworkConfig> = {
  ethereum: {
    name: 'Ethereum Testnet (Sepolia)',
    value: 'ethereum',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    explorerUrl: 'https://sepolia.etherscan.io',
    symbol: 'ETH',
    decimals: 18,
  },
  binance: {
    name: 'BNB Chain Testnet',
    value: 'binance',
    rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
    explorerUrl: 'https://testnet.bscscan.com',
    symbol: 'BNB',
    decimals: 18,
  },
};

// Get balance for an address on a specific network
// export async function getAddressBalance(
//   address: string,
//   network: Network
// ): Promise<NetworkBalance> {
//   try {
//     const networkConfig = networks[network];
//     const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

//     const balance = await provider.getBalance(address);
//     const formattedBalance = ethers.formatEther(balance);

//     return {
//       network,
//       balance: formattedBalance,
//       symbol: networkConfig.symbol,
//     };
//   } catch (error) {
//     console.error(`Error fetching balance for ${network}:`, error);
//     // Return zero balance on error
//     return {
//       network,
//       balance: '0',
//       symbol: networks[network].symbol,
//     };
//   }
// }

// // Get balances for an address on all networks
// export async function getAllBalances(address: string): Promise<NetworkBalance[]> {
//   try {
//     const networkPromises = Object.keys(networks).map(async networkKey => {
//       const network = networkKey as Network;
//       return await getAddressBalance(address, network);
//     });

//     return await Promise.all(networkPromises);
//   } catch (error) {
//     console.error('Error fetching all balances:', error);
//     // Return empty balances on error
//     return Object.keys(networks).map(networkKey => ({
//       network: networkKey as Network,
//       balance: '0',
//       symbol: networks[networkKey as Network].symbol,
//     }));
//   }
// }

// export function getNetworkName(network: Network): string {
//   return networks[network].name;
// }

// export function getNetworkOptions() {
//   return Object.entries(networks).map(([key, network]) => ({
//     value: key,
//     label: network.name,
//   }));
// }
