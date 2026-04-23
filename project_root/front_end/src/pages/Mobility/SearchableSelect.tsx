import axios from 'axios';
import { useState, useEffect, useMemo, use } from 'react';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { normalizeGeoJSON } from '../../types';
import {
  HOUSTON_GEOJSON_URL,
  NYC_GEOJSON_URL,
  SF_GEOJSON_URL,
} from '../../constants';

// SearchableSelect Component
interface SearchableSelectProps {
  selectedCity: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  selectedCity,
  value,
  onChange,
  placeholder = 'Select a neighborhood',
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return neighborhoods;
    return neighborhoods.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, neighborhoods]);

  // Determine GeoJSON URL based on selected city
  const geoJsonUrl = useMemo(() => {
    switch (selectedCity) {
      case 'New York':
        return NYC_GEOJSON_URL;
      case 'San Francisco':
        return SF_GEOJSON_URL;
      case 'Houston':
        return HOUSTON_GEOJSON_URL;
      default:
        return '';
    }
  }, [selectedCity]);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        setLoading(true);
        const resp =
          await axios.get<FeatureCollection<Geometry, GeoJsonProperties>>(
            geoJsonUrl,
          );
        const normalizedFeatures = normalizeGeoJSON(resp.data, selectedCity);
        let names: string[] = [];

        if (Array.isArray(normalizedFeatures)) {
          // If already array of strings, use as is
          if (typeof normalizedFeatures[0] === 'string') {
            names = normalizedFeatures as string[];
          } else {
            // Otherwise, try to extract from properties
            names = normalizedFeatures
              .map(
                (feature: any) =>
                  feature?.properties?.name ||
                  feature?.properties?.neighborhood ||
                  '',
              )
              .filter((n: string) => n);
          }
        }
        if (names.length === 0) {
          setError(`No neighborhoods found for ${selectedCity}`);
        }
        setNeighborhoods(names);
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

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className='relative w-full'>
      <div
        className={`input input-bordered w-full flex items-center justify-between cursor-pointer ${
          disabled || !selectedCity ? 'input-disabled bg-base-200' : ''
        } ${error ? 'input-error' : ''}`}
        onClick={() =>
          !disabled && selectedCity && !loading && setIsOpen(!isOpen)
        }
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
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
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
                      key={`${option}-${index}`}
                      className={`px-3 py-2 cursor-pointer hover:bg-base-200 transition-colors ${
                        value === option
                          ? 'bg-primary/10 text-primary font-medium'
                          : ''
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
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
