import { SiteSettings } from '@prisma/client';
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { SiteSettingId } from '@utils/Constants';
import { prisma } from '@utils/prisma';
import { redis } from '@utils/redis';
import Filter from 'bad-words';
import { IncomingMessage } from 'http';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import ws from 'ws';

type CreateContextOptions = {
	session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	const cache = await redis.get(SiteSettingId);

	if (!cache) {
		let data = await prisma.siteSettings.findUnique({
			where: {
				id: SiteSettingId,
			},
		});

		if (!data) {
			data = await prisma.siteSettings.create({
				data: {
					id: SiteSettingId,
				},
			});
		}

		await redis.set(SiteSettingId, JSON.stringify(data));
	}

	const verified = JSON.parse(
		(await redis.get(SiteSettingId)) as string,
	) as SiteSettings;

	const filter = new Filter();

	filter.addWords(...verified.filteredWords);
	filter.removeWords(...verified.whitelistedWords);

	return {
		prisma,
		siteSettings: verified,
		filter,
		...opts,
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
	opts:
		| CreateNextContextOptions
		| NodeHTTPCreateContextFnOptions<IncomingMessage, ws>,
) => {
	const session = await getSession(opts);

	return await createContextInner({
		session,
	});
};

export type Context = inferAsyncReturnType<typeof createContext>;
