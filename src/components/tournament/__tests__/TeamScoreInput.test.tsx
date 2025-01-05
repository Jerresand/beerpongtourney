import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TeamScoreInput from '../TeamScoreInput';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const defaultProps = {
  teamName: 'Team 1',
  score: 0,
  onScoreChange: vi.fn()
};

describe('TeamScoreInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update score when valid value is entered', () => {
    render(<TeamScoreInput {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '5' } });
    expect(defaultProps.onScoreChange).toHaveBeenCalledWith(5);
  });

  it('should convert empty input to 0', () => {
    render(<TeamScoreInput {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });
    expect(defaultProps.onScoreChange).toHaveBeenCalledWith(0);
  });
}); 