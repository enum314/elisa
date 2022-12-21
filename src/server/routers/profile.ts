import { ratelimit } from '@server/ratelimit';
import { authProcedure, router } from '@server/trpc';
import { TRPCError } from '@trpc/server';
import { Gender } from '@utils/Constants';
import { z } from 'zod';

export const profileRouter = router({
	self: authProcedure.query(async ({ ctx }) => {
		const profile = await ctx.prisma.profile.findUnique({
			where: {
				userId: ctx.session.user.id,
			},
		});

		return { profile };
	}),
	setup: authProcedure
		.use(ratelimit('profile.setup', { points: 1, duration: 300 }))
		.input(
			z
				.object({
					firstName: z.string().min(3).max(24),
					middleName: z.string().min(0).max(24),
					lastName: z.string().min(3).max(24),
					birthdate: z.date({ coerce: true }),
					gender: z.nativeEnum(Gender),
				})
				.strict(),
		)
		.mutation(async ({ input, ctx }) => {
			const exists = await ctx.prisma.profile.findUnique({
				where: {
					userId: ctx.session.user.id,
				},
			});

			if (exists) {
				throw new TRPCError({ code: 'CONFLICT' });
			}

			const data = await ctx.prisma.profile.create({
				data: {
					userId: ctx.session.user.id,
					...input,
				},
			});

			return data;
		}),
	editMain: authProcedure
		.use(ratelimit('profile.edit', { points: 10, duration: 60 }))
		.input(
			z
				.object({
					biography: z.string().max(196).optional(),
					nickname: z.string().max(16).optional(),
				})
				.strict(),
		)
		.mutation(async ({ input, ctx }) => {
			const data = await ctx.prisma.profile.update({
				where: {
					userId: ctx.session.user.id,
				},
				data: {
					biography: input.biography?.trim(),
					nickname: input.nickname?.trim(),
				},
			});

			return data;
		}),
	editPrivacy: authProcedure
		.use(ratelimit('profile.edit', { points: 10, duration: 60 }))
		.input(
			z
				.object({
					allowFriendships: z.boolean().optional(),
					allowChatRequests: z.boolean().optional(),
				})
				.strict(),
		)
		.mutation(async ({ input, ctx }) => {
			const data = await ctx.prisma.profile.update({
				where: {
					userId: ctx.session.user.id,
				},
				data: input,
			});

			return data;
		}),
});
