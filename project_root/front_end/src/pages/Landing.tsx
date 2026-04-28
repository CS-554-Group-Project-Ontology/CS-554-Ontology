import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

function Landing() {
  const { currentUser } = useContext(AuthContext);

  const welcomeMessage = currentUser
    ? `Welcome back to Ontology.`
    : 'Welcome to Ontology!';

  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      {currentUser ? (
        <Dashboard />
      ) : (
        <div className='relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:p-14'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <h1 className='max-w-xl text-3xl font-bold tracking-tight text-slate-900'>
                {welcomeMessage}
              </h1>
              <p className='max-w-xl text-base leading-7 text-slate-700 sm:text-lg'>
                The purpose of this project is to give the financially aware
                user an easy-to-use application that actively tracks their
                financial status and recommends methods to improve their
                economic stability.
              </p>
              <p className='max-w-xl text-base leading-7 text-slate-700 sm:text-lg'>
                The application reduces the obfuscation that often accompanies
                financial decision making by structuring financial data into
                attainable goals.
              </p>
            </div>

            <div className='flex justify-content gap-4'>
              <Link
                to='/signup'
                className='btn btn-lg bg-primary text-white hover:bg-white hover:text-primary border-primary hover:border-primary'
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className='relative'>
            <div className='relative overflow-hidden rounded-xl border border-white/70 bg-white/80 p-3 shadow-2xl backdrop-blur'>
              <img
                src='/landing-hero.png'
                alt='Landing hero'
                className='h-full w-full rounded-xl object-cover object-center'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
