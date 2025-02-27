import { render, screen } from '@testing-library/react';
import DefaultLayout from '../DefaultLayout';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/test'
}));

// Mock components
jest.mock('@/components/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

describe('DefaultLayout Component', () => {
  it('renders child content', () => {
    render(
      <DefaultLayout>
        <div>Test Content</div>
      </DefaultLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('has correct layout classes', () => {
    render(
      <DefaultLayout>
        <div>Test Content</div>
      </DefaultLayout>
    );
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('mx-auto', 'max-w-screen-2xl');
  });

  it('renders sidebar and header', () => {
    render(
      <DefaultLayout>
        <div>Test Content</div>
      </DefaultLayout>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
}); 