import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import HomePage from '../HomePage';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/test-path',
}));

// Mock required components
jest.mock('../LogoLoader', () => {
  return function MockLogoLoader() {
    return <div data-testid="logo-loader">Loading...</div>;
  };
});

jest.mock('../../../app/error-404', () => {
  return function MockErrorPage() {
    return <div data-testid="error-404">Not Found</div>;
  };
});

jest.mock('../../CardDataStats', () => {
  return function MockCardDataStats({ title, total, selected, rate }: any) {
    return (
      <div data-testid="card-data-stats">
        <span data-testid="card-title">{title}</span>
        <span data-testid="card-total">{total}</span>
        <span data-testid="card-selected">{selected ? 'selected' : 'not-selected'}</span>
        {rate}
      </div>
    );
  };
});

jest.mock('../../SelectGroup/SelectGroupTwo', () => {
  return function MockSelectGroupTwo({ photos, isLoading }: any) {
    // Call photos function to test it
    const [photoData] = photos();
    return (
      <div data-testid="select-group-two">
        <span data-testid="photos-count">{photoData ? photoData.length : 0}</span>
        <span data-testid="loading-state">{isLoading ? 'loading' : 'not-loading'}</span>
      </div>
    );
  };
});

// Mock fetch API
const mockFetchResponse = {
  answer: {
    'Folder 1 [Group A]': [
      { path: 'image1.png' },
      { path: 'image2.png' }
    ],
    'Folder 2 [Group B]': [
      { path: 'image3.png' },
      { path: 'image4.png' }
    ]
  }
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockFetchResponse)
  })
) as jest.Mock;

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('shows loader initially', () => {
    render(<HomePage />);
    expect(screen.getByTestId('logo-loader')).toBeInTheDocument();
  });

  it('fetches data and renders content', async () => {
    render(<HomePage />);
    
    // Advance timers to trigger useEffect
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('logo-loader')).not.toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith('/api/getSubFolderNames/test-path');
    expect(screen.getAllByTestId('card-data-stats')).toHaveLength(2);
  });

  it('handles empty data response', async () => {
    // Mock empty response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ answer: {} })
      })
    );
    
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('logo-loader')).not.toBeInTheDocument();
      expect(screen.getByTestId('error-404')).toBeInTheDocument();
    });
  });

  it('handles fetch error', async () => {
    // Mock fetch error
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Fetch failed'))
    );
    
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('logo-loader')).not.toBeInTheDocument();
      expect(screen.getByTestId('error-404')).toBeInTheDocument();
    });
  });

  it('parses folder names correctly', async () => {
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      const cardTitles = screen.getAllByTestId('card-title');
      const cardTotals = screen.getAllByTestId('card-total');
      
      expect(cardTitles[0]).toHaveTextContent('Group A');
      expect(cardTotals[0]).toHaveTextContent('Folder 1');
      
      expect(cardTitles[1]).toHaveTextContent('Group B');
      expect(cardTotals[1]).toHaveTextContent('Folder 2');
    });
  });

  it('selects first option by default', async () => {
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      const selectedCards = screen.getAllByTestId('card-selected');
      expect(selectedCards[0]).toHaveTextContent('selected');
      expect(selectedCards[1]).toHaveTextContent('not-selected');
    });
  });

  it('changes selected option when clicked', async () => {
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('logo-loader')).not.toBeInTheDocument();
    });
    
    // Get the second button and click it
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    
    // Check that selection changed
    const selectedCards = screen.getAllByTestId('card-selected');
    expect(selectedCards[0]).toHaveTextContent('not-selected');
    expect(selectedCards[1]).toHaveTextContent('selected');
  });
}); 