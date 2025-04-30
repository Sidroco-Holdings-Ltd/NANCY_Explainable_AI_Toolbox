import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxOne from '../CheckboxOne';
import '@testing-library/jest-dom';

describe('CheckboxOne Component', () => {
  it('toggles checkbox state on click', () => {
    render(<CheckboxOne />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('applies correct styling when checked', () => {
    render(<CheckboxOne />);
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    const checkboxDiv = checkbox.parentElement?.querySelector('div');
    expect(checkboxDiv).toHaveClass('border-primary', 'bg-gray');
  });
}); 