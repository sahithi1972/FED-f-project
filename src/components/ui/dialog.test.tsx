import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './dialog';
import { Button } from './button';

describe('Dialog', () => {
  it('opens when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
        </DialogContent>
      </Dialog>
    );

    // Dialog content should not be visible initially
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Dialog Description')).not.toBeInTheDocument();
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();

    // Click the trigger button
    fireEvent.click(screen.getByText('Open'));

    // Dialog content should now be visible
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Description')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('closes when close button is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Open the dialog
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();

    // Close the dialog
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
  });

  it('handles onOpenChange callback', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Close by clicking outside
    fireEvent.click(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('can be controlled externally', () => {
    const { rerender } = render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();

    rerender(
      <Dialog open={false}>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
  });

  it('applies custom className to dialog parts', () => {
    render(
      <Dialog>
        <DialogTrigger className="custom-trigger">Open</DialogTrigger>
        <DialogContent className="custom-content">
          <DialogHeader className="custom-header">
            <DialogTitle className="custom-title">Title</DialogTitle>
            <DialogDescription className="custom-desc">Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByText('Title')).toHaveClass('custom-title');
    expect(screen.getByText('Description')).toHaveClass('custom-desc');
    const content = screen.getByRole('dialog');
    expect(content).toHaveClass('custom-content');
  });
});