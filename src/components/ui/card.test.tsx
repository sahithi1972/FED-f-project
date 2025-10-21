import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';

describe('Card', () => {
  it('renders card with all its parts', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('applies custom className to each part', () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Title</CardTitle>
          <CardDescription className="custom-desc">Description</CardDescription>
        </CardHeader>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title').parentElement).toHaveClass('custom-header');
    expect(screen.getByText('Title')).toHaveClass('custom-title');
    expect(screen.getByText('Description')).toHaveClass('custom-desc');
    expect(screen.getByText('Content')).toHaveClass('custom-content');
    expect(screen.getByText('Footer')).toHaveClass('custom-footer');
  });

  it('forwards refs to each component', () => {
    const ref = { current: null };
    render(
      <Card ref={ref}>
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders children correctly', () => {
    render(
      <Card>
        <div data-testid="custom-child">Custom Child</div>
      </Card>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});