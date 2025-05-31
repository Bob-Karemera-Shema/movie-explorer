import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import MoviesProvider from './contexts/movies.provider.tsx'
import GenreProvider from './contexts/genres.provider.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MoviesProvider>
        <GenreProvider>
          <App />
        </GenreProvider>
      </MoviesProvider>
    </BrowserRouter>
  </StrictMode>,
)
