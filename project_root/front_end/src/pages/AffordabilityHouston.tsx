import { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import { ChevronRight, ChevronDown, MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import queries from '../queries';
import {
  HOUSTON_FEATURES_WITH_NEIGHBORHOOD,
  type GetCostOfLivingByCityAndNeighborhoodData,
  type GetMeData,
  type TsEconomicProfile,
} from '../types';
import { formatCurrency } from '../helpers';
import ProfileStatusBanner from './Mobility/ProfileStatusBanner';

// Houston coordinates
const HOUSTON_INITIAL_CENTER: [number, number] = [-95.5659, 29.7308];

// Initial zoom level for the map
const INITIAL_ZOOM: number = 9.87;

const AffordabilityHouston = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const lastRequestedNeighborhoodRef = useRef<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(
    null,
  );

  // track the current center and zoom level of the map
  const [center, setCenter] = useState<[number, number]>([
    HOUSTON_INITIAL_CENTER[0],
    HOUSTON_INITIAL_CENTER[1],
  ]);
  // track the zoom level of the map
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);

  // open or closed the details tag
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  // get user economic profile data for the current user
  const { loading, error, data } = useQuery<GetMeData>(queries.GET_ME, {
    fetchPolicy: 'cache-and-network',
  });

  const profileNeighborhood =
    data?.getMe?.economic_profile?.neighborhood?.trim() ?? null;
  const selectedCity = data?.getMe?.economic_profile?.city?.trim() ?? '';
  const isUserCurrentCity = selectedCity === 'Houston';

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isUserCurrentCity && !selectedNeighborhood && profileNeighborhood) {
      setSelectedNeighborhood(profileNeighborhood);
      setHoveredNeighborhood(profileNeighborhood);
    }
  }, [isUserCurrentCity, profileNeighborhood, selectedNeighborhood]);

  // get cost of living data for the selected neighborhood
  const [
    fetchCostOfLiving,
    {
      data: costOfLivingData,
      loading: isCostOfLivingLoading,
      error: costOfLivingError,
    },
  ] = useLazyQuery<GetCostOfLivingByCityAndNeighborhoodData>(
    queries.GET_COST_OF_LIVING_BY_CITY_AND_NEIGHBORHOOD,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  // fetch cost of living data when selected neighborhood changes
  useEffect(() => {
    if (!selectedNeighborhood) {
      return;
    }

    const requestKey = `${selectedNeighborhood}`;

    if (lastRequestedNeighborhoodRef.current === requestKey) {
      return;
    }
    lastRequestedNeighborhoodRef.current = requestKey;
    void fetchCostOfLiving({
      variables: {
        neighborhood: selectedNeighborhood,
      },
    });
  }, [fetchCostOfLiving, selectedNeighborhood]);

  // destructure the cost of living data
  const costOfLiving = costOfLivingData?.getCostOfLivingByCityAndNeighborhood;

  // destructure the economic profile from graphql data
  const userEconomicProfile = data?.getMe?.economic_profile as
    | TsEconomicProfile
    | undefined;

  // check if the user economic profile is empty (city, neighborhood & income)
  const isUserEconomicProfileEmpty =
    !userEconomicProfile ||
    userEconomicProfile.income == null ||
    !userEconomicProfile.city ||
    userEconomicProfile.city.trim().length === 0 ||
    !userEconomicProfile.neighborhood ||
    userEconomicProfile.neighborhood.trim().length === 0;

  // create an array of profile details to display in the details tag
  const profileDetails = [
    {
      label: 'City',
      value: userEconomicProfile?.city || 'N/A',
    },
    {
      label: 'Neighborhood',
      value: userEconomicProfile?.neighborhood || 'N/A',
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

  // Initialize the map when the component mounts
  useEffect(() => {
    if (loading) return;
    if (!mapContainerRef.current || mapRef.current) return;

    if (!document.getElementById('mapbox-gl-css')) {
      const mapboxStylesheet = document.createElement('link');
      mapboxStylesheet.id = 'mapbox-gl-css';
      mapboxStylesheet.rel = 'stylesheet';
      mapboxStylesheet.href =
        'https://api.mapbox.com/mapbox-gl-js/v3.20.0/mapbox-gl.css';
      document.head.appendChild(mapboxStylesheet);
    }

    const mapboxAccessToken = document
      .querySelector('meta[name="mapbox-access-token"]')
      ?.getAttribute('content');
    if (!mapboxAccessToken) return;

    mapboxgl.accessToken = mapboxAccessToken;

    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: HOUSTON_INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    // Add navigation controls to the map
    mapRef.current = map;

    // Add the Houston neighborhoods layer once the map has loaded
    map.on('load', () => {
      let hoveredId: number | string | null = null;

      map.addSource('houston-neighborhoods', {
        type: 'geojson',
        generateId: true, // enable geojson id property
        data: {
          type: 'FeatureCollection' as const,
          features: HOUSTON_FEATURES_WITH_NEIGHBORHOOD as FeatureCollection<
            Geometry,
            GeoJsonProperties
          >['features'],
        },
      });

      map.addLayer({
        id: 'houston-neighborhoods-fill',
        type: 'fill',
        source: 'houston-neighborhoods',
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
        id: 'houston-neighborhoods-outline',
        type: 'line',
        source: 'houston-neighborhoods',
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

      map.on('mouseenter', 'houston-neighborhoods-fill', (event) => {
        map.getCanvas().style.cursor = 'pointer';

        const feature = event.features?.[0];
        const neighborhood = feature?.properties?.neighborhood;
        const nextNeighborhood =
          typeof neighborhood === 'string' ? neighborhood : null;

        setHoveredNeighborhood(nextNeighborhood);
        setSelectedNeighborhood(nextNeighborhood);
      });

      map.on('mousemove', 'houston-neighborhoods-fill', (event) => {
        map.getCanvas().style.cursor = 'pointer';

        const feature = event.features?.[0];

        if (!feature?.id) return;

        if (hoveredId !== null) {
          map.setFeatureState(
            { source: 'houston-neighborhoods', id: hoveredId },
            { hover: false },
          );
        }

        hoveredId = feature.id;

        map.setFeatureState(
          { source: 'houston-neighborhoods', id: hoveredId },
          { hover: true },
        );

        const neighborhood = feature?.properties?.neighborhood;
        const nextNeighborhood =
          typeof neighborhood === 'string' ? neighborhood : null;

        setHoveredNeighborhood(nextNeighborhood);
        setSelectedNeighborhood(nextNeighborhood);
      });

      map.on('mouseleave', 'houston-neighborhoods-fill', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: 'houston-neighborhoods', id: hoveredId },
            { hover: false },
          );
        }
        hoveredId = null;

        setHoveredNeighborhood(isUserCurrentCity ? profileNeighborhood : null);
        setSelectedNeighborhood(isUserCurrentCity ? profileNeighborhood : null);
      });
      setIsMapLoaded(true);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [loading]);

  // Update the fill color of user neighborhood by default
  useEffect(() => {
    if (
      !isMapLoaded ||
      !mapRef.current ||
      !mapRef.current.getLayer('houston-neighborhoods-fill')
    ) {
      return;
    }

    mapRef.current.setPaintProperty(
      'houston-neighborhoods-fill',
      'fill-color',
      [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        'orange',
        ['==', ['get', 'neighborhood'], profileNeighborhood],
        '#3f2bcd',
        '#409A99',
      ],
    );
  }, [isMapLoaded, profileNeighborhood]);

  const messageProfileIncomplete =
    'Please update your economic profile and interact with the map.';
  const messageProfileComplete = 'Update your economic profile';
  const pathLink = '/dashboard';
  const pathLinkText = 'Update your economic profile';

  if (loading) return <p>Loading...</p>;
  // Because user does not have an economic profile at first, so 'User Not Found' is expected.
  if (error && error.message !== 'User Not Found')
    return <p className='text-red-500'>Error: {error.message}</p>;

  const costOfLivingApolloError = costOfLivingError as
    | {
        graphQLErrors?: Array<{
          message?: string;
          extensions?: { code?: string };
        }>;
        message?: string;
      }
    | undefined;

  const costOfLivingGraphQLError = costOfLivingApolloError?.graphQLErrors?.[0];
  const costOfLivingMessage =
    costOfLivingGraphQLError?.extensions?.code === 'NOT_FOUND'
      ? 'No data for this neighborhood yet'
      : (costOfLivingGraphQLError?.message ?? costOfLivingError?.message);

  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      <h1 className='text-3xl font-bold mb-4'>Affordability in Houston</h1>

      <p className='text-lg text-gray-700 mb-4'>
        Use the map below to explore the affordability of different
        neighborhoods in Houston.
      </p>

      {/* Show alert if user economic profile is empty */}
      {isUserEconomicProfileEmpty ? (
        <div className='flex flex-col mb-4 text-gray-700'>
          <ProfileStatusBanner
            isEmpty={isUserEconomicProfileEmpty}
            messageProfileIncomplete={messageProfileIncomplete}
            messageProfileComplete={messageProfileComplete}
            pathLink={pathLink}
            pathLinkText={pathLinkText}
          />
        </div>
      ) : (
        <div className='mb-6 rounded-lg p-2'>
          <details
            ref={detailsRef}
            open={isOpen}
            onToggle={toggleDetails}
            className='mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-sky-50 p-2 shadow-sm'
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
                    <h2 className='text-xl font-semibold text-slate-900'>
                      Your Financial Profile
                    </h2>
                  </div>
                </div>
                <span className='inline-flex w-fit items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700'>
                  {isOpen ? 'Click to collapse' : 'Click to see details'}
                </span>
              </div>
            </summary>

            <div className='grid gap-1.5 grid-cols-2'>
              {profileDetails.map((item) => (
                <div
                  key={item.label}
                  className='rounded-lg border border-slate-200/70 bg-white/90 px-2.5 py-2 shadow-sm backdrop-blur'
                >
                  <p className='text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500 leading-none'>
                    {item.label}
                  </p>
                  <p className='mt-1 text-sm font-semibold text-slate-900 leading-tight'>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </details>

          <div className='flex items-center justify-between mb-4 text-sm text-gray-600'>
            <div className='flex items-center'>
              <p className='font-bold mr-4'>
                Adjust the slider to zoom in or out:{' '}
              </p>
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
              className='btn btn-primary btn-sm'
              onClick={() => {
                setCenter(HOUSTON_INITIAL_CENTER);
                setZoom(INITIAL_ZOOM);
                if (mapRef.current) {
                  mapRef.current.setCenter(HOUSTON_INITIAL_CENTER);
                  mapRef.current.setZoom(INITIAL_ZOOM);
                }
              }}
            >
              Reset Zoom View
            </button>
          </div>

          {/* Map container with sidebar overlay */}
          <div className='map-app-container'>
            <div className='map-sidebar'>
              <div className='font-bold text-xs'>
                <p>Hover over a neighborhood to see details</p>
                <p>
                  Long:{center[0].toFixed(4)} | Lat:{center[1].toFixed(4)} |
                  Zoom:{zoom.toFixed(2)}
                </p>
              </div>

              <div className='mt-2 mb-2 w-full max-w-95 rounded-2xl bg-white/95 shadow-xl ring-1 ring-slate-200/70 backdrop-blur-sm overflow-hidden'>
                <div className='flex items-center gap-2 px-4 py-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-xs text-amber-600'>
                    <MapPin className='h-5 w-5' />
                  </div>
                  <div className='min-w-0 flex text-xs truncate font-semibold'>
                    {hoveredNeighborhood ? (
                      <>
                        <p className='text-slate-500 mr-1'>Cost of Living:</p>
                        <span className='text-primary'>
                          {hoveredNeighborhood}
                        </span>
                      </>
                    ) : (
                      <span className='text-slate-500'>
                        Hover over a neighborhood
                      </span>
                    )}
                  </div>
                </div>

                {costOfLiving ? (
                  <div className='grid grid-cols-2 gap-2 px-4 pb-4 justify-center items-center'>
                    {[
                      ['Rent', costOfLiving.rent],
                      ['Insurance', costOfLiving.insuranceDeductibles],
                      ['Utilities', costOfLiving.utilities],
                      ['Other', costOfLiving.other],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className='flex items-center gap-2 rounded-xl bg-slate-50 px-1 py-1 ring-1 ring-slate-100'
                      >
                        <span className='text-[10px] uppercase tracking-[0.14em] text-slate-500'>
                          {label}:
                        </span>

                        <span className='text-xs font-semibold text-slate-900'>
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='px-6 pb-4 text-xs text-slate-600'>
                    {isCostOfLivingLoading
                      ? 'Loading neighborhood costs...'
                      : costOfLivingMessage ||
                        'No data for this neighborhood yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            ref={mapContainerRef}
            className='map-container'
            style={{ height: '500px' }}
          />
        </div>
      )}
    </div>
  );
};

export default AffordabilityHouston;
