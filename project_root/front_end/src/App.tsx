import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './components/NotFound';
import Layout from './components/Layout';
import AffordabilityNYC from './pages/AffordabilityNYC';
import AffordabilitySF from './pages/AffordabilitySF';
import AffordabilityHouston from './pages/AffordabilityHouston';
import Profile from './components/Profile';
import Mobility from './pages/Mobility';

function App() {
  return (
    <AuthProvider>
      <div className='app-flex'>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Landing />} />
            <Route path='/' element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Home />} />
              <Route path='/mobility' element={<Mobility />} />
              <Route path='/affordability-nyc' element={<AffordabilityNYC />} />
              <Route path='/affordability-sf' element={<AffordabilitySF />} />
              <Route
                path='/affordability-houston'
                element={<AffordabilityHouston />}
              />

              <Route path='/profile' element={<Profile />} />
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
