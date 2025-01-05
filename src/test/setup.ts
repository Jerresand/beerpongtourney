import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock UI components
vi.mock('@/components/ui/input', () => ({
  Input: vi.fn()
}));

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn()
}));

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn()
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