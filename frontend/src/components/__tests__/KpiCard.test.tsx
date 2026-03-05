import React from 'react';
import { render, screen } from '@testing-library/react';
import KpiCard from '../KpiCard';

vi.mock('../KpiIcon', () => ({
  default: ({ iconName, alt }: { iconName: string; alt?: string }) => (
    <img src={`/src/assets/icons/${iconName}.svg`} alt={alt ?? iconName} />
  ),
}));

vi.mock('../KpiCard.module.css', () => ({ default: {} }));

describe('KpiCard', () => {
  it('renders the title', () => {
    render(<KpiCard title="Reports" value="42" iconName="reports" />);
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<KpiCard title="Reports" value="42" iconName="reports" />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders no ▲ or ▼ when delta is undefined', () => {
    render(<KpiCard title="Reports" value="42" iconName="reports" />);
    expect(screen.queryByText(/[▲▼]/)).not.toBeInTheDocument();
  });

  it('positive delta=5 renders ▲ +5%', () => {
    render(<KpiCard title="Reports" value="42" delta={5} iconName="reports" />);
    expect(screen.getByText('▲ +5%')).toBeInTheDocument();
  });

  it('negative delta=-3 renders ▼ -3%', () => {
    render(<KpiCard title="Reports" value="42" delta={-3} iconName="reports" />);
    expect(screen.getByText('▼ -3%')).toBeInTheDocument();
  });

  it('delta=0 renders ▼ 0% (zero is not positive)', () => {
    render(<KpiCard title="Reports" value="42" delta={0} iconName="reports" />);
    expect(screen.getByText('▼ 0%')).toBeInTheDocument();
  });

  it('KpiIcon receives correct iconName (checked via alt attribute)', () => {
    render(<KpiCard title="Reports" value="42" iconName="reports" />);
    expect(screen.getByAltText('Reports icon')).toBeInTheDocument();
  });

  it('renders value as a number type without errors', () => {
    render(<KpiCard title="Total" value={100} iconName="total" />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
