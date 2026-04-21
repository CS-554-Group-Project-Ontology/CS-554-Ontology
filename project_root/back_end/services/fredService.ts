import dotenv from 'dotenv';
dotenv.config();

const ALLOWED_SERIES = new Set<string>([
    'CPIAUCSL',
    'UNRATE',
    'MORTGAGE30US',
    'FEDFUNDS',
    'MSPUS',
    'GASREGW',
]);
const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';

export type FredObservation = { date: string; value: number | null };

interface FredApiResponse {
    observations: Array<{ date: string; value: string }>;
}

export function isAllowedSeries(seriesId: string): boolean {
    return ALLOWED_SERIES.has(seriesId);
}

export async function fetchFredSeries(
    seriesId: string,
    start?: string,
    end?: string,
): Promise<FredObservation[]> {
    const apiKey = process.env.FRED_API_KEY;
    if (!apiKey) {
        throw new Error('FRED_API_KEY not configured');
    }

    const params = new URLSearchParams({
        series_id: seriesId,
        file_type: 'json',
        api_key: apiKey,
    });
    if (start) params.set('observation_start', start);
    if (end) params.set('observation_end', end);

    const res = await fetch(`${FRED_BASE}?${params.toString()}`);
    if (!res.ok) {
        throw new Error(`FRED API error: ${res.status}`);
    }

    const data = (await res.json()) as FredApiResponse;
    return data.observations.map((o) => ({
        date: o.date,
        value: o.value === '.' ? null : Number(o.value),
    }));
}
