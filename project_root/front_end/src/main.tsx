import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client/react'

createRoot(document.getElementById('root')!).render(
  <ApolloProvider>
  <StrictMode>
    <App />
  </StrictMode>,
  </ApolloProvider>
)
