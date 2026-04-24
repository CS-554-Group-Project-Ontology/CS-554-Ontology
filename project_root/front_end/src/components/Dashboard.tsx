import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, DollarSignIcon, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CustomCard from '../components/CustomCard';
import MetricCard from '../pages/Foundations/MetricCard';
import { DASHBOARD_FOUNDATIONS_SERIES } from '../pages/Foundations/foundationsConfig';

const Dashboard = () => {
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
        Consumer Index:{' '}
        <span className='font-semibold text-primary'>334.1%</span>
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
    <div>
      <div className='flex flex-col gap-2 mb-4'>
        <p className='text-2xl font-semibold mb-4'>
          Hello,{' '}
          <span className='text-primary'>
            {currentUser?.displayName || currentUser?.email}
          </span>
        </p>
        <h1 className='text-3xl font-bold mb-2'>{welcomeMessage}</h1>
      </div>
      <div className='flex flex-col md:flex-row justify-between gap-6 mb-6'>
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
      <div className='grid gap-6 md:grid-cols-2'>
        {DASHBOARD_FOUNDATIONS_SERIES.map((config) => (
          <MetricCard key={config.seriesId} config={config} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
