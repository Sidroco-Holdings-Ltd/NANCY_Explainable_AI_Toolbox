import React from 'react';
import { render, screen } from '@testing-library/react';
import TableThree from '../TableThree';
import '@testing-library/jest-dom';

describe('TableThree Component', () => {
  beforeEach(() => {
    render(<TableThree />);
  });

  test('renders the table headers correctly', () => {
    // Column headers
    expect(screen.getByText('Package')).toBeInTheDocument();
    expect(screen.getByText('Invoice date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
  
  test('renders all 4 packages correctly', () => {
    // Package names
    expect(screen.getByText('Free package')).toBeInTheDocument();
    expect(screen.getAllByText('Standard Package')).toHaveLength(2); // Appears twice
    expect(screen.getByText('Business Package')).toBeInTheDocument();
    
    // Invoice dates
    const invoiceDates = screen.getAllByText('Jan 13,2023');
    expect(invoiceDates).toHaveLength(4);
    
    // Prices
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getAllByText('$59')).toHaveLength(2);
    expect(screen.getByText('$99')).toBeInTheDocument();
  });
  
  test('displays correct status badges with appropriate styling', () => {
    // Check status text
    const paidBadges = screen.getAllByText('Paid');
    expect(paidBadges).toHaveLength(2);
    expect(screen.getByText('Unpaid')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    
    // Check status styling
    paidBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-success');
      expect(badge).toHaveClass('text-success');
    });
    
    const unpaidBadge = screen.getByText('Unpaid');
    expect(unpaidBadge).toHaveClass('bg-danger');
    expect(unpaidBadge).toHaveClass('text-danger');
    
    const pendingBadge = screen.getByText('Pending');
    expect(pendingBadge).toHaveClass('bg-warning');
    expect(pendingBadge).toHaveClass('text-warning');
  });
  
  test('renders action buttons for each row', () => {
    // Check for action button containers
    const rows = document.querySelectorAll('tbody tr');
    expect(rows.length).toBe(4); // Verify 4 rows
    
    // Each row should have at least one button in the actions column
    rows.forEach(row => {
      const actionsCell = row.querySelector('td:last-child');
      expect(actionsCell?.querySelectorAll('button').length).toBeGreaterThanOrEqual(1);
    });
  });
  
  test('has proper table structure and responsive design', () => {
    // Check for table element
    const table = document.querySelector('table');
    expect(table).toHaveClass('w-full');
    expect(table).toHaveClass('table-auto');
    
    // Check for header row styling
    const headerRow = document.querySelector('thead tr');
    expect(headerRow).toHaveClass('bg-gray-2');
    expect(headerRow).toHaveClass('text-left');
    
    // Check table is in a scrollable container
    const tableContainer = table?.parentElement;
    expect(tableContainer).toHaveClass('overflow-x-auto');
  });
}); 