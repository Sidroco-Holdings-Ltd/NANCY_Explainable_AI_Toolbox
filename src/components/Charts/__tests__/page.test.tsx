import { render, screen } from '@testing-library/react';
import Chart from '../page';
import '@testing-library/jest-dom';

jest.mock('@/components/Breadcrumbs/Breadcrumb', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-breadcrumb">Breadcrumb</div>
}));

jest.mock('@/components/Charts/ChartOne', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-chart-one">ChartOne</div>
}));

jest.mock('@/components/Charts/ChartTwo', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-chart-two">ChartTwo</div>
}));

jest.mock('@/components/Charts/ChartThree', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-chart-three">ChartThree</div>
}));

describe('Chart Page', () => {
  it('renders all chart components', () => {
    render(<Chart />);
    expect(screen.getByTestId('mock-breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart-one')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart-two')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart-three')).toBeInTheDocument();
  });

  it('has correct grid layout', () => {
    render(<Chart />);
    const gridContainer = screen.getByTestId('mock-chart-one').parentElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-12', 'gap-4');
  });
}); 