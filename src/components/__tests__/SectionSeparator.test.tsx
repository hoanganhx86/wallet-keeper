import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionSeparator } from '../SectionSeparator';

describe('SectionSeparator', () => {
  it('should render correctly', () => {
    render(<SectionSeparator />);
    
    const dot = screen.getByText('•');
    expect(dot).toHaveClass('mx-4 text-sm text-slate-500');
    
    const lines = dot.parentElement?.querySelectorAll('div.border-t');
    expect(lines).toHaveLength(2);
    lines?.forEach(line => {
      expect(line).toHaveClass('flex-grow border-t border-slate-200');
    });
  });
}); 