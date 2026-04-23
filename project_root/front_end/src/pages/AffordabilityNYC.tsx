import AffordabilityCityView from './Affordability/AffordabilityCityView';
import {
  NYC_GEOJSON_URL,
  NYC_INITIAL_CENTER,
  NYC_INITIAL_ZOOM,
} from '../constants';

const AffordabilityNYC = () => (
  <AffordabilityCityView
    cityTitle='New York City'
    profileCity='New York'
    sourceIdPrefix='nyc'
    geoJsonUrl={NYC_GEOJSON_URL}
    initialCenter={NYC_INITIAL_CENTER}
    initialZoom={NYC_INITIAL_ZOOM}
  />
);

export default AffordabilityNYC;
