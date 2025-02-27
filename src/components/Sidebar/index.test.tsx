import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './index';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Sidebar Component', () => {
  const mockSetSidebarOpen = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ answer: ['folder1', 'folder2'] })
      })
    ) as jest.Mock;
  });

  it('renders folder list', async () => {
    render(<Sidebar sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);
    const folders = await screen.findAllByRole('link');
  expect(folders.length).toBeGreaterThan(0);
  });

  it('closes on outside click', () => {
    render(<Sidebar sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);
    
    // Create a div outside the sidebar
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    // Simulate click outside
    fireEvent.mouseDown(outsideElement);
    
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
    
    // Cleanup
    document.body.removeChild(outsideElement);
  });
}); 