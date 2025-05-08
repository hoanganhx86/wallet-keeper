import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletList } from '../WalletList';
import type { WalletInfo } from '@/store/walletSlice';
import { Network } from '@/types/wallet';

describe('WalletList', () => {
  const testData = {
    wallets: [
      {
        id: '1',
        name: 'Test Wallet 1',
        address: '0x123',
        encryptedPrivateKey: 'encrypted123',
        createdAt: new Date().toISOString(),
        balances: [
          { network: 'ethereum', balance: '1.0', symbol: 'ETH' },
          { network: 'binance', balance: '2.0', symbol: 'BNB' },
        ],
      },
      {
        id: '2',
        name: 'Test Wallet 2',
        address: '0x456',
        encryptedPrivateKey: 'encrypted456',
        createdAt: new Date().toISOString(),
        balances: [
          { network: 'ethereum', balance: '3.0', symbol: 'ETH' },
          { network: 'binance', balance: '4.0', symbol: 'BNB' },
        ],
      },
    ] as WalletInfo[],
    networks: {
      ethereum: 'ethereum' as Network,
      binance: 'binance' as Network,
    },
    buttonLabels: {
      refresh: /refresh balances/i,
      refreshing: /refreshing/i,
      viewPrivateKey: /view private key/i,
    },
    balanceText: /Balance:/,
  } as const;

  const renderWalletList = (props = {}) => {
    const defaultProps = {
      wallets: testData.wallets,
      selectedNetwork: testData.networks.ethereum,
      isLoading: false,
      isViewingPrivateKey: false,
      onNetworkChange: vi.fn(),
      onRefreshBalances: vi.fn(),
      onViewPrivateKey: vi.fn(),
      ...props,
    };
    return {
      ...render(<WalletList {...defaultProps} />),
      defaultProps,
    };
  };

  const getWalletBalances = () => screen.getAllByText(testData.balanceText);

  it('renders wallet list with correct number of wallets', () => {
    renderWalletList();

    const walletCards = screen.getAllByRole('listitem');
    expect(walletCards).toHaveLength(testData.wallets.length);
  });

  it('displays correct balance for selected network', () => {
    renderWalletList();

    const balances = getWalletBalances();
    expect(balances[0]).toHaveTextContent('Balance: 1.0 ETH');
    expect(balances[1]).toHaveTextContent('Balance: 3.0 ETH');
  });

  it('updates balance display when network changes', () => {
    const { rerender, defaultProps } = renderWalletList();

    let balances = getWalletBalances();
    expect(balances[0]).toHaveTextContent('Balance: 1.0 ETH');

    rerender(<WalletList {...defaultProps} selectedNetwork={testData.networks.binance} />);
    balances = getWalletBalances();
    expect(balances[0]).toHaveTextContent('Balance: 2.0 BNB');
  });

  it('calls onNetworkChange when network selector changes', () => {
    const { defaultProps } = renderWalletList();

    const networkSelector = screen.getByRole('combobox');
    fireEvent.change(networkSelector, { target: { value: testData.networks.binance } });

    expect(defaultProps.onNetworkChange).toHaveBeenCalledWith(testData.networks.binance);
  });

  it('calls onRefreshBalances when refresh button is clicked', () => {
    const { defaultProps } = renderWalletList();

    const refreshButton = screen.getByRole('button', { name: testData.buttonLabels.refresh });
    fireEvent.click(refreshButton);

    expect(defaultProps.onRefreshBalances).toHaveBeenCalled();
  });

  it('disables refresh button when loading', () => {
    renderWalletList({ isLoading: true });

    const refreshButton = screen.getByRole('button', { name: testData.buttonLabels.refreshing });
    expect(refreshButton).toBeDisabled();
  });

  it('calls onViewPrivateKey when view private key button is clicked', () => {
    const { defaultProps } = renderWalletList();

    const viewPrivateKeyButtons = screen.getAllByRole('button', {
      name: testData.buttonLabels.viewPrivateKey,
    });
    fireEvent.click(viewPrivateKeyButtons[0]);

    expect(defaultProps.onViewPrivateKey).toHaveBeenCalledWith(testData.wallets[0].id);
  });
});
