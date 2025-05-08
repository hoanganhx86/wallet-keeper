import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrivateKeyDisplay } from '../PrivateKeyDisplay';
import { WalletInfo } from '@/store/walletSlice';
import { PrivateKeyDialog } from '../PrivateKeyDialog';

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
  onDone: vi.fn(),
};
const mockPrivateKey = 'test-private-key';

describe('PrivateKeyDialog', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <PrivateKeyDialog
        isOpen={false}
        onClose={vi.fn()}
        wallet={testData.wallet}
        privateKey={mockPrivateKey}
        onDone={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the dialog when isOpen is true', () => {
    render(
      <PrivateKeyDialog
        isOpen={true}
        onClose={vi.fn()}
        wallet={testData.wallet}
        privateKey={mockPrivateKey}
        onDone={vi.fn()}
      />
    );

    expect(screen.getByText('Test Wallet')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <PrivateKeyDialog
        isOpen={true}
        onClose={onClose}
        wallet={testData.wallet}
        privateKey={mockPrivateKey}
        onDone={vi.fn()}
      />
    );

    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDone when the Done button is clicked', () => {
    const onDone = vi.fn();

    render(
      <PrivateKeyDialog
        isOpen={true}
        onClose={vi.fn()}
        wallet={testData.wallet}
        privateKey={mockPrivateKey}
        onDone={onDone}
      />
    );

    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('toggles private key visibility when Show/Hide button is clicked', () => {
    render(
      <PrivateKeyDialog
        isOpen={true}
        onClose={vi.fn()}
        wallet={testData.wallet}
        privateKey={mockPrivateKey}
        onDone={vi.fn()}
      />
    );

    const toggleButton = screen.getByText('Show');
    fireEvent.click(toggleButton);

    expect(screen.getByText(mockPrivateKey)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide'));
    expect(screen.queryByText(mockPrivateKey)).not.toBeInTheDocument();
  });
});
