import type { Feature, Geometry } from 'geojson';
import { NYC_GEOJSON } from './mapbox-gl/data/nyc-geojson';

export type GetMeData = {
  getMe?: {
    economic_profile?: TsEconomicProfile | null;
  } | null;
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

export type NYCFeature = Feature<Geometry | null, NeighborhoodProperties>;

export interface FredObservation {
  date: string;
  value: number | null;
}

export interface FredSeriesResponse {
  seriesId: string;
  observations: FredObservation[];
}

export type FredSeriesData = {
  fredSeries: FredSeriesResponse;
};

export const FEATURES_WITH_NEIGHBORHOOD = (
  NYC_GEOJSON.features as NYCFeature[]
).filter(
  (feature): feature is Feature<Geometry, NeighborhoodProperties> =>
    feature.geometry !== null && !!feature.properties?.neighborhood,
);
