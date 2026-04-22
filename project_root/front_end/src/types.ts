import type { Feature, Geometry } from 'geojson';

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

// SF and Houston do not have neighborhood but name property
// So to make it work, we need to normalize the geojson to mach NYC
export const normalizeGeoJSON = (geojson: any, city: string) => {
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