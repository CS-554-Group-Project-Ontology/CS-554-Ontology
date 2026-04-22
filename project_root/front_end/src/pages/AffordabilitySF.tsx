import AffordabilityCityView from './Affordability/AffordabilityCityView';
import {
  SF_GEOJSON_URL,
  SF_INITIAL_CENTER,
  SF_INITIAL_ZOOM,
} from '../constants';

const AffordabilitySF = () => (
  <AffordabilityCityView
    cityTitle='San Francisco'
    profileCity='San Francisco'
    sourceIdPrefix='sf'
    geoJsonUrl={SF_GEOJSON_URL}
    initialCenter={SF_INITIAL_CENTER}
    initialZoom={SF_INITIAL_ZOOM}
  />
);

export default AffordabilitySF;
