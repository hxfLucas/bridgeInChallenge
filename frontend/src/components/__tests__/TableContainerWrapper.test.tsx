import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import TableContainerWrapper from '../TableContainerWrapper';

describe('TableContainerWrapper', () => {
  it('renders without crashing', () => {
    render(<TableContainerWrapper data-testid="wrapper" />);
    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
  });

  it('forwards ref to the underlying DOM element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<TableContainerWrapper ref={ref} data-testid="wrapper" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('wrapper').closest('[data-testid="wrapper"]'));
  });

  it('passes children through', () => {
    render(
      <TableContainerWrapper>
        <span data-testid="child">hello</span>
      </TableContainerWrapper>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('hello');
  });

  it('displayName equals "TableContainerWrapper"', () => {
    expect(TableContainerWrapper.displayName).toBe('TableContainerWrapper');
  });

  it('forwards extra props (e.g. data-testid) to the underlying element', () => {
    render(<TableContainerWrapper data-testid="my-wrapper" />);
    expect(screen.getByTestId('my-wrapper')).toBeInTheDocument();
  });
});
