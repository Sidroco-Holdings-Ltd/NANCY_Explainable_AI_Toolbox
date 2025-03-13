import { render, screen } from '@testing-library/react';
import HomePage from '../MainPage'; // Note: Component is named HomePage but file is MainPage.tsx
import '@testing-library/jest-dom';

describe('MainPage Component', () => {
  it('renders welcome header', () => {
    render(<HomePage />);
    expect(screen.getByText('Welcome to Your Dashboard')).toBeInTheDocument();
  });

  it('renders feature sections', () => {
    render(<HomePage />);
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('renders Why Choose Us section', () => {
    render(<HomePage />);
    expect(screen.getByText('Why Choose Us?')).toBeInTheDocument();
  });

  it('renders all placeholder images', () => {
    render(<HomePage />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(3);
    
    expect(images[0]).toHaveAttribute('alt', 'Feature 1');
    expect(images[1]).toHaveAttribute('alt', 'Feature 2');
    expect(images[2]).toHaveAttribute('alt', 'Feature 3');
  });

  it('applies animation classes', () => {
    render(<HomePage />);
    const welcomeHeader = screen.getByText('Welcome to Your Dashboard');
    expect(welcomeHeader).toHaveClass('animate-fade-in');
    
    const whyChooseUs = screen.getByText('Why Choose Us?');
    expect(whyChooseUs).toHaveClass('animate-fade-in');
  });

  it('has hover effects on feature cards', () => {
    render(<HomePage />);
    const featureCards = screen.getAllByText(/Feature \d/).map(element => 
      element.closest('div')
    );
    
    featureCards.forEach(card => {
      expect(card).toHaveClass('hover:scale-105');
      expect(card).toHaveClass('hover:shadow-xl');
    });
  });
}); 