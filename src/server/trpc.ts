import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import type { Context } from './context';

const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

export const authProcedure = t.procedure.use(
	t.middleware(({ ctx, next }) => {
		if (ctx.session?.user) {
			return next({
				ctx: {
					// infers the `session` as non-nullable
					session: { ...ctx.session, user: ctx.session.user },
				},
			});
		}

		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}),
);

export const adminProcedure = t.procedure.use(
	t.middleware(({ ctx, next }) => {
		if (ctx.session?.user?.isAdmin) {
			return next({
				ctx: {
					// infers the `session` as non-nullable
					session: { ...ctx.session, user: ctx.session.user },
				},
			});
		}

		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}),
);
