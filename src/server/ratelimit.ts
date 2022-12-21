import { TRPCError } from '@trpc/server';
import { redis } from '@utils/redis';
import {
	IRateLimiterStoreOptions,
	RateLimiterRedis,
	RateLimiterRes,
} from 'rate-limiter-flexible';

import { getIPAddressFromRequest } from './common/getIPAddressFromRequest';
import { middleware } from './trpc';

function createRateLimitHeaders(
	state: RateLimiterRes,
	opts: IRateLimiterStoreOptions,
): RateLimitResponse['headers'] {
	return [
		['Retry-After', `${state.msBeforeNext / 1000}`],
		['X-RateLimit-Limit', `${<number>opts.points}`],
		['X-RateLimit-Remaining', `${state.remainingPoints}`],
		[
			'X-RateLimit-Reset',
			new Date(Date.now() + state.msBeforeNext)
				.getMilliseconds()
				.toString(),
		],
	];
}

interface RateLimitOptions {
	points: number;
	duration: number;
}

interface RateLimitResponse {
	rateLimited: boolean;
	headers: [
		['Retry-After', string],
		['X-RateLimit-Limit', string],
		['X-RateLimit-Remaining', string],
		['X-RateLimit-Reset', string],
	];
}

async function consume(
	userId: string,
	keyPrefix: string,
	options: RateLimitOptions,
) {
	const opts: IRateLimiterStoreOptions = {
		storeClient: redis,
		keyPrefix: `ratelimit.${keyPrefix}`,
		points: options.points,
		duration: options.duration,
	};

	const rateLimiter = new RateLimiterRedis(opts);

	try {
		const state = await rateLimiter.consume(userId);

		return {
			rateLimited: false,
			headers: createRateLimitHeaders(state, opts),
		};
	} catch (err) {
		if (err instanceof RateLimiterRes) {
			return {
				rateLimited: true,
				headers: createRateLimitHeaders(err, opts),
			};
		}

		throw err;
	}
}

export const ratelimit = (key: string, opts: RateLimitOptions) =>
	middleware(async ({ ctx, next }) => {
		if (ctx.session?.user) {
			try {
				const status = await consume(
					getIPAddressFromRequest(ctx.req),
					key,
					opts,
				);

				for (const [key, value] of status.headers) {
					ctx.res.setHeader(key, value);
				}

				if (status.rateLimited) {
					throw new TRPCError({
						code: 'TOO_MANY_REQUESTS',
					});
				}

				return next({
					ctx: {
						// infers the `session` as non-nullable
						session: {
							...ctx.session,
							user: ctx.session.user,
						},
						req: ctx.req,
						res: ctx.res,
					},
				});
			} catch (err) {
				if (
					err instanceof TRPCError &&
					err.code === 'TOO_MANY_REQUESTS'
				) {
					throw err;
				}

				console.error(err);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
			}
		}

		throw new TRPCError({ code: 'UNAUTHORIZED' });
	});
