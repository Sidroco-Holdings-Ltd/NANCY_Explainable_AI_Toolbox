import { render, screen } from '@testing-library/react';
import LogoLoader from '../LogoLoader';
import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img 
      src={typeof src === 'object' ? '/mocked-logo.png' : src}
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
      data-testid="logo-image" 
    />
  ),
}));

describe('LogoLoader Component', () => {
  it('renders without crashing', () => {
    render(<LogoLoader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders logo image with correct properties', () => {
    render(<LogoLoader />);
    const logoImage = screen.getByTestId('logo-image');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('alt', 'Loading...');
    expect(logoImage).toHaveAttribute('width', '150');
    expect(logoImage).toHaveAttribute('height', '150');
  });

  it('applies animate-spin class to logo', () => {
    render(<LogoLoader />);
    const logoImage = screen.getByTestId('logo-image');
    expect(logoImage.className).toContain('animate-spin');
  });

  it('centers content on screen', () => {
    render(<LogoLoader />);
    const containerDiv = screen.getByText('Loading...').closest('div')?.parentElement;
    expect(containerDiv).toHaveClass('flex');
    expect(containerDiv).toHaveClass('items-center');
    expect(containerDiv).toHaveClass('justify-center');
  });
}); 