import { render, screen } from '@testing-library/react';
import ChartOne from '../ChartOne';
import '@testing-library/jest-dom';

// Mock require.context
const mockContext = {
  keys: () => ['/test1.png', '/test2.png'],
  default: (key: string) => ({
    default: {
      src: key,
      height: 100,
      width: 100
    }
  })
};

// Mock require
(global as any).require = {
  context: () => mockContext
};

describe('ChartOne Component', () => {
  it('renders chart container', () => {
    render(<ChartOne />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<ChartOne />);
    const container = screen.getByRole('img').parentElement?.parentElement;
    expect(container).toHaveClass('col-span-12', 'rounded-sm', 'border');
  });

  it('loads and displays all images', async () => {
    render(<ChartOne />);
    const images = await screen.findAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('applies correct image styling', () => {
    render(<ChartOne />);
    const image = screen.getByRole('img');
    expect(image).toHaveClass('h-full', 'w-full', 'rounded-sm', 'object-cover');
  });

  it('normalizes image filenames', () => {
    render(<ChartOne />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('/test1.png'));
  });
}); 