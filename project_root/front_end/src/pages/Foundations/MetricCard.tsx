import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import queries from '../../queries';
import type { FredSeriesData } from '../../types';
import Loading from '../../components/Loading';
import TimeSeriesChart from './TimeSeriesChart';
import type { FoundationsSeriesConfig } from './foundationsConfig';

type Range = '1Y' | '5Y' | '10Y' | 'Max';
const RANGES: Range[] = ['1Y', '5Y', '10Y', 'Max'];

function startDateFor(range: Range): string | undefined {
  if (range === 'Max') return undefined;
  const years = { '1Y': 1, '5Y': 5, '10Y': 10 }[range];
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

type Props = {
  config: FoundationsSeriesConfig;
};

function MetricCard({ config }: Props) {
  const [range, setRange] = useState<Range>('5Y');
  const start = startDateFor(range);

  const { loading, error, data } = useQuery<FredSeriesData>(queries.FRED_SERIES, {
    variables: { seriesId: config.seriesId, start },
  });

  return (
    <div className='card bg-base-100 shadow'>
      <div className='card-body'>
        <div className='flex items-start justify-between gap-4 flex-wrap'>
          <h2 className='card-title'>{config.title}</h2>
          <div className='join'>
            {RANGES.map((r) => (
              <button
                key={r}
                type='button'
                className={`btn btn-sm join-item ${
                  r === range ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className='min-h-[300px] flex items-center justify-center'>
          {loading && <Loading />}
          {error && !loading && (
            <div className='alert alert-error'>
              <span>Failed to load data: {error.message}</span>
            </div>
          )}
          {data && !loading && (
            <TimeSeriesChart
              data={data.fredSeries.observations}
              yLabel={config.yLabel}
            />
          )}
        </div>

        <p className='text-sm text-base-content/80'>{config.description}</p>
      </div>
    </div>
  );
}

export default MetricCard;
