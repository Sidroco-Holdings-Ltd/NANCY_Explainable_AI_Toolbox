import { render, screen, fireEvent } from '@testing-library/react';
import SwitcherFour from '../SwitcherFour';
import '@testing-library/jest-dom';

describe('SwitcherFour Component', () => {
  it('renders with initial state', () => {
    render(<SwitcherFour />);
    const toggle = screen.getByRole('checkbox');
    expect(toggle).not.toBeChecked();
  });

  it('toggles state on click', () => {
    render(<SwitcherFour />);
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  it('applies correct styling when toggled', () => {
    render(<SwitcherFour />);
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);
    const indicator = toggle.parentElement?.querySelector('div:last-child');
    expect(indicator).toHaveClass('!right-1', '!translate-x-full');
  });
}); 