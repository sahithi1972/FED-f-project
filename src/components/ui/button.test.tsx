import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';
import { vi } from 'vitest';

describe('Button', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary');

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('border');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText('Ghost')).toHaveClass('hover:bg-accent');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    expect(screen.getByText('Default')).toHaveClass('h-10 px-4 py-2');

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('h-9 rounded-md px-3');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('h-11 rounded-md px-8');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByText('Icon')).toHaveClass('h-10 w-10');
  });
});