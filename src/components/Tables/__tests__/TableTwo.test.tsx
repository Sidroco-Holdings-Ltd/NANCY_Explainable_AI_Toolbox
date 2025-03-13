import React from 'react';
import { render, screen } from '@testing-library/react';
import TableTwo from '../TableTwo';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    <img src={src} alt={alt} width={width} height={height} data-testid="mock-image" />
  ),
}));

describe('TableTwo Component', () => {
  beforeEach(() => {
    render(<TableTwo />);
  });

  test('renders the table header correctly', () => {
    // Title
    expect(screen.getByText('Top Products')).toBeInTheDocument();
    
    // Column headers
    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Sold')).toBeInTheDocument();
    expect(screen.getByText('Profit')).toBeInTheDocument();
  });
  
  test('renders all 4 product rows correctly', () => {
    // Product names
    expect(screen.getByText('Apple Watch Series 7')).toBeInTheDocument();
    expect(screen.getByText('Macbook Pro M1')).toBeInTheDocument();
    expect(screen.getByText('Dell Inspiron 15')).toBeInTheDocument();
    expect(screen.getByText('HP Probook 450')).toBeInTheDocument();
    
    // Check category consistency
    const categories = screen.getAllByText('Electronics');
    expect(categories).toHaveLength(4);
    
    // Check images are rendered
    const images = screen.getAllByTestId('mock-image');
    expect(images).toHaveLength(4);
    expect(images[0]).toHaveAttribute('src', '/images/product/product-01.png');
    expect(images[3]).toHaveAttribute('src', '/images/product/product-04.png');
  });
  
  test('displays correct pricing and sales info', () => {
    // Check price values
    expect(screen.getByText('$296')).toBeInTheDocument();
    expect(screen.getByText('$546')).toBeInTheDocument();
    expect(screen.getByText('$443')).toBeInTheDocument();
    expect(screen.getByText('$499')).toBeInTheDocument();
    
    // Check sold quantities
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('64')).toBeInTheDocument();
    expect(screen.getByText('72')).toBeInTheDocument();
    
    // Check profit values
    expect(screen.getByText('$45')).toBeInTheDocument();
    expect(screen.getByText('$125')).toBeInTheDocument();
    expect(screen.getByText('$247')).toBeInTheDocument();
    expect(screen.getByText('$103')).toBeInTheDocument();
  });
  
  test('applies correct profit styling', () => {
    // Check that profit values have the meta-3 class for green text
    const profitValues = ['$45', '$125', '$247', '$103'];
    
    profitValues.forEach(value => {
      const element = screen.getByText(value);
      expect(element).toHaveClass('text-meta-3');
    });
  });
  
  test('has responsive layout with hidden elements on small screens', () => {
    // Category column should be hidden on small screens
    const categoryColumn = screen.getByText('Category').closest('div');
    expect(categoryColumn).toHaveClass('hidden');
    expect(categoryColumn).toHaveClass('sm:flex');
  });
}); 