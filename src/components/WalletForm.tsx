import { useState } from 'react';

const MIN_PASSWORD_LENGTH = 8;

interface WalletFormProps {
  onSubmit: (data: { password: string; name: string }) => void;
  error?: string | null;
  isLoading?: boolean;
}

export function WalletForm({ onSubmit, error: apiError, isLoading }: WalletFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validatePassword()) {
      return;
    }
    setIsSubmitting(true);
    onSubmit({ password, name });
    setPassword('');
    setConfirmPassword('');
    setName('');
    setIsSubmitting(false);
  };

  return (
    <div role="form">
      {(error || apiError) && (
        <div className="bg-red-100 text-red-800 p-2.5 rounded mb-4">{error || apiError}</div>
      )}
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1.5 font-medium text-sm">
          Secure Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (error) validatePassword();
            }}
            placeholder="Enter a strong password to encrypt your wallet"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-500 text-sm"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          This password will be required to view your private keys later. We don't store your
          password.
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="confirm-password" className="block mb-1.5 font-medium text-sm">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
              if (error) validatePassword();
            }}
            placeholder="Confirm your password"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="wallet-name" className="block mb-1.5 font-medium text-sm">
          Wallet Name (Optional)
        </label>
        <input
          id="wallet-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. My Main Wallet"
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <button
        onClick={handleSubmit}
        id='generate-wallet'
        aria-label='generate wallet'
        type='button'
        disabled={isSubmitting || isLoading}
        className="w-full bg-blue-800 text-white px-4 py-2.5 border-none rounded font-semibold text-base cursor-pointer disabled:opacity-70 disabled:cursor-wait mb-8"
      >
        {isSubmitting ? 'Generating...' : 'Generate Wallet'}
      </button>
    </div>
  );
}