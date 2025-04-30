import { render, screen } from '@testing-library/react';
import Breadcrumb from '../Breadcrumb';
import '@testing-library/jest-dom';

describe('Breadcrumb Component', () => {
  it('renders page name correctly', () => {
    render(<Breadcrumb pageName="Test Page" />);
    expect(screen.getByRole('heading', { name: 'Test Page' })).toBeInTheDocument();
  });

  it('renders dashboard link', () => {
    render(<Breadcrumb pageName="Test Page" />);
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/');
  });

  it('has correct styling classes', () => {
    render(<Breadcrumb pageName="Test Page" />);
    const container = screen.getByRole('navigation').parentElement;
    expect(container).toHaveClass('mb-6', 'flex', 'flex-col', 'gap-3');
  });
}); 