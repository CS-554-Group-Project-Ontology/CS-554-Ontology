import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, DollarSignIcon, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CustomCard from '../components/CustomCard';
import queries from '../queries';
import { useLazyQuery } from '@apollo/client/react';
import type { GetUserCountsByCityData } from '../types';
import Loading from './Loading';
import {
  AFFORDABILITY_CITY_LIST,
  createAffordabilityCityPath,
} from '../pages/Affordability/affordabilityCityConfig';

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

  // Get popular neighborhoods for each city
  const popularNeighborhoods =
    userCountsData?.getUserCountsByCity?.popularNeighborhoods || [];

  // Create a map of city to user counts for easier access
  const cityData = userCountsData?.getUserCountsByCity?.citiesData || [];

  const getUserCountsForCity = (profileCity: string) =>
    cityData?.find((city) => city.city === profileCity)?.count || 0;
  const getPopularNeighborhoodForCity = (profileCity: string) =>
    popularNeighborhoods
      .filter((n) => n.city === profileCity)
      .sort((a, b) => b.count - a.count)[0]?.neighborhood || 'Unknown';

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

  const redirectToAffordability = () => {
    navigate(createAffordabilityCityPath('nyc'));
  };

  // Card content for users
  const usersCardContent = (
    <div>
      {AFFORDABILITY_CITY_LIST.map((city) => (
        <p key={city.slug} className='font-bold text-lg'>
          {city.cityTitle}:{' '}
          <span className='font-semibold text-primary'>
            {getUserCountsForCity(city.profileCity) || 0}
          </span>
        </p>
      ))}
    </div>
  );

  // Card content for affordability insights
  const affordabilityCardContent = (
    <div>
      {AFFORDABILITY_CITY_LIST.map((city) => (
        <p key={city.slug} className='font-bold text-lg'>
          {city.cityTitle}:{' '}
          <Link
            to={`/affordability/${city.slug}`}
            className='font-semibold text-primary hover:underline'
          >
            {getPopularNeighborhoodForCity(city.profileCity) || 'Unknown'}
          </Link>
        </p>
      ))}
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
        Unemployment Rate:{' '}
        <span className='font-semibold text-primary'>4.3%</span>
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
          footerButtonAction={redirectToAffordability}
          content={usersCardContent}
        />
        <CustomCard
          title='Affordability'
          badgeText='Popular Neighborhoods'
          numberText='3'
          icon={<DollarSignIcon className='size-5' />}
          footerButtonText='Explore Neighborhoods'
          footerButtonAction={redirectToAffordability}
          content={affordabilityCardContent}
        />
        <CustomCard
          title='Purchases Power'
          badgeText='Insights'
          numberText={`'26`}
          footerButtonText='View Financial Health'
          footerButtonAction={redirectToAffordability}
          icon={<Activity className='size-5' />}
          content={financialHealthCardContent}
        />
      </div>
    </div>
  );
};

export default Dashboard;
