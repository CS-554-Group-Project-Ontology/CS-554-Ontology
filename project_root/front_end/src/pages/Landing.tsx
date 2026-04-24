import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { InfoIcon } from 'lucide-react';
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
        <div className='flex flex-col gap-2 mb-4'>
          <h1 className='text-3xl font-bold mb-2'>{welcomeMessage}</h1>
          <div
            role='alert'
            className='alert alert-vertical sm:alert-horizontal item-center'
          >
            <InfoIcon size={70} className='text-primary' />
            <div>
              <div className='flex justify-between items-center gap-2 text-lg text-gray-600'>
                <p className='py-4'>
                  The purpose of this project is to give the financially aware
                  user an easy-to-use application that actively tracks their
                  financial status and recommends methods to improve their
                  economic stability. The application aims to reduce the
                  obfuscation that often accompanies financial decision making
                  by structuring a user's financial data into attainable goals
                  that they can pursue to improve their financial well-being.
                </p>
              </div>
              <div className='flex justify-end items-end gap-2'>
                <button className='btn btn-md bg-primary text-white'>
                  <Link to='/signup'>Get Started</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
