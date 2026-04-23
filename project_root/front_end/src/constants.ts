// Constants for GeoJSON URLs and initial map settings
export const NYC_GEOJSON_URL =
  'https://gist.githubusercontent.com/PollefeysC/da321dabb6455a52cfe0e121b314da51/raw/2725bf0b9ca897c590bdb592040ab587e4348725/nyc.geojson';

export const SF_GEOJSON_URL =
  'https://gist.githubusercontent.com/PollefeysC/f2f3bc6cb40e1edcaa0ae94c48c14cab/raw/0927e4107ea832d01de8dae70e0c8efc05ae780f/sf.geojson';

export const HOUSTON_GEOJSON_URL =
  'https://gist.githubusercontent.com/PollefeysC/4158b5b31f2e862362fef059da811dfb/raw/8612c7813439f31b9773b59c1446f62f64973670/houston.geojson';

// City options for dropdowns
export const CITY_OPTIONS: string[] = ['New York', 'San Francisco', 'Houston'];

// Cities initial coordinates
export const NYC_INITIAL_CENTER: [number, number] = [-74.0242, 40.6941];
export const SF_INITIAL_CENTER: [number, number] = [-122.4723, 37.7622];
export const HOUSTON_INITIAL_CENTER: [number, number] = [-95.5659, 29.7308];

// Cities Initial zoom level for the map
export const NYC_INITIAL_ZOOM: number = 10.12;
export const SF_INITIAL_ZOOM: number = 11.21;
export const HOUSTON_INITIAL_ZOOM: number = 9.87;
