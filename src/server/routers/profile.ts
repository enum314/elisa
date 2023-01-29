import { ratelimit } from '@server/middlewares/ratelimit';
import { withProfile } from '@server/middlewares/withProfile';
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

		return profile ?? null;
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

			await ctx.prisma.profile.create({
				data: {
					...input,
					userId: ctx.session.user.id,
					firstName: input.firstName.trim(),
					middleName: input.middleName.trim(),
					lastName: input.lastName.trim(),
				},
			});
		}),
	editMain: authProcedure
		.use(ratelimit('profile.editMain', { points: 10, duration: 60 }))
		.use(withProfile)
		.input(
			z
				.object({
					biography: z.string().max(196),
					nickname: z.string().max(16),
				})
				.strict(),
		)
		.mutation(async ({ input, ctx }) => {
			await ctx.prisma.profile.update({
				where: {
					userId: ctx.session.user.id,
				},
				data: {
					biography: input.biography?.trim(),
					nickname: input.nickname?.trim(),
				},
			});
		}),
	editPrivacy: authProcedure
		.use(ratelimit('profile.editPrivacy', { points: 10, duration: 60 }))
		.use(withProfile)
		.input(
			z
				.object({
					allowFriendships: z.boolean().optional(),
					allowChatRequests: z.boolean().optional(),
					globalChat: z.boolean().optional(),
				})
				.strict(),
		)
		.mutation(async ({ input, ctx }) => {
			await ctx.prisma.profile.update({
				where: {
					userId: ctx.session.user.id,
				},
				data: input,
			});
		}),
});
