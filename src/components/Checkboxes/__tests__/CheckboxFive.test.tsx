import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxFive from '../CheckboxFive';
import '@testing-library/jest-dom';

describe('CheckboxFive Component', () => {
  it('renders with unchecked state by default', () => {
    render(<CheckboxFive />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles checkbox state on click', () => {
    render(<CheckboxFive />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('applies correct border styling when checked', () => {
    render(<CheckboxFive />);
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    const checkboxDiv = checkbox.parentElement?.querySelector('div');
    
    expect(checkboxDiv).toHaveClass('!border-4');
  });

  it('has box and rounded-full classes for appearance', () => {
    render(<CheckboxFive />);
    const checkbox = screen.getByRole('checkbox');
    const checkboxDiv = checkbox.parentElement?.querySelector('div');
    
    expect(checkboxDiv).toHaveClass('box', 'rounded-full');
  });

  it('displays correct label text', () => {
    render(<CheckboxFive />);
    expect(screen.getByText('Checkbox Text')).toBeInTheDocument();
  });
}); 