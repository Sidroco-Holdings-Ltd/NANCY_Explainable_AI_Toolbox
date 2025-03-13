import React from 'react';
import { render, screen } from '@testing-library/react';
import TableOne from '../TableOne';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    <img src={src} alt={alt} width={width} height={height} data-testid="mock-image" />
  ),
}));

describe('TableOne Component', () => {
  beforeEach(() => {
    render(<TableOne />);
  });
  
  test('renders the table header correctly', () => {
    // Title
    expect(screen.getByText('Top Channels')).toBeInTheDocument();
    
    // Column headers
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Visitors')).toBeInTheDocument();
    expect(screen.getByText('Revenues')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('Conversion')).toBeInTheDocument();
  });
  
  test('renders all 5 brand rows correctly', () => {
    // Brand names
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Github')).toBeInTheDocument();
    expect(screen.getByText('Vimeo')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    
    // Check images are rendered
    const images = screen.getAllByTestId('mock-image');
    expect(images).toHaveLength(5);
    expect(images[0]).toHaveAttribute('src', '/images/brand/brand-01.svg');
    expect(images[4]).toHaveAttribute('src', '/images/brand/brand-05.svg');
    
    // Check visitor counts - using regex to handle potential whitespace
    const visitorElements = screen.getAllByText(/3\.5/);
    expect(visitorElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/2\.2/)).toBeInTheDocument();
    
    // Check revenue values - using regex to handle potential whitespace
    expect(screen.getByText(/\$5,768/)).toBeInTheDocument();
    expect(screen.getByText(/\$6,768/)).toBeInTheDocument();
  });
  
  test('formats numeric values correctly', () => {
    // Check number formatting for visitors (K suffix)
    const kElements = screen.getAllByText(/K$/);
    expect(kElements.length).toBe(5); // 5 brands with K suffix
    
    // Check for dollar sign in revenue
    const dollarElements = screen.getAllByText(/\$/);
    expect(dollarElements.length).toBe(5); // 5 revenues with $ sign
    
    // Check percentage sign in conversion
    const percentElements = screen.getAllByText(/%/);
    expect(percentElements.length).toBe(5); // 5 conversions with % suffix
  });
  
  test('applies correct styles to header section', () => {
    const header = screen.getByText('Top Channels');
    expect(header).toHaveClass('text-xl');
    expect(header).toHaveClass('font-semibold');
  });
}); 