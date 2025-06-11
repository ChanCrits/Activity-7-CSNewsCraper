import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders news scraper title', () => {
  render(<App />);
  const titleElement = screen.getByText(/News Scraper/i);
  expect(titleElement).toBeInTheDocument();
});
