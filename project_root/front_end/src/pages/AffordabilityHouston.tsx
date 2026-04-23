import AffordabilityCityView from './Affordability/AffordabilityCityView';
import {
  HOUSTON_GEOJSON_URL,
  HOUSTON_INITIAL_CENTER,
  HOUSTON_INITIAL_ZOOM,
} from '../constants';

const AffordabilityHouston = () => (
  <AffordabilityCityView
    cityTitle='Houston'
    profileCity='Houston'
    sourceIdPrefix='houston'
    geoJsonUrl={HOUSTON_GEOJSON_URL}
    initialCenter={HOUSTON_INITIAL_CENTER}
    initialZoom={HOUSTON_INITIAL_ZOOM}
  />
);

export default AffordabilityHouston;
