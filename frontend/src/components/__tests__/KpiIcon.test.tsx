import React from 'react';
import { render, screen } from '@testing-library/react';
import KpiIcon from '../KpiIcon';

vi.mock('../KpiCard.module.css', () => ({ default: { icon: 'icon' } }));

describe('KpiIcon', () => {
  it('renders an <img> element', () => {
    render(<KpiIcon iconName="reports" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('src is /src/assets/icons/reports.svg for iconName="reports"', () => {
    render(<KpiIcon iconName="reports" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/src/assets/icons/reports.svg');
  });

  it('uses provided alt prop when supplied', () => {
    render(<KpiIcon iconName="reports" alt="My custom alt" />);
    expect(screen.getByAltText('My custom alt')).toBeInTheDocument();
  });

  it('falls back to iconName when alt is not supplied', () => {
    render(<KpiIcon iconName="users" />);
    expect(screen.getByAltText('users')).toBeInTheDocument();
  });

  it('default width and height are 36', () => {
    render(<KpiIcon iconName="reports" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '36');
    expect(img).toHaveAttribute('height', '36');
  });

  it('custom size prop overrides both width and height', () => {
    render(<KpiIcon iconName="reports" size={48} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '48');
    expect(img).toHaveAttribute('height', '48');
  });
});
