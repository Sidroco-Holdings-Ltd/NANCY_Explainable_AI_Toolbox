import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Error404Page from '../error-404';

describe('Error404Page Component', () => {
  beforeEach(() => {
    render(<Error404Page />);
  });

  test('renders the 404 status code', () => {
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  test('renders the error message', () => {
    // Check for the heading
    expect(screen.getByText('Data not found')).toBeInTheDocument();
    
    // Check for part of the error message text
    expect(screen.getByText(/data folder/)).toBeInTheDocument();
  });

  test('renders a link to go back home', () => {
    const homeLink = screen.getByText('Go back home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/dashboard/brand');
  });

  test('renders with proper styling classes', () => {
    // Check main container styling
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('min-h-full');
    expect(mainElement).toHaveClass('grid');
    expect(mainElement).toHaveClass('place-items-center');
    
    // Check status code styling
    const statusCode = screen.getByText('404');
    expect(statusCode).toHaveClass('text-indigo-600');
    expect(statusCode).toHaveClass('font-semibold');
    
    // Check button styling
    const homeLink = screen.getByText('Go back home');
    expect(homeLink).toHaveClass('bg-indigo-600');
    expect(homeLink).toHaveClass('text-white');
    expect(homeLink).toHaveClass('rounded-md');
  });
}); 