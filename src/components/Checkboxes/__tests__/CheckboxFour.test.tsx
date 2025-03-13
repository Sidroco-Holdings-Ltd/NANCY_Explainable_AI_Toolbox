import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxFour from '../CheckboxFour';
import '@testing-library/jest-dom';

describe('CheckboxFour Component', () => {
  it('renders with unchecked state by default', () => {
    render(<CheckboxFour />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles checkbox state on click', () => {
    render(<CheckboxFour />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('applies correct styling when checked', () => {
    render(<CheckboxFour />);
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    const checkboxDiv = checkbox.parentElement?.querySelector('div');
    const dot = checkboxDiv?.querySelector('span');
    
    expect(checkboxDiv).toHaveClass('border-primary');
    expect(dot).toHaveClass('!bg-primary');
  });

  it('has rounded-full class for circular appearance', () => {
    render(<CheckboxFour />);
    const checkbox = screen.getByRole('checkbox');
    const checkboxDiv = checkbox.parentElement?.querySelector('div');
    
    expect(checkboxDiv).toHaveClass('rounded-full');
  });

  it('displays correct label text', () => {
    render(<CheckboxFour />);
    expect(screen.getByText('Checkbox Text')).toBeInTheDocument();
  });
}); 