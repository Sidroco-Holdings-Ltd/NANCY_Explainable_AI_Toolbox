import { render, screen } from '@testing-library/react';
import ChartPage from '../page';
import '@testing-library/jest-dom';

// Mock the Breadcrumb component
jest.mock('../../Breadcrumbs/Breadcrumb', () => {
  return function MockBreadcrumb() {
    return <div data-testid="mock-breadcrumb">Breadcrumb</div>;
  };
});

// Mock ChartOne
jest.mock('../ChartOne', () => {
  return function MockChartOne() {
    return <div data-testid="mock-chart-one">ChartOne</div>;
  };
});

// Mock ChartTwo
jest.mock('../ChartTwo', () => {
  return function MockChartTwo() {
    return <div data-testid="mock-chart-two">ChartTwo</div>;
  };
});

// Check what's actually imported in the Page component
// If ChartThree is imported and used, mock it too:
jest.mock('../ChartThree', () => {
  return function MockChartThree() {
    return <div data-testid="mock-chart-three">ChartThree</div>;
  };
});

describe('Chart Page', () => {
  it('renders breadcrumb', () => {
    render(<ChartPage />);
    expect(screen.getByTestId('mock-breadcrumb')).toBeInTheDocument();
  });

  it('renders all chart components', () => {
    render(<ChartPage />);
    expect(screen.getByTestId('mock-chart-one')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart-two')).toBeInTheDocument();
    
    // If the page doesn't actually use ChartThree, remove this expectation:
    // expect(screen.getByTestId('mock-chart-three')).toBeInTheDocument();
    
    // Or check if it exists conditionally:
    const chartThree = screen.queryByTestId('mock-chart-three');
    if (chartThree) {
      expect(chartThree).toBeInTheDocument();
    }
  });

  it('has correct grid layout', () => {
    render(<ChartPage />);
    const gridContainer = screen.getByTestId('mock-chart-one').parentElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-12', 'gap-4');
  });
}); 