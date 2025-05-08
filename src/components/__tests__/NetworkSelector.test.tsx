import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NetworkSelector } from '../NetworkSelector';
import { networks } from '@/lib/networks';

describe('NetworkSelector', () => {
  const defaultProps = {
    selectedNetwork: 'ethereum' as const,
    onChange: vi.fn(),
  };

  it('renders network selector with correct options', () => {
    render(<NetworkSelector {...defaultProps} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    // Check if all network options are present
    Object.values(networks).forEach(network => {
      expect(screen.getByText(network.name)).toBeInTheDocument();
    });
  });

  it('calls onChange when a different network is selected', () => {
    render(<NetworkSelector {...defaultProps} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'binance' } });

    expect(defaultProps.onChange).toHaveBeenCalledWith('binance');
  });

  it('displays the currently selected network', () => {
    render(<NetworkSelector {...defaultProps} selectedNetwork="binance" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('binance');
  });
});