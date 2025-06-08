import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

import themeReducer from './store/themeSlice';
import ThemeWrapper from './ThemeWrapper';
import Navbar from './components/navbar/navbar.component';

describe('ThemeToggle with Redux Persist', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('toggles theme and persists to localStorage', async () => {
    const persistConfig = {
      key: 'root',
      storage,
      whitelist: ['theme'],
    };

    const rootReducer = combineReducers({ theme: themeReducer });
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    });

    const persistor = persistStore(store);

    render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MemoryRouter>
            <ThemeWrapper>
              <Navbar />
            </ThemeWrapper>
          </MemoryRouter>
        </PersistGate>
      </Provider>
    );

    // Wait for PersistGate to rehydrate and UI to appear
    await waitFor(() => {
      expect(screen.getByTestId('theme-root')).toBeInTheDocument();
    });

    const button = screen.getByTestId('toggle-theme');
    const themeRoot = screen.getByTestId('theme-root');

    expect(themeRoot).toHaveAttribute('data-theme', 'light');

    fireEvent.click(button);

    await waitFor(() => {
      expect(themeRoot).toHaveAttribute('data-theme', 'dark');

      const raw = localStorage.getItem('persist:root');
      expect(raw).toBeTruthy();
      const persisted = JSON.parse(raw);
      const themeState = JSON.parse(persisted.theme);
      expect(themeState.mode).toBe('dark');
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(themeRoot).toHaveAttribute('data-theme', 'light');
      const raw = localStorage.getItem('persist:root');
      const persisted = JSON.parse(raw);
      const themeState = JSON.parse(persisted.theme);
      expect(themeState.mode).toBe('light');
    });
  });
});