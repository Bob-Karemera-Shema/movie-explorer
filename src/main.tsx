import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MoviesProvider from './contexts/movies.provider.tsx'
import GenreProvider from './contexts/genres.provider.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MoviesProvider>
      <GenreProvider>
        <App />
      </GenreProvider>
    </MoviesProvider>
  </StrictMode>,
)
