import { Link } from 'react-router-dom';

const Mobility = () => {
  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      <h1 className='text-3xl font-bold mb-4'>Mobility </h1>
      <p className='text-lg text-gray-700 mb-4'>
        Please update your economic profile and interact with the map.
      </p>
      <p className='text-lg text-gray-700 mb-4'>
        The Affordability map of the selected city in New York City, Sans
        Francisco, and Houston neighborhoods will based on the median income and
        median rent.
      </p>
      <Link to='/affordability-nyc' className='text-blue-500 hover:underline'>
        Go to Affordability Map
      </Link>
    </div>
  );
};

export default Mobility;
