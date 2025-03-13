import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarItem from '../SidebarItem';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('SidebarItem Component', () => {
  const mockItem = {
    icon: <span data-testid="test-icon">🏠</span>,
    label: 'Test Item',
    route: '/test-route',
  };
  
  const mockSetPageName = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders correctly with provided item', () => {
    require('next/navigation').usePathname.mockReturnValue('/different-route');
    
    render(
      <SidebarItem 
        item={mockItem} 
        pageName="dashboard" 
        setPageName={mockSetPageName} 
      />
    );
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
  
  test('highlights active item when route matches pathname', () => {
    require('next/navigation').usePathname.mockReturnValue('/test-route');
    
    const { container } = render(
      <SidebarItem 
        item={mockItem} 
        pageName="dashboard" 
        setPageName={mockSetPageName} 
      />
    );
    
    // Check if active class is applied
    const link = container.querySelector('a');
    expect(link).toHaveClass('bg-blue-500');
    expect(link).toHaveClass('text-white');
  });
  
  test('does not highlight inactive item', () => {
    require('next/navigation').usePathname.mockReturnValue('/different-route');
    
    const { container } = render(
      <SidebarItem 
        item={mockItem} 
        pageName="dashboard" 
        setPageName={mockSetPageName} 
      />
    );
    
    // Check that active class is not applied
    const link = container.querySelector('a');
    expect(link).not.toHaveClass('bg-blue-500');
    expect(link).toHaveClass('text-gray-400');
  });
  
  test('calls setPageName with correct value when clicked', () => {
    require('next/navigation').usePathname.mockReturnValue('/different-route');
    
    render(
      <SidebarItem 
        item={mockItem} 
        pageName="dashboard" 
        setPageName={mockSetPageName} 
      />
    );
    
    fireEvent.click(screen.getByText('Test Item'));
    
    expect(mockSetPageName).toHaveBeenCalledWith('test item');
  });
}); 