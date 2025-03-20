import { render, screen, fireEvent } from '@testing-library/react';
import ChartTwo from '../ChartTwo';
import '@testing-library/jest-dom';

// Mock react-apexcharts and dynamic import
jest.mock('next/dynamic', () => () => {
  return function DynamicComponent(props: any) {
    // Save the props so we can check if functions are called
    (global as any).lastApexChartProps = props;
    return <div data-testid="mock-chart" className="mock-chart">Mock Chart</div>;
  };
});

// Mock apexcharts library
jest.mock('apexcharts', () => {
  return function MockApexCharts() {
    return {
      render: jest.fn()
    };
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

  it('allows selecting different time periods', () => {
    render(<ChartTwo />);
    const select = screen.getByRole('combobox');
    
    // Change selection to "Last Week"
    fireEvent.change(select, { target: { value: 'last-week' } });
    
    // Verify the selection changed
    expect((select as HTMLSelectElement).value).toBe('last-week');
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
  
  it('passes correct series data to chart', () => {
    render(<ChartTwo />);
    
    // Verify the chart received the correct series data
    const chartProps = (global as any).lastApexChartProps;
    expect(chartProps).toBeDefined();
    expect(chartProps.series).toHaveLength(2);
    expect(chartProps.series[0].name).toBe('Sales');
    expect(chartProps.series[1].name).toBe('Revenue');
  });

  // This test will help increase function coverage
  it('renders with correct chart options', () => {
    render(<ChartTwo />);
    
    // Extract the chart options from the mock component
    const chartProps = (global as any).lastApexChartProps;
    
    // Verify chart options
    expect(chartProps.options).toBeDefined();
    expect(chartProps.options.colors).toEqual(["#3C50E0", "#80CAEE"]);
    expect(chartProps.options.chart.type).toBe("bar");
    expect(chartProps.options.chart.stacked).toBe(true);
  });
}); 