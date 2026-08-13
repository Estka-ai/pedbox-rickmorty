import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders the given error message', () => {
    render(<ErrorState message="No se pudo conectar con el servidor." />);

    expect(
      screen.getByText('No se pudo conectar con el servidor.'),
    ).toBeInTheDocument();
  });

  it('does not render a retry button when onRetry is not provided', () => {
    render(<ErrorState message="Algo salió mal." />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRetry when the retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Algo salió mal." onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
