import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletGenerator } from '../WalletGenerator';
import { useWalletManagement } from '@/hooks/use-wallet-management';

vi.mock('@/hooks/use-wallet-management', () => ({
  useWalletManagement: vi.fn(),
}));

vi.mock('../WalletGenerationSection', () => ({
  WalletGenerationSection: () => (
    <div data-testid="wallet-generation-section">Wallet Generation Section</div>
  ),
}));

vi.mock('../WalletList', () => ({
  WalletList: () => <div data-testid="wallet-list">Wallet List</div>,
}));

vi.mock('../SectionSeparator', () => ({
  SectionSeparator: () => <div data-testid="section-separator">Section Separator</div>,
}));

describe('WalletGenerator', () => {
  const mockWallets = [
    {
      id: '1',
      name: 'Test Wallet',
      address: '0x123',
      encryptedPrivateKey: 'encrypted',
      createdAt: '2024-03-20',
      balances: [],
    },
  ];

  beforeEach(() => {
    vi.mocked(useWalletManagement).mockReturnValue({
      wallets: mockWallets,
      selectedNetwork: 'ethereum',
      isLoading: false,
      error: null,
      currentWallet: null,
      privateKey: null,
      showPrivateKey: false,
      isViewingPrivateKey: false,
      handleGenerateWallet: vi.fn(),
      handleDoneViewing: vi.fn(),
      handleRefreshBalances: vi.fn(),
      handleNetworkChange: vi.fn(),
      handleViewPrivateKey: vi.fn(),
    });
  });

  it('renders WalletGenerationSection', () => {
    render(<WalletGenerator />);
    expect(screen.getByTestId('wallet-generation-section')).toBeInTheDocument();
  });

  it('renders WalletList and SectionSeparator when wallets exist', () => {
    render(<WalletGenerator />);
    expect(screen.getByTestId('wallet-list')).toBeInTheDocument();
    expect(screen.getByTestId('section-separator')).toBeInTheDocument();
  });

  it('does not render WalletList when no wallets exist', () => {
    vi.mocked(useWalletManagement).mockReturnValue({
      ...vi.mocked(useWalletManagement)(),
      wallets: [],
    });

    render(<WalletGenerator />);
    expect(screen.queryByTestId('wallet-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('section-separator')).not.toBeInTheDocument();
  });
});
