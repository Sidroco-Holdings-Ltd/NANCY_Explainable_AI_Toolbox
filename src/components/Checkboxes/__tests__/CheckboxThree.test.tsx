import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxThree from '../CheckboxThree';
import '@testing-library/jest-dom';

describe('CheckboxThree Component', () => {
  it('renders with unchecked state by default', () => {
    render(<CheckboxThree />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles checkbox state on click', () => {
    render(<CheckboxThree />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('applies correct styling when checked', () => {
    render(<CheckboxThree />);
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    const checkboxDiv = checkbox.parentElement?.querySelector('div');
    expect(checkboxDiv).toHaveClass('border-primary', 'bg-gray');
  });

  it('shows X icon when checked', () => {
    render(<CheckboxThree />);
    const checkbox = screen.getByRole('checkbox');
    
    // Initially X icon should be invisible
    const span = screen.getByRole('checkbox').parentElement?.querySelector('span');
    expect(span).toHaveClass('opacity-0');
    
    // After checking, the X icon should be visible
    fireEvent.click(checkbox);
    expect(span).toHaveClass('!opacity-100');
  });

  it('displays correct label text', () => {
    render(<CheckboxThree />);
    expect(screen.getByText('Checkbox Text')).toBeInTheDocument();
  });
}); 