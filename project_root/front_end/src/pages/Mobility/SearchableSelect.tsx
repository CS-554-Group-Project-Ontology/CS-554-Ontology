import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { normalizeGeoJSON } from '../../types';
import { CITY_GEOJSON_URLS, CITY_OPTIONS } from '../../constants';

// SearchableSelect Component
interface SearchableSelectProps {
  selectedCity: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: string;
}

type NeighborhoodFeature = {
  geometry?: Geometry;
  properties?: {
    name?: string;
    neighborhood?: string;
  };
};

type NeighborhoodOption = {
  name: string;
  latitude: number;
  longitude: number;
};

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  selectedCity,
  value,
  onChange,
  placeholder = 'Select a neighborhood',
  disabled = false,
  width = 'w-full',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return neighborhoods;
    return neighborhoods.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, neighborhoods]);

  // Determine GeoJSON URL based on selected city
  const geoJsonUrl = CITY_OPTIONS.includes(selectedCity)
    ? CITY_GEOJSON_URLS[selectedCity]
    : null;

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      if (!selectedCity || !geoJsonUrl) {
        setNeighborhoods([]);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const resp = await axios.get<
          FeatureCollection<Geometry, GeoJsonProperties>
        >(geoJsonUrl!);
        const normalizedFeatures = normalizeGeoJSON(resp.data, selectedCity);

        let options: NeighborhoodOption[] = [];

        if (Array.isArray(normalizedFeatures)) {
          if (typeof normalizedFeatures[0] === 'string') {
            options = (normalizedFeatures as string[]).map((name) => ({
              name,
              latitude: 0,
              longitude: 0,
            }));
          } else {
            options = (normalizedFeatures as NeighborhoodFeature[])
              .map((feature) => {
                const name =
                  feature?.properties?.name ||
                  feature?.properties?.neighborhood ||
                  undefined;

                if (!name || !feature?.geometry) {
                  return null;
                }

                const { latitude, longitude } = getNeighborhoodLatLong(
                  feature.geometry,
                );

                return { name, latitude, longitude };
              })
              .filter(
                (option): option is NeighborhoodOption => option !== null,
              );
          }
          setError(null); // Clear error if names successfully extracted
        }
        // If no names found, set error to inform user
        if (!options || options.length === 0) {
          setError(`No neighborhoods found for ${selectedCity}`);
        }
        setNeighborhoods(options);
      } catch (err) {
        console.error(`Failed to load ${selectedCity} GeoJSON`, err);
        setError('Failed to load neighborhoods');
      } finally {
        setLoading(false);
      }
    };

    void fetchNeighborhoods();
  }, [geoJsonUrl, selectedCity]);

  // Reset search term when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Get latitude and longitude for a neighborhood by averaging the coordinates of its geometry
  const getNeighborhoodLatLong = (geometry: Geometry) => {
    const coords =
      geometry.type === 'Polygon'
        ? geometry.coordinates.flat(1)
        : geometry.type === 'MultiPolygon'
          ? geometry.coordinates.flat(2)
          : [];

    const lons = coords.map(([lng]) => lng);
    const lats = coords.map(([, lat]) => lat);

    const longitude = lons.reduce((sum, value) => sum + value, 0) / lons.length;
    const latitude = lats.reduce((sum, value) => sum + value, 0) / lats.length;

    return { latitude, longitude };
  };

  const handleSelect = (selectedValue: string) => {
    const selectedNeighborhood = neighborhoods.find(
      (neighborhood) => neighborhood.name === selectedValue,
    );

    if (selectedNeighborhood) {
      setLatitude(selectedNeighborhood.latitude);
      setLongitude(selectedNeighborhood.longitude);
    }

    onChange(selectedValue);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div
      className={`relative ${width}`}
      data-latitude={latitude}
      data-longitude={longitude}
    >
      <div
        className={`input input-bordered w-full flex items-center justify-between cursor-pointer ${
          disabled || !selectedCity ? 'input-disabled bg-base-200' : ''
        } ${error ? 'input-error' : ''}`}
        onClick={() =>
          !disabled && selectedCity && !loading && setIsOpen(!isOpen)
        }
        onKeyDown={(e) =>
          !disabled &&
          selectedCity &&
          !loading &&
          e.key === 'Enter' &&
          setIsOpen(!isOpen)
        }
        role='button'
        tabIndex={0}
      >
        <span className={!value ? 'text-base-content/50' : ''}>
          {loading ? (
            <span className='loading loading-spinner loading-sm'></span>
          ) : error ? (
            <span className='text-error'>{error}</span>
          ) : (
            value || placeholder
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen &&
        !disabled &&
        selectedCity &&
        !loading &&
        neighborhoods.length > 0 && (
          <>
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
              role='button'
              tabIndex={0}
            />
            <div className='absolute z-20 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-80 overflow-hidden'>
              <div className='p-2 border-b border-base-300 sticky top-0 bg-base-100'>
                <input
                  type='text'
                  className='input input-bordered input-sm w-full'
                  placeholder='Search neighborhood...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <div className='overflow-y-auto max-h-64'>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <div
                      key={`${option.name}-${index}`}
                      className={`px-3 py-2 cursor-pointer hover:bg-base-200 transition-colors ${
                        value === option.name
                          ? 'bg-primary/10 text-primary font-medium'
                          : ''
                      }`}
                      onClick={() => handleSelect(option.name)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSelect(option.name)
                      }
                      role='button'
                      tabIndex={0}
                    >
                      {option.name}
                    </div>
                  ))
                ) : (
                  <div className='px-3 py-4 text-center text-base-content/50'>
                    {searchTerm
                      ? 'No neighborhoods match your search'
                      : 'No neighborhoods available'}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default SearchableSelect;
