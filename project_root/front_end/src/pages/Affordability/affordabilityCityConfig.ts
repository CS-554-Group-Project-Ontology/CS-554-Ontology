import {
  HOUSTON_GEOJSON_URL,
  HOUSTON_INITIAL_CENTER,
  HOUSTON_INITIAL_ZOOM,
  NYC_GEOJSON_URL,
  NYC_INITIAL_CENTER,
  NYC_INITIAL_ZOOM,
  SF_GEOJSON_URL,
  SF_INITIAL_CENTER,
  SF_INITIAL_ZOOM,
  // JERSEY_CITY_GEOJSON_URL,
  // JERSEY_CITY_INITIAL_CENTER,
  // JERSEY_CITY_INITIAL_ZOOM,
} from '../../constants';
import { checkString } from '../../helpers';

export interface AffordabilityCityConfig {
  slug: string;
  cityTitle: string;
  profileCity: string;
  sourceIdPrefix: string;
  geoJsonUrl: string;
  initialCenter: [number, number];
  initialZoom: number;
}

// Map of city slugs to their configurations for affordability insights
// you can add more cities to this map by following the structure of existing entries
export const AFFORDABILITY_CITY_CONFIGS_MAP: Record<
  string,
  AffordabilityCityConfig
> = {
  nyc: {
    slug: 'nyc',
    cityTitle: 'New York City',
    profileCity: 'New York',
    sourceIdPrefix: 'nyc',
    geoJsonUrl: NYC_GEOJSON_URL,
    initialCenter: NYC_INITIAL_CENTER,
    initialZoom: NYC_INITIAL_ZOOM,
  },
  sf: {
    slug: 'sf',
    cityTitle: 'San Francisco',
    profileCity: 'San Francisco',
    sourceIdPrefix: 'sf',
    geoJsonUrl: SF_GEOJSON_URL,
    initialCenter: SF_INITIAL_CENTER,
    initialZoom: SF_INITIAL_ZOOM,
  },
  houston: {
    slug: 'houston',
    cityTitle: 'Houston',
    profileCity: 'Houston',
    sourceIdPrefix: 'houston',
    geoJsonUrl: HOUSTON_GEOJSON_URL,
    initialCenter: HOUSTON_INITIAL_CENTER,
    initialZoom: HOUSTON_INITIAL_ZOOM,
  },
  /*
  jc: {
    slug: 'jc',
    cityTitle: 'Jersey City',
    profileCity: 'Jersey City',
    sourceIdPrefix: 'jc',
    geoJsonUrl: JERSEY_CITY_GEOJSON_URL,
    initialCenter: JERSEY_CITY_INITIAL_CENTER,
    initialZoom: JERSEY_CITY_INITIAL_ZOOM,
  },
  */
};

export const AFFORDABILITY_CITY_LIST = Object.values(
  AFFORDABILITY_CITY_CONFIGS_MAP,
);
export const AFFORDABILITY_DEFAULT_CITY_SLUG = 'nyc';

// Utility function to get city config by slug with fallback to default
export const getAffordabilityCityConfig = (citySlug: string) =>
  AFFORDABILITY_CITY_CONFIGS_MAP[citySlug] ?? null;

// Utility function to get city path by slug and optional neighborhood
export const createAffordabilityCityPath = (
  citySlug: string,
  neighborhood?: string,
) => {
  const basePath = `/affordability/${citySlug}`;
  return neighborhood
    ? `${basePath}/${encodeURIComponent(neighborhood)}`
    : basePath;
};

// Utility function to check if a city is an affordability city in the list
export const isAffordabilityCity = (city: string) => {
  try {
    const normalizedCity = checkString(city, 'City');
    if (!normalizedCity) {
      return false;
    }

    return AFFORDABILITY_CITY_LIST.some(
      (cityConfig) =>
        cityConfig.profileCity === normalizedCity ||
        cityConfig.cityTitle === normalizedCity,
    );
  } catch (e) {
    console.error(e);
    return false;
  }
};
