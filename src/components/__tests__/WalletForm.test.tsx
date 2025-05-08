import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletForm } from '../WalletForm';

describe('WalletForm', () => {
  const testData = {
    validPassword: 'validpassword123',
    shortPassword: 'short',
    differentPassword: 'differentpassword',
    walletName: 'Test Wallet',
    apiError: 'API Error',
  } as const;

  const errorMessages = {
    passwordTooShort: 'Password must be at least 8 characters long',
    passwordsDoNotMatch: 'Passwords do not match',
  } as const;

  // Helper functions
  const renderWalletForm = (props = {}) => {
    const defaultProps = {
      onSubmit: vi.fn(),
      isLoading: false,
      error: null,
      ...props,
    };
    return {
      ...render(<WalletForm {...defaultProps} />),
      defaultProps,
    };
  };

  const fillPasswordFields = (password: string, confirmPassword: string) => {
    const passwordInput = screen.getByLabelText(/Secure Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.change(confirmPasswordInput, { target: { value: confirmPassword } });
    
    return { passwordInput, confirmPasswordInput };
  };

  const fillWalletName = (name: string) => {
    const nameInput = screen.getByLabelText(/Wallet Name/);
    fireEvent.change(nameInput, { target: { value: name } });
    return nameInput;
  };

  const submitForm = () => {
    const submitButton = screen.getByText('Generate Wallet');
    fireEvent.click(submitButton);
    return submitButton;
  };

  it('renders form fields correctly', () => {
    renderWalletForm();

    expect(screen.getByLabelText(/Secure Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wallet Name/)).toBeInTheDocument();
    expect(screen.getByText('Generate Wallet')).toBeInTheDocument();
  });

  it('shows error message when password is too short', () => {
    const { defaultProps } = renderWalletForm();

    fillPasswordFields(testData.shortPassword, testData.shortPassword);
    submitForm();

    expect(screen.getByText(errorMessages.passwordTooShort)).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows error message when passwords do not match', () => {
    const { defaultProps } = renderWalletForm();

    fillPasswordFields(testData.validPassword, testData.differentPassword);
    submitForm();

    expect(screen.getByText(errorMessages.passwordsDoNotMatch)).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('clears error message when password requirements are met', () => {
    renderWalletForm();

    // First set a short password to trigger error
    fillPasswordFields(testData.shortPassword, testData.shortPassword);
    submitForm();
    
    expect(screen.getByText(errorMessages.passwordTooShort)).toBeInTheDocument();

    // Then set valid matching passwords
    fillPasswordFields(testData.validPassword, testData.validPassword);

    // Error message should be cleared
    expect(screen.queryByText(errorMessages.passwordTooShort)).not.toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', () => {
    const { defaultProps } = renderWalletForm();

    fillPasswordFields(testData.validPassword, testData.validPassword);
    fillWalletName(testData.walletName);
    submitForm();

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      password: testData.validPassword,
      name: testData.walletName,
    });
  });

  it('shows API error message when provided', () => {
    renderWalletForm({ error: testData.apiError });

    expect(screen.getByText(testData.apiError)).toBeInTheDocument();
  });

  it('toggles password visibility for both password fields when show/hide button is clicked', () => {
    renderWalletForm();

    const { passwordInput, confirmPasswordInput } = fillPasswordFields(
      testData.validPassword,
      testData.validPassword
    );
    const toggleButton = screen.getByText('Show');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    expect(screen.getByText('Hide')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide'));
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(screen.getByText('Show')).toBeInTheDocument();
  });

  it('resets form fields after successful submission', () => {
    renderWalletForm();

    const { passwordInput, confirmPasswordInput } = fillPasswordFields(
      testData.validPassword,
      testData.validPassword
    );
    const nameInput = fillWalletName(testData.walletName);
    submitForm();

    expect(passwordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
  });
});
