import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FredObservation } from '../../types';

type Props = {
  data: FredObservation[];
  yLabel: string;
};

function TimeSeriesChart({ data, yLabel }: Props) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='var(--color-base-300)' />
        <XAxis
          dataKey='date'
          tick={{ fontSize: 12 }}
          tickFormatter={(d: string) => d.slice(0, 7)}
          minTickGap={40}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          width={60}
          label={{
            value: yLabel,
            angle: -90,
            position: 'insideLeft',
            style: { fontSize: 12, textAnchor: 'middle' },
          }}
        />
        <Tooltip
          formatter={(v) => (v == null ? '—' : String(v))}
        />
        <Line
          type='monotone'
          dataKey='value'
          stroke='var(--color-primary)'
          dot={false}
          connectNulls={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TimeSeriesChart;
