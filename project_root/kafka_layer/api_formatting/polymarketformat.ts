/*
A lot of the data has been removed to keep essential aspects needed for the project.
[
  {
    "id": "<string>",
    "ticker": "<string>",
    "slug": "<string>",
    "title": "<string>",
    "subtitle": "<string>",
    "description": "<string>",
    "startDate": "2023-11-07T05:31:56Z",
    "endDate": "2023-11-07T05:31:56Z",
    "active": true,
    "closed": true,
    "liquidity": 123,
    "volume": 123,
    "category": "<string>",
    "subcategory": "<string>"
  }
]
*/

export interface PolymarketData {
  id: string;
  slug: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  closed?: boolean;
  liquidity?: number;
  volume?: number;
  category?: string;
  subcategory?: string;
}
