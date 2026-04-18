import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './components/NotFound';
import Mobility from './pages/Mobility';
import Foundations from './pages/Foundations';

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route element={<PrivateRoute />}>
          <Route path='/mobility' element={<Mobility />}/>
          <Route path='/foundations' element={<Foundations />}/>
        </Route>
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
