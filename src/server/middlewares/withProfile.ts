import { middleware } from '@server/trpc';
import { TRPCError } from '@trpc/server';

export const withProfile = middleware(async ({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	const profile = await ctx.prisma.profile.findUnique({
		where: {
			userId: ctx.session.user.id,
		},
	});

	if (!profile) {
		throw new TRPCError({ code: 'FORBIDDEN' });
	}

	return next({
		ctx: {
			// infers the `session` as non-nullable
			session: {
				...ctx.session,
				user: ctx.session.user,
			},
			profile,
		},
	});
});
