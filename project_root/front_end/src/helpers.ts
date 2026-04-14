import { scaleLinear } from 'd3-scale';
import type {
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
  Feature,
} from 'geojson';

import type { NeighborhoodProperties, NYCFeature } from './types';
import { NYC_GEOJSON } from './mapbox-gl/data/nyc-geojson';

const color = scaleLinear<string>()
  .domain([1, 20])
  .clamp(true)
  .range(['#fff', '#409A99']);

export function nameFn(feature: NYCFeature) {
  return feature.properties?.neighborhood ?? null;
}

export function nameLength(feature: NYCFeature) {
  const name = nameFn(feature);
  return name ? name.length : 0;
}

export function fillFn(feature: NYCFeature) {
  return color(nameLength(feature));
}
