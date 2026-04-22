import type { Feature, Geometry } from 'geojson';
import { NYC_GEOJSON } from './mapbox-gl/data/nyc-geojson';
import { HOUSTON_GEOJSON } from './mapbox-gl/data/houston-geojson';
import { SF_GEOJSON } from './mapbox-gl/data/sf-geojson';

export type GetMeData = {
  getMe?: {
    economic_profile?: TsEconomicProfile | null;
  } | null;
};

export type GetCostOfLivingByCityAndNeighborhoodData = {
  getCostOfLivingByCityAndNeighborhood?: TsLiabilities | null;
};

export interface TsLiabilities {
  rent?: number;
  insuranceDeductibles?: number;
  utilities?: number;
  other?: number;
}

export interface TsEconomicProfile {
  income?: number;
  city?: string;
  neighborhood?: string;
  liabilities?: TsLiabilities;
}

export type NeighborhoodProperties = {
  neighborhood?: string;
  boroughCode?: string;
  borough?: string;
  '@id'?: string;
};

const normalizeGeoJSON = (geojson: any, city: string) => {
  return geojson.features
    .filter((f: any) => f.geometry !== null)
    .map((f: any) => ({
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        neighborhood:
          f.properties.neighborhood || f.properties.name || 'Unknown',
        city,
      },
    }));
};

export type CityFeature = Feature<Geometry | null, NeighborhoodProperties>;

export const NYC_FEATURES_WITH_NEIGHBORHOOD = normalizeGeoJSON(
  NYC_GEOJSON,
  'New York City',
);

export const SF_FEATURES_WITH_NEIGHBORHOOD = normalizeGeoJSON(
  SF_GEOJSON,
  'San Francisco',
) as Feature<Geometry, NeighborhoodProperties>[];

export const HOUSTON_FEATURES_WITH_NEIGHBORHOOD = normalizeGeoJSON(
  HOUSTON_GEOJSON,
  'Houston',
) as Feature<Geometry, NeighborhoodProperties>[];
