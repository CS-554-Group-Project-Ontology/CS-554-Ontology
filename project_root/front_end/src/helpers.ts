import { scaleLinear } from 'd3-scale';

import type { NYCFeature } from './types';

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
