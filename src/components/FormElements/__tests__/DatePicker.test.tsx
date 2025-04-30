import { render, screen, fireEvent } from '@testing-library/react';
import DatePickerOne from '../DatePicker/DatePickerOne';
import DatePickerTwo from '../DatePicker/DatePickerTwo';
import '@testing-library/jest-dom';

jest.mock('flatpickr', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('DatePicker Components', () => {
  it('renders DatePickerOne with correct label', () => {
    render(<DatePickerOne />);
    expect(screen.getByText('Date picker')).toBeInTheDocument();
  });

  it('renders DatePickerTwo with correct label', () => {
    render(<DatePickerTwo />);
    expect(screen.getByText('Select date')).toBeInTheDocument();
  });

  it('renders input with correct placeholder', () => {
    render(<DatePickerOne />);
    expect(screen.getByPlaceholderText('mm/dd/yyyy')).toBeInTheDocument();
  });
}); 