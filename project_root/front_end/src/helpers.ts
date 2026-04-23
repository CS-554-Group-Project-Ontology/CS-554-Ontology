import { scaleLinear } from 'd3-scale';

import type { CityFeature } from './types';

const color = scaleLinear<string>()
  .domain([1, 20])
  .clamp(true)
  .range(['#fff', '#409A99']);

export function nameFn(feature: CityFeature) {
  return feature.properties?.neighborhood ?? null;
}

export function nameLength(feature: CityFeature) {
  const name = nameFn(feature);
  return name ? name.length : 0;
}

export function fillFn(feature: CityFeature) {
  return color(nameLength(feature));
}

export const formatCurrency = (value?: number) =>
  value !== undefined && value !== null ? `$${value.toLocaleString()}` : 'N/A';
