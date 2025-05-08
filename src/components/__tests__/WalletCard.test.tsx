import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletCard } from '../WalletCard';
import { WalletInfo } from '@/store/walletSlice';

describe('WalletCard', () => {
  const mockWallet: WalletInfo = {
    id: 'test-id',
    name: 'Test Wallet',
    address: '0x1234567890abcdef',
    encryptedPrivateKey: 'encrypted-key',
    createdAt: '2024-03-20T00:00:00.000Z',
    balances: [
      { network: 'ethereum', balance: '1.5', symbol: 'ETH' },
      { network: 'binance', balance: '0', symbol: 'BNB' },
    ],
  };

  const defaultProps = {
    wallet: mockWallet,
    balance: '1.5 ETH',
    onViewPrivateKey: vi.fn(),
    isViewingPrivateKey: false,
  };

  it('renders wallet information correctly', () => {
    render(<WalletCard {...defaultProps} />);

    expect(screen.getByText('Test Wallet')).toBeInTheDocument();
    expect(screen.getByText('0x1234567890abcdef')).toBeInTheDocument();
    expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it('calls onViewPrivateKey when View Private Key button is clicked', () => {
    render(<WalletCard {...defaultProps} />);

    const viewPrivateKeyButton = screen.getByText('View Private Key');
    fireEvent.click(viewPrivateKeyButton);

    expect(defaultProps.onViewPrivateKey).toHaveBeenCalledTimes(1);
  });

  it('disables View Private Key button when isViewingPrivateKey is true', () => {
    render(<WalletCard {...defaultProps} isViewingPrivateKey={true} />);

    const viewPrivateKeyButton = screen.getByText('View Private Key');
    expect(viewPrivateKeyButton).toBeDisabled();
  });

  it('copies address to clipboard when Copy Address button is clicked', () => {
    const mockClipboard = {
      writeText: vi.fn(),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    const mockAlert = vi.spyOn(window, 'alert');

    render(<WalletCard {...defaultProps} />);

    const copyAddressButton = screen.getByText('Copy Address');
    fireEvent.click(copyAddressButton);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(mockWallet.address);
    expect(mockAlert).toHaveBeenCalledWith('Address copied to clipboard!');
  });
});
