import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock UI components
vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => React.createElement('input', { type: 'number', ...props })
}));

vi.mock('@/components/ui/label', () => ({
  Label: (props: any) => React.createElement('label', props)
}));

vi.mock('@/components/ui/button', () => ({
  Button: (props: any) => React.createElement('button', props)
}));

// Mock hooks
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
})); 