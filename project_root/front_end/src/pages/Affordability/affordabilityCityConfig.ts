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
} from '../../constants';

export interface AffordabilityCityConfig {
  slug: string;
  cityTitle: string;
  profileCity: string;
  sourceIdPrefix: string;
  geoJsonUrl: string;
  initialCenter: [number, number];
  initialZoom: number;
}

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
};

export const AFFORDABILITY_CITY_LIST = Object.values(
  AFFORDABILITY_CITY_CONFIGS_MAP,
);
export const AFFORDABILITY_DEFAULT_CITY_SLUG = 'nyc';

// Utility function to get city config by slug with fallback to default
export const getAffordabilityCityConfig = (citySlug: string) =>
  AFFORDABILITY_CITY_CONFIGS_MAP[citySlug] ?? null;

// Utility function to get city path by slug
export const createAffordabilityCityPath = (citySlug: string) =>
  `/affordability/${citySlug}`;
