import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import fbconfig from './firebase/FirebaseConfig';
import './index.css';
import App from './App.tsx';
import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/client/react';

initializeApp(fbconfig);

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/',
});

const authLink = setContext(async (_, { headers }) => {
  const user = getAuth().currentUser;
  const token = user ? await user.getIdToken() : '';

  return {
    headers: {
      ...headers,
      authorization: token ? `TokenHolder ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, httpLink]),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
