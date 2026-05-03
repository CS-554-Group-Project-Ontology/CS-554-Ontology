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
      'For everyday people, persistent core inflation forces the Fed to hold rates high to cool the economy, which tightens hiring, slows wage growth, and makes homes and cars harder to finance. Though it may not include the prices of food and energy its impact is felt on a monthly basis. With 53 to 60 percent of Americans living paycheck to paycheck year after year, borrowing has become a default mode of living in America. That makes core CPI one of the most important numbers in your financial life, because it determines the real value of the cash you hold, unless that cash is already invested in assets.',
  },
  {
    seriesId: 'UNRATE',
    title: 'U.S. Unemployment Rate',
    yLabel: '%',
    description:
      'This metrics essentially captures the percentage of people actively looking for work who cannot find a job. The Fed watches this alongside inflation because the two pull in opposite directions, low unemployment tends to push wages and prices up, while high unemployment cools both. Essentially they are the inverse of one another it terms of correlation. We think that it is worth noting that not all unemployment is the same. Some portion is always frictional, people between jobs, recent graduates searching, workers relocating which is healthy for society and upward mobility. Some portion is structural, a mismatch between the skills workers have and the skills employers need, often driven by automation, offshoring, or industry decline which has become an extremely relevant question given what our economy is going through currently . Economists generally consider a rate around 4 percent to be full employment for this reason. For everyday people, a low rate means leverage to negotiate raises, switch jobs for higher pay, and demand better conditions which gives them a health quality of life. A rising rate means quite the opposite, hiring freezes and stagnant wages which causes massive issue within society. It is one of the clearest real time signals of whether workers or employers hold the power in our current  economy.',
  },
  {
    seriesId: 'MORTGAGE30US',
    title: '30-Year Fixed Mortgage Rate',
    yLabel: '%',
    description:
      "The average interest rate on a 30-year fixed home loan, the most common mortgage product in the U.S. This rate tracks the 10-year Treasury yield plus a risk premium, which means it reflects long term expectations about inflation and economic growth within our country. For everyday people, small changes here are enormous because it effect whether or not homes will be affordable. A slight increase from 6 to 7 percent can add two to three hundred dollars to a monthly payment on a median priced home, which over 30 years compounds into tens of thousands of dollars in extra interest. This rate effectively helps to set the ceiling on how much a house when considering the income that a person has. It's one of the main reasons housing affordability has become surge a significant issue within recent years.",
  },
  {
    seriesId: 'FEDFUNDS',
    title: 'Federal Funds Rate',
    yLabel: '%',
    description:
      'This is the interest rate banks charge one another for overnight lending, set as a target range by the Federal Reserve. This is one of the levers the Federal Reserve can pull in order to fight inflation or stimulate the economy. Its impacts nearly every other rate in our current financial system be it serves as the base line metric.  Credit cards, APRs, auto loans, business lending, savings yields, and short term Treasury bills. This also ties into what we discussed with inflation. The FFF is meant to serve as a protective measure against inflation.  When this rate rises, borrowing gets expensive across the board, but savings accounts, CDs, and money market funds finally start paying meaningful interest. When it falls, loans get cheaper but cash loses its earning power, pushing people toward riskier assets to generate returns. This rate essentially effects how much people on can consume of a everyday basis.',
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
