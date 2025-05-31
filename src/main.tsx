import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import MoviesProvider from './contexts/movies.provider.tsx'
import GenreProvider from './contexts/genres.provider.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <MoviesProvider>
          <GenreProvider>
            <App />
          </GenreProvider>
        </MoviesProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
