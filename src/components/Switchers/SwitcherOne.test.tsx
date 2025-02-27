import { render, screen, fireEvent } from '@testing-library/react';
import SwitcherOne from '../SwitcherOne';
import '@testing-library/jest-dom';

describe('SwitcherOne Component', () => {
  it('renders with initial state', () => {
    render(<SwitcherOne />);
    const toggle = screen.getByRole('checkbox');
    expect(toggle).not.toBeChecked();
  });

  it('toggles state on click', () => {
    render(<SwitcherOne />);
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  it('applies correct styling in dark mode', () => {
    render(<SwitcherOne />);
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);
    const indicator = toggle.parentElement?.querySelector('div:last-child');
    expect(indicator).toHaveClass('!bg-primary', 'dark:!bg-white');
  });
}); 