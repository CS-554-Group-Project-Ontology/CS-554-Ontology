import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { AuthContext } from '../context/AuthContext';

import queries from '../queries';
import {
  FEATURES_WITH_NEIGHBORHOOD,
  type GetUserByUUIDData,
  type GetUserByUUIDVars,
  type TsEconomicProfile,
} from '../types';

// Each of the 3 cities coordinates
const NYC_INITIAL_CENTER: [number, number] = [-74.0242, 40.6941];

// Initial zoom level for the map
const INITIAL_ZOOM: number = 10.12;

const formatCurrency = (value?: number) =>
  value !== undefined && value !== null ? `$${value.toLocaleString()}` : 'N/A';

const AffordabilityNYC = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(
    null,
  );

  // track the current center and zoom level of the map
  const [center, setCenter] = useState<[number, number]>([
    NYC_INITIAL_CENTER[0],
    NYC_INITIAL_CENTER[1],
  ]);
  // track the zoom level of the map
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);

  // open or closed the details tag
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  // get user economic profile data for the current user
  const { currentUser } = useContext(AuthContext);
  const { loading, error, data } = useQuery<
    GetUserByUUIDData,
    GetUserByUUIDVars
  >(queries.GET_USER_BY_UUID, {
    variables: { uuid: currentUser?.uid || '' },
    fetchPolicy: 'cache-and-network',
  });

  // destructure the economic profile from graphql data
  const userEconomicProfile = data?.getUserByUUID?.economic_profile as
    | TsEconomicProfile
    | undefined;

  // create an array of profile details to display in the details tag
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

  const toggleDetails = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (loading) return;
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: NYC_INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    // Add navigation controls to the map
    mapRef.current = map;

    // Add the NYC neighborhoods layer once the map has loaded
    map.on('load', () => {
      let hoveredId: number | string | null = null;

      map.addSource('nyc-neighborhoods', {
        type: 'geojson',
        generateId: true, // enable geojson id property
        data: {
          type: 'FeatureCollection' as const,
          features: FEATURES_WITH_NEIGHBORHOOD as FeatureCollection<
            Geometry,
            GeoJsonProperties
          >['features'],
        },
      });

      map.addLayer({
        id: 'nyc-neighborhoods-fill',
        type: 'fill',
        source: 'nyc-neighborhoods',
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'orange',
            '#409A99',
          ],
          'fill-opacity': 0.7,
        },
      });

      map.addLayer({
        id: 'nyc-neighborhoods-outline',
        type: 'line',
        source: 'nyc-neighborhoods',
        paint: {
          'line-color': '#aaa',
          'line-width': 1,
        },
      });

      map.on('move', () => {
        const mapCenter = map.getCenter();
        const mapZoom = map.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      });

      map.on('mouseenter', 'nyc-neighborhoods-fill', (event) => {
        map.getCanvas().style.cursor = 'pointer';

        const feature = event.features?.[0];
        const neighborhood = feature?.properties?.neighborhood;

        setHoveredNeighborhood(
          typeof neighborhood === 'string' ? neighborhood : null,
        );
      });

      map.on('mousemove', 'nyc-neighborhoods-fill', (event) => {
        map.getCanvas().style.cursor = 'pointer';

        const feature = event.features?.[0];

        if (!feature?.id) return;

        if (hoveredId !== null) {
          map.setFeatureState(
            { source: 'nyc-neighborhoods', id: hoveredId },
            { hover: false },
          );
        }

        hoveredId = feature.id;

        map.setFeatureState(
          { source: 'nyc-neighborhoods', id: hoveredId },
          { hover: true },
        );

        const neighborhood = feature?.properties?.neighborhood;

        setHoveredNeighborhood(
          typeof neighborhood === 'string' ? neighborhood : null,
        );
      });

      map.on('mouseleave', 'nyc-neighborhoods-fill', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: 'nyc-neighborhoods', id: hoveredId },
            { hover: false },
          );
        }
        hoveredId = null;

        setHoveredNeighborhood((prev) => (prev === null ? prev : null));
      });

      map.on('click', 'nyc-neighborhoods-fill', (event) => {
        const feature = event.features?.[0];
        const neighborhood = feature?.properties?.neighborhood;

        if (typeof neighborhood === 'string') {
          alert(`You clicked on ${neighborhood}`);
        }
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [loading]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      <h1 className='text-3xl font-bold mb-4'>
        Affordability in New York City
      </h1>

      <p className='text-lg text-gray-700 mb-4'>
        This map displays the affordability of the New York City neighborhoods
        based on the median income and median rent.
      </p>

      {currentUser && (
        <details
          ref={detailsRef}
          open={isOpen}
          onToggle={toggleDetails}
          className='mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-sky-50 p-5 shadow-sm'
        >
          <summary className='cursor-pointer list-none'>
            <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
              <div className='flex items-center gap-2'>
                {isOpen ? (
                  <ChevronDown className='h-5 w-5 text-sky-600 font-bold' />
                ) : (
                  <ChevronRight className='h-5 w-5 text-sky-600 font-bold' />
                )}
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-sky-600'>
                    Personal snapshot
                  </p>
                  <h2 className='text-2xl font-semibold text-slate-900'>
                    Your Financial Profile
                  </h2>
                </div>
              </div>
              <span className='inline-flex w-fit items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700'>
                {isOpen ? 'Click to collapse' : 'Click to expand'}
              </span>
            </div>
          </summary>

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
        </details>
      )}
      {/* {currentUser && (
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
      )} */}

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
          setCenter(NYC_INITIAL_CENTER);
          setZoom(INITIAL_ZOOM);
          if (mapRef.current) {
            mapRef.current.setCenter(NYC_INITIAL_CENTER);
            mapRef.current.setZoom(INITIAL_ZOOM);
          }
        }}
      >
        Reset View
      </button>

      {/* Map container with sidebar overlay */}
      <div className='map-app-container'>
        <div className='map-sidebar'>
          <div className='font-bold text-sm'>
            Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)}{' '}
            | Zoom: {zoom.toFixed(2)}
          </div>
          <div className='map-sidebar-neighborhood mt-2 font-semibold'>
            {hoveredNeighborhood ?? 'Hover over a NYC neighborhood'}
          </div>
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

export default AffordabilityNYC;
