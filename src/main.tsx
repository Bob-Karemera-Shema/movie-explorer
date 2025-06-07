import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/store.ts'

import ThemeWrapper from './ThemeWrapper.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeWrapper>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeWrapper>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
