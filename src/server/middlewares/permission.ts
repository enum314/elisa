import { middleware } from '@server/trpc';
import { TRPCError } from '@trpc/server';
import { Permission } from '@utils/Constants';
import { NonEmptyArray } from '@utils/helpers';

export const permission = (permissions: NonEmptyArray<Permission>) =>
	middleware(async ({ ctx, next }) => {
		if (!ctx.session?.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}

		const user = await ctx.prisma.user.findUnique({
			select: {
				isAdmin: true,
				role: true,
			},
			where: {
				id: ctx.session.user.id,
			},
		});

		if (!user) {
			throw new TRPCError({ code: 'FORBIDDEN' });
		}

		const permitted =
			user.isAdmin ||
			permissions.every((perm) => user.role?.permissions.includes(perm));

		if (!permitted) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			});
		}

		return next({
			ctx: {
				role: user.role,
			},
		});
	});
