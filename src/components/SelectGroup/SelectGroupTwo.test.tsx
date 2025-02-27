import { render, screen, fireEvent } from '@testing-library/react';
import SelectGroupTwo from '../SelectGroupTwo';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('SelectGroupTwo Component', () => {
  const mockPhotos = jest.fn(() => [[
    { name: 'test1', path: '/images/test1.png' },
    { name: 'test2', path: '/images/test2.png' }
  ], 1, ['/test1.json', '/test2.json']]);

  it('renders dropdown with correct initial state', () => {
    render(<SelectGroupTwo photos={mockPhotos} isLoading={false} />);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('shows options when clicked', () => {
    render(<SelectGroupTwo photos={mockPhotos} isLoading={false} />);
    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByText('test1')).toBeInTheDocument();
  });

  it('handles search functionality', () => {
    render(<SelectGroupTwo photos={mockPhotos} isLoading={false} />);
    fireEvent.click(screen.getByText('Select'));
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test1' } });
    expect(screen.getByText('test1')).toBeInTheDocument();
    expect(screen.queryByText('test2')).not.toBeInTheDocument();
  });
}); 