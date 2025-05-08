import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound Page', () => {
  it('renders 404 error message', () => {
    render(<NotFound />);

    expect(screen.getByText('404 – Page Not Found')).toBeInTheDocument();
  });

  it('renders error icon', () => {
    render(<NotFound />);

    expect(screen.getByRole('img', { name: /alert/i })).toBeInTheDocument();
  });

  it('renders helpful message', () => {
    render(<NotFound />);

    expect(screen.getByText(/Oops! The page you're looking for doesn't exist/)).toBeInTheDocument();
  });

  it('renders home link', () => {
    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /go back home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
