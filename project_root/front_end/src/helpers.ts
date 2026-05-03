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

export const checkString = (strVal: string, varName: string) => {
  if (!strVal)
    throw new Error(`${varName} is required and cannot be null or undefined`);

  if (typeof strVal !== 'string')
    throw new Error(
      `${varName} must be a string, but received ${typeof strVal}`,
    );

  strVal = strVal.trim();

  if (strVal.length === 0)
    throw new Error(`${varName} must not be empty or whitespace only`);

  if (!isNaN(+strVal))
    throw new Error(
      `${varName} must not be a numeric string, but received "${strVal}"`,
    );

  return strVal;
};

export const checkNumber = (num: number, varName: string) => {
  num = Number(num);
  if (isNaN(num))
    throw new Error(`${varName} must be a valid number, but received "${num}"`);
  if (num < 0)
    throw new Error(`${varName} must be a non-negative number`);
  return num;
};
