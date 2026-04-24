import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, DollarSignIcon, InfoIcon, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CustomCard from '../components/CustomCard';

function Landing() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const welcomeMessage = currentUser
    ? `Welcome back to Ontology.`
    : 'Welcome to Ontology!';

  const usersContent = (
    <div>
      <p className='font-bold text-lg'>
        New York City: <span className='font-semibold text-primary'>25</span>
      </p>
      <p className='font-bold text-lg'>
        San Francisco: <span className='font-semibold text-primary'>15</span>
      </p>
      <p className='font-bold text-lg'>
        Houston: <span className='font-semibold text-primary'>10</span>
      </p>
    </div>
  );

  const financialHealthContent = (
    <div>
      <p className='font-bold text-lg'>
        Consumer Index: <span className='font-semibold text-primary'>334.1%</span>
      </p>
      <p className='font-bold text-lg'>
        Mortgage: <span className='font-semibold text-primary'>6.3%</span>
      </p>
      <p className='font-bold text-lg'>
        Unemployment: <span className='font-semibold text-primary'>4.3%</span>
      </p>
    </div>
  );

  const affordabilityContent = (
    <div>
      <p className='font-bold text-lg'>
        New York City:{' '}
        <Link
          to='/affordability-nyc'
          className='font-semibold text-primary hover:underline'
        >
          Flushing
        </Link>
      </p>
      <p className='font-bold text-lg'>
        San Francisco:{' '}
        <Link
          to='/affordability-sf'
          className='font-semibold text-primary hover:underline'
        >
          Mission District
        </Link>
      </p>
      <p className='font-bold text-lg'>
        Houston:{' '}
        <Link
          to='/affordability-houston'
          className='font-semibold text-primary hover:underline'
        >
          Greater Heights
        </Link>
      </p>
    </div>
  );

  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      {currentUser ? (
        <>
          <div className='flex flex-col gap-2 mb-4'>
            <p className='text-2xl font-semibold mb-4'>
              Hello,{' '}
              <span className='text-primary'>
                {currentUser?.displayName || currentUser?.email}
              </span>
            </p>
            <h1 className='text-3xl font-bold mb-2'>{welcomeMessage}</h1>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <CustomCard
              title='Users'
              badgeText='Active'
              numberText='50'
              icon={<Users className='size-5' />}
              footerButtonText='Explore Cities'
              footerButtonAction={() => navigate('/affordability-nyc')}
              content={usersContent}
            />
            <CustomCard
              title='Affordability'
              badgeText='Popular Neighborhoods'
              numberText='3'
              icon={<DollarSignIcon className='size-5' />}
              footerButtonText='Explore Neighborhoods'
              footerButtonAction={() => navigate('/affordability-nyc')}
              content={affordabilityContent}
            />
            <CustomCard
              title='Purchases Power'
              badgeText='Insights'
              numberText={`'26`}
              footerButtonText='View Financial Health'
              footerButtonAction={() => navigate('/foundations')}
              icon={<Activity className='size-5' />}
              content={financialHealthContent}
            />
          </div>
        </>
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
