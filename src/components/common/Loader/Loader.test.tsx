import { render, screen } from '@testing-library/react';
import Loader from '../Loader';
import '@testing-library/jest-dom';

describe('Loader Component', () => {
  it('renders with correct styling', () => {
    render(<Loader />);
    const loader = screen.getByTestId('loader');
    expect(loader).toHaveClass('animate-spin');
  });

  it('renders in dark mode', () => {
    render(<Loader />);
    const container = screen.getByTestId('loader-container');
    expect(container).toHaveClass('dark:bg-black');
  });
}); 