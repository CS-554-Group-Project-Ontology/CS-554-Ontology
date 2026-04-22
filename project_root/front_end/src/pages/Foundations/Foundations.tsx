import MetricCard from './MetricCard';
import { FOUNDATIONS_SERIES } from './foundationsConfig';

function Foundations() {
  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      <h1 className='text-3xl font-bold mb-2'>Foundations</h1>
      <p className='text-base-content/70 mb-6'>
        Indicators that shape every American's purchasing power. Each chart has a note on what this means for you.
      </p>

      <div className='grid gap-6 md:grid-cols-2'>
        {FOUNDATIONS_SERIES.map((config) => (
          <MetricCard key={config.seriesId} config={config} />
        ))}
      </div>
    </div>
  );
}

export default Foundations;
