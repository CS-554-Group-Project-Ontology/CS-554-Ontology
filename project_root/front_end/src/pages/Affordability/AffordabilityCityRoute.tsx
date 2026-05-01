import { useParams } from 'react-router-dom';
import { getAffordabilityCityConfig } from './affordabilityCityConfig';
import NotFound from '../../components/NotFound';
import AffordabilityCityView from './AffordabilityCityView';

const AffordabilityCityRoute = () => {
  const { citySlug, popularNeighborhood } = useParams();
  const cityConfig = citySlug ? getAffordabilityCityConfig(citySlug) : null;

  if (!cityConfig) {
    return <NotFound />;
  }
  return (
    <AffordabilityCityView
      cityTitle={cityConfig.cityTitle}
      profileCity={cityConfig.profileCity}
      sourceIdPrefix={cityConfig.sourceIdPrefix}
      geoJsonUrl={cityConfig.geoJsonUrl}
      initialCenter={cityConfig.initialCenter}
      initialZoom={cityConfig.initialZoom}
      initialNeighborhood={popularNeighborhood ? decodeURIComponent(popularNeighborhood) : undefined}
    />
  );
};

export default AffordabilityCityRoute;
