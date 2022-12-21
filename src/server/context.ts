import { getServerAuthSession } from '@server/common/getServerAuthSession';
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';

type CreateContextOptions = {
	session: Session | null;
	req: NextApiRequest;
	res: NextApiResponse;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	return {
		prisma,
		...opts,
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
	const { req, res } = opts;

	// Get the session from the server using the unstable_getServerSession wrapper function
	const session = await getServerAuthSession({ req, res });

	return await createContextInner({
		session,
		req,
		res,
	});
};

export type Context = inferAsyncReturnType<typeof createContext>;
