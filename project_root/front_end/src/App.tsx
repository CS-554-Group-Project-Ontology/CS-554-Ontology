import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './components/NotFound';
import Layout from './components/Layout';
import AffordabilityNYC from './pages/AffordabilityNYC';
function App() {
  return (
    <AuthProvider>
      <div className='app-flex'>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Landing />} />
            <Route path='/home' element={<PrivateRoute />}>
              <Route path='/home' element={<Home />} />
              <Route path='/home/affordability-nyc' element={<AffordabilityNYC />} />
            </Route>
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
