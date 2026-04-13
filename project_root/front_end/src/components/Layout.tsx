import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='flex min-h-svh flex-col'>
      <Navigation />
      <main className='container mx-auto flex-1 px-2 py-2 sm:px-4 lg:px-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
