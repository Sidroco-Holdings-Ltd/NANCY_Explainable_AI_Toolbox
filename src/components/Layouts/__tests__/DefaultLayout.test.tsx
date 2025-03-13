import { render, screen } from '@testing-library/react';
import DefaultLayout from '../DefaultLayout';
import '@testing-library/jest-dom';

// Mock the Sidebar and Header components
jest.mock('@/components/Sidebar', () => {
  return function MockSidebar({ sidebarOpen, setSidebarOpen }: any) {
    return (
      <div data-testid="sidebar" data-sidebar-open={sidebarOpen}>
        Sidebar Component
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>Toggle Sidebar</button>
      </div>
    );
  };
});

jest.mock('@/components/Header', () => {
  return function MockHeader({ sidebarOpen, setSidebarOpen }: any) {
    return (
      <div data-testid="header" data-sidebar-open={sidebarOpen}>
        Header Component
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>Toggle Sidebar</button>
      </div>
    );
  };
});

describe('DefaultLayout Component', () => {
  it('renders without crashing', () => {
    render(
      <DefaultLayout>
        <div data-testid="test-children">Test Content</div>
      </DefaultLayout>
    );
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  it('initializes sidebar as closed', () => {
    render(
      <DefaultLayout>
        <div>Test Content</div>
      </DefaultLayout>
    );
    
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-sidebar-open', 'false');
  });

  it('passes the same sidebarOpen state to both Header and Sidebar', () => {
    render(
      <DefaultLayout>
        <div>Test Content</div>
      </DefaultLayout>
    );
    
    const sidebar = screen.getByTestId('sidebar');
    const header = screen.getByTestId('header');
    
    // Both should have the same initial value (false)
    expect(sidebar).toHaveAttribute('data-sidebar-open', 'false');
    expect(header).toHaveAttribute('data-sidebar-open', 'false');
  });

  it('wraps children in main content area with proper styling', () => {
    render(
      <DefaultLayout>
        <div data-testid="test-children">Test Content</div>
      </DefaultLayout>
    );
    
    // Check that children are inside the main tag
    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByTestId('test-children'));
    
    // Find the div inside main that contains the children
    const contentWrapper = main.firstChild as HTMLElement;
    expect(contentWrapper).toHaveClass('mx-auto');
    expect(contentWrapper).toHaveClass('max-w-screen-2xl');
    expect(contentWrapper).toHaveClass('p-4');
  });

  it('has correct layout structure', () => {
    render(
      <DefaultLayout>
        <div>Test Content</div>
      </DefaultLayout>
    );
    
    // The outer wrapper should be a flex container
    const pageWrapper = screen.getByTestId('sidebar').parentElement;
    expect(pageWrapper).toHaveClass('flex');
    
    // The content area should have flex-1 to take remaining space
    const contentArea = screen.getByRole('main').parentElement;
    expect(contentArea).toHaveClass('flex-1');
    expect(contentArea).toHaveClass('lg:ml-72.5'); // Sidebar width offset
  });
}); 