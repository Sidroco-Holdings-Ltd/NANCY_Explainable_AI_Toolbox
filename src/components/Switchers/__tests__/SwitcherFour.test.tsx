import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SwitcherFour from '../SwitcherFour';
import '@testing-library/jest-dom';

describe('SwitcherFour Component', () => {
  test('renders correctly in initial state', () => {
    render(<SwitcherFour />);
    
    // Check that the checkbox exists and is not checked initially
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    
    // The toggle handle should not have the transform class initially
    const handle = checkbox.parentElement?.querySelector('div:nth-child(3)');
    expect(handle).not.toHaveClass('!translate-x-full');
    expect(handle).not.toHaveClass('!right-1');
  });
  
  test('toggles state when clicked', () => {
    render(<SwitcherFour />);
    
    const checkbox = screen.getByRole('checkbox');
    const handle = checkbox.parentElement?.querySelector('div:nth-child(3)');
    
    // Initial state - not checked
    expect(checkbox).not.toBeChecked();
    expect(handle).not.toHaveClass('!translate-x-full');
    
    // Click the checkbox to toggle
    fireEvent.click(checkbox);
    
    // After toggle - should be checked
    expect(checkbox).toBeChecked();
    expect(handle).toHaveClass('!translate-x-full');
    expect(handle).toHaveClass('!right-1');
    
    // Toggle again
    fireEvent.click(checkbox);
    
    // Should be back to original state
    expect(checkbox).not.toBeChecked();
    expect(handle).not.toHaveClass('!translate-x-full');
    expect(handle).not.toHaveClass('!right-1');
  });
  
  test('can be toggled by clicking the label', () => {
    render(<SwitcherFour />);
    
    const label = screen.getByText('', { selector: 'label' });
    const checkbox = screen.getByRole('checkbox');
    
    // Initial state
    expect(checkbox).not.toBeChecked();
    
    // Click the label to toggle
    fireEvent.click(label);
    
    // After toggle - should be checked
    expect(checkbox).toBeChecked();
  });
  
  test('has black background color for the track', () => {
    render(<SwitcherFour />);
    
    const track = screen.getByRole('checkbox').parentElement?.querySelector('div:nth-child(2)');
    expect(track).toHaveClass('bg-black');
  });
}); 