import { render, screen, fireEvent } from '@testing-library/react';
import ChartTwo from '../ChartTwo';
import '@testing-library/jest-dom';

// Mock react-apexcharts and dynamic import
jest.mock('next/dynamic', () => () => {
  return function DynamicComponent(props: any) {
    return <div data-testid="mock-chart" className="mock-chart">Mock Chart</div>;
  };
});

describe('ChartTwo Component', () => {
  it('renders chart container', () => {
    render(<ChartTwo />);
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
  });

  it('renders chart title', () => {
    render(<ChartTwo />);
    expect(screen.getByText('Profit this week')).toBeInTheDocument();
  });

  it('renders select dropdown with period options', () => {
    render(<ChartTwo />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    // Check for dropdown options
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('This Week');
    expect(options[1]).toHaveTextContent('Last Week');
  });

  it('has default period selected as "This Week"', () => {
    render(<ChartTwo />);
    const select = screen.getByRole('combobox');
    const selectedOption = select.querySelector('option:checked');
    expect(selectedOption).toHaveTextContent('This Week');
  });

  it('has correct styling classes', () => {
    render(<ChartTwo />);
    // Check for the main container
    const container = screen.getByTestId('chart-two-container');
    expect(container).toHaveClass('col-span-12', 'rounded-sm', 'border', 'border-stroke', 'bg-white');
  });
}); 