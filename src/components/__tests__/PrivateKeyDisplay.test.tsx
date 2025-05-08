import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrivateKeyDisplay } from '../PrivateKeyDisplay';
import { WalletInfo } from '@/store/walletSlice';

const testData = {
  wallet: {
    id: 'test-id',
    name: 'Test Wallet',
    address: '0x1234567890abcdef',
    encryptedPrivateKey: 'encrypted-key',
    createdAt: '2024-03-20T00:00:00.000Z',
    balances: [
      { network: 'ethereum', balance: '1.5', symbol: 'ETH' },
      { network: 'binance', balance: '0', symbol: 'BNB' },
    ],
  } as WalletInfo,
  privateKey: '0xabcdef1234567890',
  maskedPrivateKey: '••••••••••••••••••••••••••••••••••••',
  onDone: vi.fn(),
};

describe('PrivateKeyDisplay', () => {
  const defaultProps = {
    wallet: testData.wallet,
    privateKey: testData.privateKey,
    onDone: testData.onDone,
  };

  it('renders wallet information correctly', () => {
    render(<PrivateKeyDisplay {...defaultProps} />);

    expect(screen.getByText('Wallet Information')).toBeInTheDocument();
    expect(screen.getByText(testData.wallet.name)).toBeInTheDocument();
    expect(screen.getByText(testData.wallet.address)).toBeInTheDocument();
    expect(screen.getByText(testData.maskedPrivateKey)).toBeInTheDocument();
  });

  it('shows security warning message', () => {
    render(<PrivateKeyDisplay {...defaultProps} />);

    expect(screen.getByText(/Private Key:/)).toBeInTheDocument();
    expect(screen.getByText(/Save your private key in a secure location/)).toBeInTheDocument();
  });

  it('toggles private key visibility when Show/Hide button is clicked', () => {
    render(<PrivateKeyDisplay {...defaultProps} />);

    const toggleButton = screen.getByText('Show');
    expect(screen.getByText(testData.maskedPrivateKey)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(testData.privateKey)).toBeInTheDocument();
    expect(screen.getByText('Hide')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide'));
    expect(screen.getByText(testData.maskedPrivateKey)).toBeInTheDocument();
    expect(screen.getByText('Show')).toBeInTheDocument();
  });

  it('calls onDone when Done button is clicked', () => {
    render(<PrivateKeyDisplay {...defaultProps} />);

    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);

    expect(testData.onDone).toHaveBeenCalledTimes(1);
  });
});
