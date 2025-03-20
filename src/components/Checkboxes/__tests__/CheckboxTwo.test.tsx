import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxTwo from '../CheckboxTwo';
import '@testing-library/jest-dom';

describe('CheckboxTwo Component', () => {
  it('renders with unchecked state by default', () => {
    render(<CheckboxTwo />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles checkbox state on click', () => {
    render(<CheckboxTwo />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('applies correct styling when checked', () => {
    render(<CheckboxTwo />);
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    const checkboxDiv = checkbox.parentElement?.querySelector('div');
    expect(checkboxDiv).toHaveClass('border-primary', 'bg-gray');
  });

  it('shows checkmark icon when checked', () => {
    render(<CheckboxTwo />);
    const checkbox = screen.getByRole('checkbox');
    
    // Initially checkmark should be invisible
    const span = screen.getByRole('checkbox').parentElement?.querySelector('span');
    expect(span).toHaveClass('opacity-0');
    
    // After checking, the checkmark should be visible
    fireEvent.click(checkbox);
    expect(span).toHaveClass('!opacity-100');
  });

  it('displays correct label text', () => {
    render(<CheckboxTwo />);
    expect(screen.getByText('Checkbox Text')).toBeInTheDocument();
  });
}); 