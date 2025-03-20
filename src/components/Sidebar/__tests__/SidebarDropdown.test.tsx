import React from 'react';
import { render, screen } from '@testing-library/react';
import SidebarDropdown from '../SidebarDropdown';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: { children: React.ReactNode; href: string; className: string }) => {
    return <a href={href} className={className} data-testid={`link-${href}`}>{children}</a>;
  };
});

describe('SidebarDropdown Component', () => {
  const mockItems = [
    {
      label: 'Dropdown Item 1',
      route: '/dropdown/item1',
    },
    {
      label: 'Dropdown Item 2',
      route: '/dropdown/item2',
    },
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders all dropdown items', () => {
    require('next/navigation').usePathname.mockReturnValue('/different-route');
    
    render(<SidebarDropdown item={mockItems} />);
    
    expect(screen.getByText('Dropdown Item 1')).toBeInTheDocument();
    expect(screen.getByText('Dropdown Item 2')).toBeInTheDocument();
  });
  
  test('applies correct active class when route matches pathname', () => {
    require('next/navigation').usePathname.mockReturnValue('/dropdown/item1');
    
    render(<SidebarDropdown item={mockItems} />);
    
    // In the component, the text-white class is applied directly to the <Link> (which renders as <a>)
    // not to its parent element
    const item1Link = screen.getByTestId('link-/dropdown/item1');
    const item2Link = screen.getByTestId('link-/dropdown/item2');
    
    // Active link should have text-white class
    expect(item1Link).toHaveClass('text-white');
    
    // Inactive link should not have text-white class
    expect(item2Link).not.toHaveClass('text-white');
  });
  
  test('has correct links for each dropdown item', () => {
    require('next/navigation').usePathname.mockReturnValue('/different-route');
    
    render(<SidebarDropdown item={mockItems} />);
    
    const item1Link = screen.getByText('Dropdown Item 1').closest('a');
    const item2Link = screen.getByText('Dropdown Item 2').closest('a');
    
    expect(item1Link).toHaveAttribute('href', '/dropdown/item1');
    expect(item2Link).toHaveAttribute('href', '/dropdown/item2');
  });
}); 