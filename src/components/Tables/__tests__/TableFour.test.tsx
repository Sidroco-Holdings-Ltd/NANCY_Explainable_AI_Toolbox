import React from 'react';
import { render, screen } from '@testing-library/react';
import TableFour from '../TableFour';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    <img src={src} alt={alt} width={width} height={height} data-testid="mock-image" />
  ),
}));

describe('TableFour Component', () => {
  beforeEach(() => {
    render(<TableFour />);
  });

  test('renders the table header correctly', () => {
    // Title
    expect(screen.getByText('Top Channels')).toBeInTheDocument();
    
    // Column headers
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Visitors')).toBeInTheDocument();
    expect(screen.getByText('Revenues')).toBeInTheDocument();
    expect(screen.getByText('Conversion')).toBeInTheDocument();
  });
  
  test('renders all 5 brand rows correctly', () => {
    // Brand names (the names might be hidden on smaller screens)
    const brandNames = ['Google', 'Twitter', 'Youtube', 'Vimeo', 'Facebook'];
    brandNames.forEach(name => {
      const elements = screen.getAllByText(name);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });
    
    // Check images are rendered
    const images = screen.getAllByTestId('mock-image');
    expect(images).toHaveLength(5);
    expect(images[0]).toHaveAttribute('src', '/images/brand/brand-01.svg');
    expect(images[2]).toHaveAttribute('src', '/images/brand/brand-06.svg'); // YouTube has a different brand number
    expect(images[4]).toHaveAttribute('src', '/images/brand/brand-05.svg');
  });
  
  test('displays correct visitor, revenue and conversion data', () => {
    // Check visitor values
    expect(screen.getAllByText('3.5K')).toHaveLength(2); // Google and Facebook
    expect(screen.getByText('2.2K')).toBeInTheDocument(); // Twitter
    expect(screen.getByText('2.1K')).toBeInTheDocument(); // Youtube
    expect(screen.getByText('1.5K')).toBeInTheDocument(); // Vimeo
    
    // Check revenue values
    expect(screen.getByText('$5,768')).toBeInTheDocument();
    expect(screen.getByText('$4,635')).toBeInTheDocument();
    expect(screen.getByText('$4,290')).toBeInTheDocument();
    expect(screen.getByText('$3,580')).toBeInTheDocument();
    expect(screen.getByText('$6,768')).toBeInTheDocument();
    
    // Check conversion rates
    expect(screen.getByText('4.8%')).toBeInTheDocument();
    expect(screen.getByText('4.3%')).toBeInTheDocument();
    expect(screen.getByText('3.7%')).toBeInTheDocument();
    expect(screen.getByText('2.5%')).toBeInTheDocument();
    expect(screen.getByText('4.2%')).toBeInTheDocument();
  });
  
  test('formats values with appropriate styling', () => {
    // Revenue values should have text-meta-3 class (green text)
    const revenueValues = ['$5,768', '$4,635', '$4,290', '$3,580', '$6,768'];
    
    revenueValues.forEach(value => {
      const element = screen.getByText(value);
      expect(element).toHaveClass('font-medium');
      expect(element).toHaveClass('text-meta-3');
    });
    
    // Conversion values should have text-meta-5 class (purple text)
    const conversionValues = ['4.8%', '4.3%', '3.7%', '2.5%', '4.2%'];
    
    conversionValues.forEach(value => {
      const element = screen.getByText(value);
      expect(element).toHaveClass('font-medium');
      expect(element).toHaveClass('text-meta-5');
    });
  });
  
  test('has responsive grid layout', () => {
    // Check grid structure (3 columns on mobile, 4 on larger screens)
    const gridHeader = screen.getByText('Source').closest('div')?.parentElement;
    expect(gridHeader).toHaveClass('grid-cols-3');
    expect(gridHeader).toHaveClass('sm:grid-cols-4');
    
    // Check that conversion column is hidden on mobile
    const conversionHeader = screen.getByText('Conversion').closest('div');
    expect(conversionHeader).toHaveClass('hidden');
    expect(conversionHeader).toHaveClass('sm:block');
  });
}); 