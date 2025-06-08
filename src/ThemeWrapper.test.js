import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import Navbar from './components/navbar/navbar.component';
import themeReducer from './store/themeSlice';
import ThemeWrapper from './ThemeWrapper';

describe('ThemeToggle', () => {
  test('theme toggle button should change theme and change theme wrapper id', () => {
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

    // find the button however it’s exposed in your markup
    const button = screen.getAllByRole('button').find(btn => btn.className.includes('toggle-theme-button'));
    expect(button).toBeInTheDocument();

    const themeRoot = screen.getByTestId('theme-root');
    expect(themeRoot).toHaveAttribute('data-theme', 'light');

    fireEvent.click(button);
    expect(themeRoot).toHaveAttribute('data-theme', 'dark');

    fireEvent.click(button);
    expect(themeRoot).toHaveAttribute('data-theme', 'light');
  });
});
