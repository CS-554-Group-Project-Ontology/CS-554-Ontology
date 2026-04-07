import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './components/NotFound';

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<PrivateRoute />}>
          <Route path='/home' element={<Home />} />
        </Route>
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
