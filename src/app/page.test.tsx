import { render, screen } from '@testing-library/react';
import Page from './page';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ folders: ['folder1', 'folder2'] })
  })
) as jest.Mock;

describe('Page Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
}); 