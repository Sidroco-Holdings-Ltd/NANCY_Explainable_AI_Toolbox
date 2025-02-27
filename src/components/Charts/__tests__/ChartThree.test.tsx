import { render, screen } from '@testing-library/react';
import ChartThree from '../ChartThree';
import '@testing-library/jest-dom';

jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-donut-chart">Donut Chart</div>
}));

describe('ChartThree Component', () => {
  it('renders donut chart', () => {
    render(<ChartThree />);
    expect(screen.getByTestId('mock-donut-chart')).toBeInTheDocument();
  });

  it('displays chart legend items', () => {
    render(<ChartThree />);
    expect(screen.getByText(/Desktop/)).toBeInTheDocument();
    expect(screen.getByText(/Tablet/)).toBeInTheDocument();
    expect(screen.getByText(/Mobile/)).toBeInTheDocument();
  });

  it('shows correct percentages', () => {
    render(<ChartThree />);
    expect(screen.getByText(/65%/)).toBeInTheDocument();
    expect(screen.getByText(/34%/)).toBeInTheDocument();
    expect(screen.getByText(/45%/)).toBeInTheDocument();
  });

  it('has correct styling for legend items', () => {
    render(<ChartThree />);
    const legendItems = screen.getAllByTestId('legend-item');
    legendItems.forEach(item => {
      expect(item).toHaveClass('flex', 'w-full', 'items-center');
    });
  });
}); 