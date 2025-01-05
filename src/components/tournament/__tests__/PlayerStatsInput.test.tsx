import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PlayerStatsInput from '../PlayerStatsInput';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const defaultProps = {
  label: 'Cups',
  value: 0,
  onChange: vi.fn(),
  statKey: 'cups' as const
};

describe('PlayerStatsInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle direct input changes within valid range', () => {
    render(<PlayerStatsInput {...defaultProps} />);
    const input = screen.getByTestId('player-stats-input');
    fireEvent.change(input, { target: { value: '5' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(5);
  });

  it('should convert empty input to 0', () => {
    render(<PlayerStatsInput {...defaultProps} />);
    const input = screen.getByTestId('player-stats-input');
    fireEvent.change(input, { target: { value: '' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(0);
  });
}); 