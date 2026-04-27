export interface FoundationsSeriesConfig {
  seriesId: string;
  title: string;
  yLabel: string;
  description: string;
}

export const FOUNDATIONS_SERIES: FoundationsSeriesConfig[] = [
  {
    seriesId: 'CPILFESL',
    title: 'Core Consumer Price Index (Inflation)',
    yLabel: 'Index (1982-84=100)',
    description:
      "Tracks how much everyday things cost on average. When this goes up, every dollar doesn't go as far as it used to.",
  },
  {
    seriesId: 'UNRATE',
    title: 'U.S. Unemployment Rate',
    yLabel: '%',
    description:
      "How many people want a job but can't find one. When this is high, jobs are harder to get and raises are smaller. When it's low, companies have to compete for workers which tends to be a good time to get paid more.",
  },
  {
    seriesId: 'MORTGAGE30US',
    title: '30-Year Fixed Mortgage Rate',
    yLabel: '%',
    description:
      'The typical interest rate on a 30-year home loan. Small changes here are a big deal, as a 1% jump can add hundreds to a monthly house payment.',
  },
  {
    seriesId: 'FEDFUNDS',
    title: 'Federal Funds Rate',
    yLabel: '%',
    description:
      'The interest rate the Fed sets for banks. Pretty much everything else that the bank makes money on follows this when it goes up or down, as well as what your savings account could grant you.',
  },
  {
    seriesId: 'ASPUS',
    title: 'Average Sales Price of Houses Sold',
    yLabel: 'USD',
    description:
      'The average price a house sells for in the U.S. When this keeps climbing, buying gets harder. When it flattens or dips, the market is cooling off.',
  },
  {
    seriesId: 'GASREGW',
    title: 'U.S. Regular Gasoline Price',
    yLabel: 'USD / gallon',
    description:
      'The average price of gas at the pump. When this jumps, it hits almost everything else. Shipping, flights, and even groceries, since moving stuff gets more expensive.',
  },
  {
    seriesId: 'DGS2',
    title: 'Market Yield on U.S. Treasury 2-Year',
    yLabel: '%',
    description:
      'The interest rate on 2-year U.S. government bonds. When this goes up, it can make borrowing more expensive and can signal that investors expect higher interest rates in the future.',
  },
  {
    seriesId: 'A191RL1Q225SBEA',
    title: 'Real Gross Domestic Product',
    yLabel: 'USD',
    description:
      'Tracks the total value of all goods and services produced in the U.S. adjusted for inflation. When this goes up, it indicates economic growth. When it goes down, it might signal a recession.',
  },
];
