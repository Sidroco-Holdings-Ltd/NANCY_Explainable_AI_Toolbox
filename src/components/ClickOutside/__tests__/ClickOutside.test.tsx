import { render, screen, fireEvent } from '@testing-library/react';
import ClickOutside from '../ClickOutside';
import '@testing-library/jest-dom';

describe('ClickOutside Component', () => {
  const mockOnClick = jest.fn();
  
  beforeEach(() => {
    // Clear the mock before each test
    mockOnClick.mockClear();
  });
  
  it('renders children correctly', () => {
    render(
      <ClickOutside onClick={mockOnClick}>
        <div data-testid="child-element">Test Content</div>
      </ClickOutside>
    );
    
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('does not call onClick when clicking inside the component', () => {
    render(
      <ClickOutside onClick={mockOnClick}>
        <div data-testid="child-element">Test Content</div>
      </ClickOutside>
    );
    
    // Click inside the component
    fireEvent.mouseDown(screen.getByTestId('child-element'));
    
    // Verify onClick was not called
    expect(mockOnClick).not.toHaveBeenCalled();
  });
  
  it('calls onClick when clicking outside the component', () => {
    render(
      <div>
        <div data-testid="outside-element">Outside Content</div>
        <ClickOutside onClick={mockOnClick}>
          <div data-testid="child-element">Test Content</div>
        </ClickOutside>
      </div>
    );
    
    // Click outside the component
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    
    // Verify onClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  it('removes event listener when unmounted', () => {
    // Spy on document.addEventListener and removeEventListener
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(
      <ClickOutside onClick={mockOnClick}>
        <div>Test Content</div>
      </ClickOutside>
    );
    
    // Verify event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    
    // Unmount the component
    unmount();
    
    // Verify event listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    
    // Restore the original methods
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
  
  it('handles multiple instances correctly', () => {
    const mockOnClick2 = jest.fn();
    
    render(
      <div>
        <div data-testid="outside-element">Outside Content</div>
        <ClickOutside onClick={mockOnClick}>
          <div data-testid="child-element-1">Content 1</div>
        </ClickOutside>
        <ClickOutside onClick={mockOnClick2}>
          <div data-testid="child-element-2">Content 2</div>
        </ClickOutside>
      </div>
    );
    
    // Click outside both components
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    
    // Verify both onClick callbacks were called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick2).toHaveBeenCalledTimes(1);
    
    // Click on first component
    mockOnClick.mockClear();
    mockOnClick2.mockClear();
    fireEvent.mouseDown(screen.getByTestId('child-element-1'));
    
    // Verify only the second onClick was called
    expect(mockOnClick).not.toHaveBeenCalled();
    expect(mockOnClick2).toHaveBeenCalledTimes(1);
  });
}); 