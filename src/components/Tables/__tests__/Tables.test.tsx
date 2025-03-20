import React from 'react';
import { render, screen } from '@testing-library/react';
import TableOne from '../TableOne';
import TableTwo from '../TableTwo';
import TableThree from '../TableThree';
import TableFour from '../TableFour';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    <img src={src} alt={alt} width={width} height={height} data-testid="mock-image" />
  ),
}));

interface TableInfo {
  Component: React.ComponentType;
  name: string;
  title?: string;
}

describe('Table Components Common Features', () => {
  const tables: TableInfo[] = [
    { Component: TableOne, name: 'TableOne', title: 'Top Channels' },
    { Component: TableTwo, name: 'TableTwo', title: 'Top Products' },
    { Component: TableThree, name: 'TableThree' },
    { Component: TableFour, name: 'TableFour', title: 'Top Channels' },
  ];
  
  test.each(tables.filter(t => t.title))('$name should display its title: $title', ({ Component, title }) => {
    render(<Component />);
    if (title) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });
  
  test.each(tables)('$name should have proper styling', ({ Component, name }) => {
    const { container } = render(<Component />);
    
    // Find the actual styled container within the component
    // It may be either the first child or a child deeper in the DOM
    const findStyledContainer = () => {
      // Try to find a container with border class
      const borderedElements = container.querySelectorAll('.border');
      if (borderedElements.length > 0) {
        return borderedElements[0];
      }
      
      // For TableFour which may have a different structure
      if (name === 'TableFour') {
        const innerContainer = container.querySelector('.rounded-sm');
        if (innerContainer) return innerContainer;
      }
      
      // Fallback to any element with bg-white class
      return container.querySelector('.bg-white');
    };
    
    const styledContainer = findStyledContainer();
    expect(styledContainer).toBeTruthy();
    expect(styledContainer).toHaveClass('bg-white');
  });
  
  test.each(tables)('$name should have dark mode compatible classes', ({ Component }) => {
    const { container } = render(<Component />);
    
    // Find elements with dark mode classes
    const darkModeElements = container.querySelectorAll('[class*="dark:"]');
    expect(darkModeElements.length).toBeGreaterThan(0);
    
    // Specifically check for dark background
    const darkBgElements = container.querySelectorAll('[class*="dark:bg-"]');
    expect(darkBgElements.length).toBeGreaterThan(0);
  });
  
  test.each(tables)('$name should have responsive design classes', ({ Component }) => {
    const { container } = render(<Component />);
    
    // Check for responsive classes (sm:, md:, lg:, xl:)
    const responsiveElements = container.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  test('all tables with brand data show correct information', () => {
    // Render both tables that show brand data
    render(<TableOne />);
    render(<TableFour />);
    
    // Common brands that should appear in both tables
    const commonBrands = ['Google', 'Twitter', 'Facebook', 'Vimeo'];
    
    // Check each common brand appears at least twice (once in each table)
    commonBrands.forEach(brand => {
      const elements = screen.getAllByText(brand);
      expect(elements.length).toBeGreaterThanOrEqual(2);
    });
  });
  
  test('all tables use proper formatting for currencies and percentages', () => {
    // Render all tables one by one
    render(<TableOne />);
    render(<TableTwo />);
    render(<TableThree />);
    render(<TableFour />);
    
    // Currency values should have $ prefix
    const currencyElements = screen.getAllByText(/^\$\d/);
    expect(currencyElements.length).toBeGreaterThan(0);
    
    // Percentage values should have % suffix (except TableTwo which doesn't have percentages)
    const percentElements = screen.getAllByText(/%$/);
    expect(percentElements.length).toBeGreaterThan(0);
  });
}); 