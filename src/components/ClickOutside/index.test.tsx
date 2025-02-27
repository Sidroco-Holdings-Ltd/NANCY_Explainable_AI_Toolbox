import { render, fireEvent } from '@testing-library/react';
import ClickOutside from '../ClickOutside';
import '@testing-library/jest-dom';

describe('ClickOutside Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('calls onClick when clicking outside', () => {
    render(
      <div>
        <ClickOutside onClick={mockOnClick}>
          <div>Inside Content</div>
        </ClickOutside>
        <div>Outside Content</div>
      </div>
    );

    fireEvent.mouseDown(document.body);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('does not call onClick when clicking inside', () => {
    const { getByText } = render(
      <ClickOutside onClick={mockOnClick}>
        <div>Inside Content</div>
      </ClickOutside>
    );

    fireEvent.mouseDown(getByText('Inside Content'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });
}); 