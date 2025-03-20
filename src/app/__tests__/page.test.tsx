import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../page';

// Mock the components used in the page
jest.mock('@/components/Dashboard/MainPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-ecommerce">E-Commerce Dashboard Content</div>,
  };
});

jest.mock('@/components/Layouts/DefaultLayout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-default-layout">
        <div>Layout Header</div>
        {children}
        <div>Layout Footer</div>
      </div>
    ),
  };
});

describe('HomePage Component', () => {
  test('renders the DefaultLayout component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-default-layout')).toBeInTheDocument();
    expect(screen.getByText('Layout Header')).toBeInTheDocument();
    expect(screen.getByText('Layout Footer')).toBeInTheDocument();
  });

  test('renders the ECommerce component inside DefaultLayout', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-ecommerce')).toBeInTheDocument();
    expect(screen.getByText('E-Commerce Dashboard Content')).toBeInTheDocument();
  });

  test('maintains proper component nesting', () => {
    render(<HomePage />);
    
    // Check if the ECommerce component is nested inside the DefaultLayout
    const layoutElement = screen.getByTestId('mock-default-layout');
    const ecommerceElement = screen.getByTestId('mock-ecommerce');
    
    expect(layoutElement.contains(ecommerceElement)).toBe(true);
  });
}); 