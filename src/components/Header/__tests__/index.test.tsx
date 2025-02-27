import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../index';
import '@testing-library/jest-dom';

describe('Header Component', () => {
  const mockSetSidebarOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header title', () => {
    render(<Header sidebarOpen={false} setSidebarOpen={mockSetSidebarOpen} />);
    expect(screen.getByText('NANCY XAI Visualisation Dashboard')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<Header sidebarOpen={false} setSidebarOpen={mockSetSidebarOpen} />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'z-999');
  });
}); 