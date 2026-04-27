import type { Feature, Geometry } from 'geojson';
import { checkString } from './helpers';

export type GetMeData = {
  getMe?: {
    economic_profile?: TsEconomicProfile | null;
  } | null;
};

export type GetCostOfLivingByCityAndNeighborhoodData = {
  getCostOfLivingByCityAndNeighborhood?: TsLiabilities | null;
};

export type GetUserCountsByCityData = {
  getUserCountsByCity: TsUserCitiesCount;
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

export type CitiesData = {
  city: string;
  count: number;
};

export type UserNeighborhoodsCount = {
  city: string;
  neighborhood: string;
  count: number;
};

export type TsUserCitiesCount = {
  totalCount: number;
  citiesData: CitiesData[];
  popularNeighborhoods: UserNeighborhoodsCount[];
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

// SF and Houston do not have neighborhood but name property
// So to make it work, we need to normalize the geojson to mach NYC
export const normalizeGeoJSON = (geojson: any, city: string) => {
  if (!geojson) return [];

  try {
    city = checkString(city, 'City');
  } catch (error) {
    console.error(error);
    return [];
  }
  
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
