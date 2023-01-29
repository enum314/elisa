import { adminProcedure, router } from '@server/trpc';
import { z } from 'zod';

const MAX_LIMIT = 30;

export const usersRouter = router({
	list: adminProcedure
		.input(
			z
				.object({
					page: z.number().positive(),
					filter: z.enum(['all', 'user', 'admin']),
					query: z.string().optional(),
				})
				.strict(),
		)
		.query(async ({ ctx, input }) => {
			const { page, query, filter } = input;

			const skip = page * MAX_LIMIT - MAX_LIMIT;
			const take = MAX_LIMIT;

			if (filter === 'admin') {
				const data = await ctx.prisma.user.findMany({
					where: {
						isAdmin: true,
						email: query
							? {
									search: query,
							  }
							: undefined,
					},
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						profile: true,
					},
					orderBy: {
						name: 'asc',
					},
					skip,
					take,
				});

				return {
					data,
					pages: Math.ceil(data.length / MAX_LIMIT),
					count: data.length,
				};
			}

			if (filter === 'user') {
				const data = await ctx.prisma.user.findMany({
					where: {
						isAdmin: false,
						email: query
							? {
									search: query,
							  }
							: undefined,
					},
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						profile: true,
					},
					orderBy: {
						name: 'asc',
					},
					skip,
					take,
				});

				return {
					data,
					pages: Math.ceil(data.length / MAX_LIMIT),
					count: data.length,
				};
			}

			const data = await ctx.prisma.user.findMany({
				where: query
					? {
							email: {
								search: query,
							},
					  }
					: undefined,
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
					profile: true,
				},
				orderBy: {
					name: 'asc',
				},
				skip,
				take,
			});

			return {
				data,
				pages: Math.ceil(data.length / MAX_LIMIT),
				count: data.length,
			};
		}),
});
