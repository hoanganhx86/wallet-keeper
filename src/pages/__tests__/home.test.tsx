import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../home';

vi.mock('@/components/WalletGenerator', () => ({
  WalletGenerator: () => <div data-testid="wallet-generator">Wallet Generator</div>,
}));

describe('Home Page', () => {
  it('renders the header with correct title and icon', () => {
    render(<Home />);

    expect(screen.getByText('Wallet Keeper')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /wallet/i })).toBeInTheDocument();
  });

  it('renders the WalletGenerator component', () => {
    render(<Home />);

    expect(screen.getByTestId('wallet-generator')).toBeInTheDocument();
  });

  it('renders the footer with correct text', () => {
    render(<Home />);

    expect(screen.getByText('Wallet Keeper - Secure EVM Wallet Management')).toBeInTheDocument();
  });

  it('has the correct layout structure', () => {
    render(<Home />);

    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });
});
