import { render, screen } from '@testing-library/react';
import TableFour from '../TableFour';
import '@testing-library/jest-dom';

jest.mock('../Dropdowns/DropdownDefault', () => {
  return function MockDropdown() {
    return <div data-testid="mock-dropdown">Dropdown</div>;
  };
});

describe('TableFour Component', () => {
  const mockData = {
    headers: ['Name', 'Value', 'Status'],
    rows: [
      { name: 'Test 1', value: '100', status: 'Active' },
      { name: 'Test 2', value: '200', status: 'Inactive' }
    ]
  };

  it('renders table headers', () => {
    render(<TableFour data={mockData} />);
    mockData.headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders table rows', () => {
    render(<TableFour data={mockData} />);
    mockData.rows.forEach(row => {
      expect(screen.getByText(row.name)).toBeInTheDocument();
      expect(screen.getByText(row.value)).toBeInTheDocument();
      expect(screen.getByText(row.status)).toBeInTheDocument();
    });
  });

  it('applies correct styling to table', () => {
    render(<TableFour data={mockData} />);
    const table = screen.getByRole('table');
    expect(table).toHaveClass('w-full');
  });

  it('handles empty data gracefully', () => {
    render(<TableFour data={{ headers: [], rows: [] }} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
}); 