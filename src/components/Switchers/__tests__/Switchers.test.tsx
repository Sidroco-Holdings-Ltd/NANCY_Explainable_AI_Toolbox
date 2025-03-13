import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SwitcherOne from '../SwitcherOne';
import SwitcherThree from '../SwitcherThree';
import SwitcherFour from '../SwitcherFour';
import '@testing-library/jest-dom';

describe('Switcher Components', () => {
  // Test that all switchers have the same basic functionality
  describe('Common functionality across all switchers', () => {
    const switchers = [
      { name: 'SwitcherOne', Component: SwitcherOne, id: 'toggle1' },
      { name: 'SwitcherThree', Component: SwitcherThree, id: 'toggle3' },
      { name: 'SwitcherFour', Component: SwitcherFour, id: 'toggle4' }
    ];
    
    test.each(switchers)('$name starts with checkbox unchecked', ({ Component, id }) => {
      render(<Component />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', id);
      expect(checkbox).not.toBeChecked();
    });
    
    test.each(switchers)('$name toggles state when clicked', ({ Component }) => {
      render(<Component />);
      const checkbox = screen.getByRole('checkbox');
      
      // Toggle on
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      
      // Toggle off
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
    
    // Basic accessibility test that doesn't rely on htmlFor
    test.each(switchers)('$name uses sr-only for accessibility', ({ Component }) => {
      render(<Component />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('sr-only');
    });
  });
  
  // Test specific characteristics of each switcher
  
  describe('SwitcherOne specific styles', () => {
    test('has correct background colors', () => {
      render(<SwitcherOne />);
      const track = screen.getByRole('checkbox').parentElement?.querySelector('div:nth-child(2)');
      expect(track).toHaveClass('bg-meta-9');
    });
  });
  
  describe('SwitcherThree specific features', () => {
    test('displays different icons based on state', () => {
      render(<SwitcherThree />);
      const checkbox = screen.getByRole('checkbox');
      const dot = screen.getByTestId('dot');
      
      // Initial state should show X icon
      const checkIcon = dot.querySelector('span:first-child');
      const xIcon = dot.querySelector('span:last-child');
      expect(checkIcon).toHaveClass('hidden');
      expect(xIcon).not.toHaveClass('hidden');
      
      // After toggle should show check icon
      fireEvent.click(checkbox);
      expect(checkIcon).toHaveClass('!block');
      expect(xIcon).toHaveClass('hidden');
    });
  });
  
  describe('SwitcherFour specific styles', () => {
    test('has black background for track', () => {
      render(<SwitcherFour />);
      const track = screen.getByRole('checkbox').parentElement?.querySelector('div:nth-child(2)');
      expect(track).toHaveClass('bg-black');
    });
  });
}); 