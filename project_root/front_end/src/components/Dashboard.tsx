import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, DollarSignIcon, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CustomCard from '../components/CustomCard';
import MetricCard from '../pages/Foundations/MetricCard';
import { DASHBOARD_FOUNDATIONS_SERIES } from '../pages/Foundations/foundationsConfig';
import queries from '../queries';
import { useLazyQuery } from '@apollo/client/react';
import type { GetUserCountsByCityData } from '../types';
import Loading from './Loading';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // get user counts by city
  const [
    fetchUserCountsByCity,
    {
      data: userCountsData,
      loading: isUserCountsLoading,
      error: userCountsError,
    },
  ] = useLazyQuery<GetUserCountsByCityData>(queries.GET_USER_COUNTS_BY_CITY, {
    fetchPolicy: 'cache-and-network',
  });

  // Get total users
  const totalUserCounts = userCountsData?.getUserCountsByCity?.totalCount || 0;

  // Get user counts for each city
  const nycUserCounts = userCountsData?.getUserCountsByCity?.citiesData.find(
    (city) => city.city === 'New York',
  )?.count;
  const sfUserCounts = userCountsData?.getUserCountsByCity?.citiesData.find(
    (city) => city.city === 'San Francisco',
  )?.count;
  const houstonUserCounts =
    userCountsData?.getUserCountsByCity?.citiesData.find(
      (city) => city.city === 'Houston',
    )?.count;

  // Get popular neighborhoods for each city
  const popularNeighborhoods =
    userCountsData?.getUserCountsByCity?.popularNeighborhoods || [];

  const nycPopularNeighborhood = popularNeighborhoods
    .filter((n) => n.city === 'New York')
    .sort((a, b) => b.count - a.count)[0]?.neighborhood;
  const sfPopularNeighborhood = popularNeighborhoods
    .filter((n) => n.city === 'San Francisco')
    .sort((a, b) => b.count - a.count)[0]?.neighborhood;
  const houstonPopularNeighborhood = popularNeighborhoods
    .filter((n) => n.city === 'Houston')
    .sort((a, b) => b.count - a.count)[0]?.neighborhood;

  // Fetch user counts by city on component mount
  useEffect(() => {
    if (!currentUser) {
      return;
    }
    fetchUserCountsByCity();
  }, [currentUser, fetchUserCountsByCity]);

  const welcomeMessage = currentUser
    ? `Welcome back to Ontology.`
    : 'Welcome to Ontology!';

  // Card content for users
  const usersCardContent = (
    <div>
      <p className='font-bold text-lg'>
        New York City:{' '}
        <span className='font-semibold text-primary'>{nycUserCounts || 0}</span>
      </p>
      <p className='font-bold text-lg'>
        San Francisco:{' '}
        <span className='font-semibold text-primary'>{sfUserCounts || 0}</span>
      </p>
      <p className='font-bold text-lg'>
        Houston:{' '}
        <span className='font-semibold text-primary'>
          {houstonUserCounts || 0}
        </span>
      </p>
    </div>
  );

  // Card content for financial health insights
  const financialHealthCardContent = (
    <div>
      <p className='font-bold text-lg'>
        Consumer Index:{' '}
        <span className='font-semibold text-primary'>334.1%</span>
      </p>
      <p className='font-bold text-lg'>
        Mortgage Rate: <span className='font-semibold text-primary'>6.3%</span>
      </p>
      <p className='font-bold text-lg'>
        Unemployment Rate: <span className='font-semibold text-primary'>4.3%</span>
      </p>
    </div>
  );

  // Card content for affordability insights
  const affordabilityCardContent = (
    <div>
      <p className='font-bold text-lg'>
        New York City:{' '}
        <Link
          to='/affordability-nyc'
          className='font-semibold text-primary hover:underline'
        >
          {nycPopularNeighborhood || 'Unknown'}
        </Link>
      </p>
      <p className='font-bold text-lg'>
        San Francisco:{' '}
        <Link
          to='/affordability-sf'
          className='font-semibold text-primary hover:underline'
        >
          {sfPopularNeighborhood || 'Unknown'}
        </Link>
      </p>
      <p className='font-bold text-lg'>
        Houston:{' '}
        <Link
          to='/affordability-houston'
          className='font-semibold text-primary hover:underline'
        >
          {houstonPopularNeighborhood || 'Unknown'}
        </Link>
      </p>
    </div>
  );

  if (isUserCountsLoading) {
    return <Loading />;
  }
  if (userCountsError) {
    return <p className='text-red-500'>Error: {userCountsError.message}</p>;
  }

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
          numberText={totalUserCounts.toString()}
          icon={<Users className='size-5' />}
          footerButtonText='Explore Cities'
          footerButtonAction={() => navigate('/affordability-nyc')}
          content={usersCardContent}
        />
        <CustomCard
          title='Affordability'
          badgeText='Popular Neighborhoods'
          numberText='3'
          icon={<DollarSignIcon className='size-5' />}
          footerButtonText='Explore Neighborhoods'
          footerButtonAction={() => navigate('/affordability-nyc')}
          content={affordabilityCardContent}
        />
        <CustomCard
          title='Purchases Power'
          badgeText='Insights'
          numberText={`'26`}
          footerButtonText='View Financial Health'
          footerButtonAction={() => navigate('/foundations')}
          icon={<Activity className='size-5' />}
          content={financialHealthCardContent}
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
