import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './components/NotFound';
import Layout from "./components/Layout";
import Mobility from './pages/Mobility/Mobility';
import Foundations from './pages/Foundations/Foundations';
import Profile from "./components/Profile";
import AffordabilityCityRoute from './pages/Affordability/AffordabilityCityRoute';

function App() {
  return (
    <AuthProvider>
      <div className='app-flex'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Landing />} />
          <Route element={<PrivateRoute />}>
            <Route path='/mobility' element={<Mobility />} />
                <Route path='/foundations' element={<Foundations />}/>
                <Route path='/affordability/:citySlug' element={<AffordabilityCityRoute />} />
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
