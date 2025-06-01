import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the placeholder text', () => {
    render(<App />);
    expect(screen.getByText('App container placeholder')).toBeInTheDocument();
  });
});
