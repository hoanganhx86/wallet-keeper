import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletGenerationSection } from '../WalletGenerationSection';

describe('WalletGenerationSection', () => {
  const defaultProps = {
    isLoading: false,
    error: null,
    onGenerateWallet: vi.fn(),
  };

  it('renders wallet generation form', () => {
    render(<WalletGenerationSection {...defaultProps} />);

    expect(screen.getByText('Generate New Wallet')).toBeInTheDocument();
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Invalid password';
    render(<WalletGenerationSection {...defaultProps} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onGenerateWallet with form data when form is submitted', async () => {
    render(<WalletGenerationSection {...defaultProps} />);

    const nameInput = screen.getByLabelText(/wallet name/i);
    const passwordInput = screen.getByLabelText(/Secure Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByLabelText(/generate wallet/i);

    fireEvent.change(nameInput, { target: { value: 'My Wallet' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(defaultProps.onGenerateWallet).toHaveBeenCalledWith({
      name: 'My Wallet',
      password: 'password123',
    });
  });

  it('disables form submission when loading', () => {
    render(<WalletGenerationSection {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByLabelText(/generate wallet/i);
    expect(submitButton).toBeDisabled();
  });
});
