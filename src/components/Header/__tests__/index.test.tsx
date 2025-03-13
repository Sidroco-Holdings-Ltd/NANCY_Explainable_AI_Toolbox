import { render, screen } from '@testing-library/react';
import Header from '../index';
import '@testing-library/jest-dom';

describe('Header Component', () => {
  const mockProps = {
    sidebarOpen: false,
    setSidebarOpen: jest.fn(),
  };

  it('renders the header title', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText('NANCY XAI Visualisation Dashboard')).toBeInTheDocument();
  });

  it('renders with sticky positioning', () => {
    render(<Header {...mockProps} />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
  });

  it('has correct styling for the header container', () => {
    render(<Header {...mockProps} />);
    const headerContainer = screen.getByRole('banner').firstChild;
    expect(headerContainer).toHaveClass('flex');
    expect(headerContainer).toHaveClass('flex-grow');
    expect(headerContainer).toHaveClass('items-center');
    expect(headerContainer).toHaveClass('justify-between');
  });

  it('has min-height for proper display', () => {
    render(<Header {...mockProps} />);
    const headerContainer = screen.getByRole('banner').firstChild;
    expect(headerContainer).toHaveClass('min-h-[80px]');
  });
}); 