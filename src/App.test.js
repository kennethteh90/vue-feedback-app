import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('Welcome to our feedback system')).toBeTruthy();
  });

  it('shows empty state when no orders', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Nothing here yet!/)).toBeTruthy();
  });
});