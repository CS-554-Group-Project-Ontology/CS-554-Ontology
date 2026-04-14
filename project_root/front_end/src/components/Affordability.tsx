import { useContext, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AuthContext } from '../context/AuthContext';
import queries from '../queries';
import { useQuery } from '@apollo/client/react';

// Each of the 3 cities coordinates
const NYC_INITIAL_CENTER: [number, number] = [-74.0242, 40.6941];
const HOUSTON_INITIAL_CENTER: [number, number] = [-95.3698, 29.7604];
const SF_INITIAL_CENTER: [number, number] = [-122.4194, 37.7749];

// All 3 cities coordinates in a dictionary for easy access
const CITY = {
  'new-york-city': NYC_INITIAL_CENTER,
  houston: HOUSTON_INITIAL_CENTER,
  'san-francisco': SF_INITIAL_CENTER,
};

// Initial zoom level for the map
const INITIAL_ZOOM: number = 10.12;

type GetUserByUUIDData = {
  getUserByUUID?: {
    economic_profile?: TsEconomicProfile | null;
  } | null;
};

type GetUserByUUIDVars = {
  uuid: string;
};

interface TsLiabilities {
  rent?: number;
  insuranceDeductibles?: number;
  utilities?: number;
  other?: number;
}

interface TsEconomicProfile {
  income?: number;
  address?: string;
  liabilities?: TsLiabilities;
}

const formatCurrency = (value?: number) =>
  value !== undefined && value !== null ? `$${value.toLocaleString()}` : 'N/A';

const Affordability = ({ city }: { city: string }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // track the current center and zoom level of the map
  const [center, setCenter] = useState<[number, number]>([
    NYC_INITIAL_CENTER[0],
    NYC_INITIAL_CENTER[1],
  ]);
  // track the zoom level of the map
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);

  // get initial city center based on passed city from props
  const selectedCityCenter =
    CITY[city as keyof typeof CITY] || NYC_INITIAL_CENTER;

  const { currentUser } = useContext(AuthContext);
  const { loading, error, data } = useQuery<
    GetUserByUUIDData,
    GetUserByUUIDVars
  >(queries.GET_USER_BY_UUID, {
    variables: { uuid: currentUser?.uid || '' },
    fetchPolicy: 'cache-and-network',
  });

  const userEconomicProfile = data?.getUserByUUID?.economic_profile as
    | TsEconomicProfile
    | undefined;

  const profileDetails = [
    {
      label: 'Address',
      value: userEconomicProfile?.address || 'N/A',
      fullWidth: true,
    },
    {
      label: 'Income',
      value: formatCurrency(userEconomicProfile?.income),
    },
    {
      label: 'Rent',
      value: formatCurrency(userEconomicProfile?.liabilities?.rent),
    },
    {
      label: 'Utilities',
      value: formatCurrency(userEconomicProfile?.liabilities?.utilities),
    },
    {
      label: 'Insurance Deductibles',
      value: formatCurrency(
        userEconomicProfile?.liabilities?.insuranceDeductibles,
      ),
    },
    {
      label: 'Other Liabilities',
      value: formatCurrency(userEconomicProfile?.liabilities?.other),
    },
  ];

  useEffect(() => {
    if (loading) return;
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: selectedCityCenter,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current!.getCenter();
      const mapZoom = mapRef.current!.getZoom();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [loading, selectedCityCenter]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      <h1 className='text-3xl font-bold mb-4'>
        Affordability in{' '}
        {city === 'new-york-city'
          ? 'New York City'
          : city === 'houston'
            ? 'Houston'
            : 'San Francisco'}
      </h1>

      <p className='text-lg text-gray-700 mb-4'>
        This map displays the affordability of the{' '}
        {city === 'new-york-city'
          ? 'New York City'
          : city === 'houston'
            ? 'Houston'
            : 'San Francisco'}{' '}
        neighborhoods based on the median income and median rent.
      </p>

      {currentUser && (
        <section className='mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-sky-50 p-5 shadow-sm'>
          <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-sky-600'>
                Personal snapshot
              </p>
              <h2 className='text-2xl font-semibold text-slate-900'>
                Your Financial Profile
              </h2>
            </div>
            <span className='inline-flex w-fit items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700'>
              Live profile data
            </span>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            {profileDetails.map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur ${
                  item.fullWidth ? 'sm:col-span-2' : ''
                }`}
              >
                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                  {item.label}
                </p>
                <p className='mt-2 text-lg font-semibold text-slate-900'>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className='mb-4 text-sm text-gray-600'>
        <p className='font-bold'>Adjust the slider to zoom in or out</p>
        <input
          type='range'
          min='0'
          max='20'
          value={zoom}
          onChange={(e) => {
            const newZoom = parseFloat(e.target.value);
            setZoom(newZoom);
            if (mapRef.current) {
              mapRef.current.setZoom(newZoom);
            }
          }}
        />
      </div>

      {/* Reset view button */}
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8'
        onClick={() => {
          setCenter(selectedCityCenter);
          setZoom(INITIAL_ZOOM);
          if (mapRef.current) {
            mapRef.current.setCenter(selectedCityCenter);
            mapRef.current.setZoom(INITIAL_ZOOM);
          }
        }}
      >
        Reset View
      </button>

      {/* Map container with sidebar overlay */}
      <div className='map-app-container'>
        <div className='map-sidebar'>
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
          Zoom: {zoom.toFixed(2)}
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className='map-container'
        style={{ height: '500px' }}
      />
    </div>
  );
};

export default Affordability;
