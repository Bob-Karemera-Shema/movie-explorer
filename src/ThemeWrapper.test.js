import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import Navbar from './components/navbar/navbar.component';
import themeReducer from './store/themeSlice';
import ThemeWrapper from './ThemeWrapper';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<div id="theme-root" data-theme="light"></div>';
  });

  test('toggles theme and persists state', () => {
    const store = configureStore({ reducer: { theme: themeReducer } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeWrapper>
            <Navbar />
          </ThemeWrapper>
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getAllByRole('button').find(btn => btn.className.includes('toggle-theme-button'));
    const themeRoot = document.querySelector('#theme-root');

    expect(themeRoot).toHaveAttribute('data-theme', 'light');

    fireEvent.click(button);
    expect(themeRoot).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(button);
    expect(themeRoot).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
