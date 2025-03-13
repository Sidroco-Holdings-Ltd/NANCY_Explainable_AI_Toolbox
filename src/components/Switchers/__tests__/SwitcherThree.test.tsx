import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SwitcherThree from '../SwitcherThree';
import '@testing-library/jest-dom';

describe('SwitcherThree Component', () => {
  test('renders correctly in initial state', () => {
    render(<SwitcherThree />);
    
    // Check that the checkbox exists and is not checked initially
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    
    // The toggle handle (dot) should not have the transform class initially
    const handle = screen.getByTestId('dot') || checkbox.parentElement?.querySelector('.dot');
    expect(handle).not.toHaveClass('!translate-x-full');
    expect(handle).not.toHaveClass('!bg-primary');
    
    // The X icon should be visible, and the check icon should be hidden
    const checkIcon = handle?.querySelector('span:first-child');
    const xIcon = handle?.querySelector('span:last-child');
    expect(checkIcon).toHaveClass('hidden');
    expect(xIcon).not.toHaveClass('hidden');
  });
  
  test('toggles state and icons when clicked', () => {
    render(<SwitcherThree />);
    
    const checkbox = screen.getByRole('checkbox');
    const handle = screen.getByTestId('dot') || checkbox.parentElement?.querySelector('.dot');
    const checkIcon = handle?.querySelector('span:first-child');
    const xIcon = handle?.querySelector('span:last-child');
    
    // Initial state - not checked, X visible
    expect(checkbox).not.toBeChecked();
    expect(handle).not.toHaveClass('!translate-x-full');
    expect(checkIcon).toHaveClass('hidden');
    expect(xIcon).not.toHaveClass('hidden');
    
    // Click the checkbox to toggle
    fireEvent.click(checkbox);
    
    // After toggle - should be checked, check mark visible
    expect(checkbox).toBeChecked();
    expect(handle).toHaveClass('!translate-x-full');
    expect(handle).toHaveClass('!bg-primary');
    expect(checkIcon).toHaveClass('!block');
    expect(xIcon).toHaveClass('hidden');
    
    // Toggle again
    fireEvent.click(checkbox);
    
    // Should be back to original state
    expect(checkbox).not.toBeChecked();
    expect(handle).not.toHaveClass('!translate-x-full');
    expect(handle).not.toHaveClass('!bg-primary');
    expect(checkIcon).toHaveClass('hidden');
    expect(xIcon).not.toHaveClass('hidden');
  });
  
  test('can be toggled by clicking the label', () => {
    render(<SwitcherThree />);
    
    const label = screen.getByText('', { selector: 'label' });
    const checkbox = screen.getByRole('checkbox');
    
    // Initial state
    expect(checkbox).not.toBeChecked();
    
    // Click the label to toggle
    fireEvent.click(label);
    
    // After toggle - should be checked
    expect(checkbox).toBeChecked();
  });
}); 