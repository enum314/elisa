import { ratelimit } from '@server/middlewares/ratelimit';
import { adminProcedure, router } from '@server/trpc';
import { TRPCError } from '@trpc/server';
import { Permission } from '@utils/Constants';
import { z } from 'zod';

export const rolesRouter = router({
	list: adminProcedure.query(async ({ ctx }) => {
		const data = await ctx.prisma.role.findMany({
			orderBy: {
				id: 'asc',
			},
		});

		return data;
	}),
	get: adminProcedure
		.input(
			z
				.object({
					id: z.string().cuid(),
				})
				.strict(),
		)
		.query(async ({ ctx, input }) => {
			const role = await ctx.prisma.role.findUnique({
				where: input,
			});

			if (!role) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}

			return role;
		}),
	create: adminProcedure
		.use(ratelimit('admin.roles.create', { points: 1, duration: 15 }))
		.input(
			z
				.object({
					name: z.string().min(3).max(16),
					color: z.string().min(4).max(9).regex(/^#/),
					permissions: z.nativeEnum(Permission).array(),
				})
				.strict(),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.role.create({
				data: {
					...input,
					name: input.name.trim(),
				},
			});
		}),
	edit: adminProcedure
		.use(ratelimit('admin.roles.edit', { points: 3, duration: 15 }))
		.input(
			z
				.object({
					id: z.string().cuid(),
					data: z
						.object({
							name: z.string().min(3).max(16),
							color: z.string().min(4).max(9).regex(/^#/),
							permissions: z.nativeEnum(Permission).array(),
						})
						.strict(),
				})
				.strict(),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.role.update({
				where: {
					id: input.id,
				},
				data: {
					...input.data,
					name: input.data.name.trim(),
				},
			});
		}),
	delete: adminProcedure
		.use(ratelimit('admin.roles.delete', { points: 1, duration: 30 }))
		.input(
			z
				.object({
					id: z.string().cuid(),
				})
				.strict(),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.role.delete({
				where: input,
			});
		}),
});
