import { GraphQLError } from 'graphql';
import { verifyFirebaseToken } from '../Config/FirebaseAdmin.ts';
import { fetchFredSeries, isAllowedSeries } from '../services/fredService.ts';
import { getFredCache, setFredCache } from '../FredRedis.ts';

type ResolverContext = {
    token: string;
};

interface FredSeriesArgs {
    seriesId: string;
    start?: string;
    end?: string;
}

export const fredResolver = {
    Query: {
        fredSeries: async (
            _: unknown,
            args: FredSeriesArgs,
            context: ResolverContext,
        ) => {
            if (!context.token) {
                throw new GraphQLError('Unauthorized', {
                    extensions: { code: 'INVALID_ACCESS' },
                });
            }
            await verifyFirebaseToken(context.token);

            const { seriesId, start, end } = args;
            if (!isAllowedSeries(seriesId)) {
                throw new GraphQLError('Invalid series ID', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            const cached = await getFredCache(seriesId, start, end);
            if (cached) {
                return { seriesId, observations: cached };
            }

            const observations = await fetchFredSeries(seriesId, start, end);
            await setFredCache(seriesId, observations, start, end);
            return { seriesId, observations };
        },
    },
};
