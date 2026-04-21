export interface FoundationsSeriesConfig {
  seriesId: string;
  title: string;
  yLabel: string;
  description: string;
}

export const FOUNDATIONS_SERIES: FoundationsSeriesConfig[] = [
  {
    seriesId: 'CPIAUCSL',
    title: 'Consumer Price Index (Inflation)',
    yLabel: 'Index (1982-84=100)',
    description:
      'The CPI tracks the average change in prices paid by urban consumers for a basket of goods and services. Rising CPI means your dollar buys less over time.',
  },
  {
    seriesId: 'UNRATE',
    title: 'U.S. Unemployment Rate',
    yLabel: '%',
    description:
      'The percentage of the labor force actively looking for work. High unemployment signals economic stress; low unemployment tends to drive wage growth and worker bargaining power.',
  },
];
