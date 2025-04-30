import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '../layout';

// Mock the Loader component
jest.mock('@/components/common/Loader', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-loader">Loading...</div>,
  };
});

describe('RootLayout Component', () => {
  beforeEach(() => {
    // Clear all timers before each test
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initially renders the loader', () => {
    render(
      <RootLayout>
        <div data-testid="test-children">Test Content</div>
      </RootLayout>
    );

    // Initially, the loader should be visible and not the children
    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
  });

  test('renders children after loading completes', async () => {
    render(
      <RootLayout>
        <div data-testid="test-children">Test Content</div>
      </RootLayout>
    );

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(1100); // Just over 1000ms to ensure timer completes
    });

    // Now the loader should be gone and the children should be visible
    expect(screen.queryByTestId('mock-loader')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders with proper component structure', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    );

    // Check for dark mode container instead of HTML attributes
    // that might not be properly set in the testing environment
    const darkModeContainer = container.querySelector('.dark\\:bg-boxdark-2');
    expect(darkModeContainer).toBeInTheDocument();
    
    // Verify the loading state is rendered initially
    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    
    // Verify the component structure will display children when loading is complete
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });
}); 