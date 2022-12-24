import { getSiteSettings } from '@server/common/getSiteSettings';
import { ratelimit } from '@server/middlewares/ratelimit';
import { adminProcedure, publicProcedure, router } from '@server/trpc';
import { SiteSettingId } from '@utils/Constants';
import { z } from 'zod';

export const siteRouter = router({
	get: publicProcedure.query(async () => {
		const siteSettings = await getSiteSettings();

		return { companyName: siteSettings.companyName };
	}),
	settings: adminProcedure.query(async () => {
		const siteSettings = await getSiteSettings();

		return siteSettings;
	}),
	edit: adminProcedure
		.use(ratelimit('site.edit', { points: 5, duration: 20 }))
		.input(
			z
				.object({
					companyName: z.string().min(3).max(24).optional(),
					filteredWords: z
						.string()
						.min(3)
						.max(16)
						.array()
						.max(64)
						.optional(),
					whitelistedWords: z
						.string()
						.min(3)
						.max(16)
						.array()
						.max(64)
						.optional(),
					globalChat: z.boolean().optional(),
					globalChatBlockProfanity: z.boolean().optional(),
				})
				.strict(),
		)
		.mutation(async ({ ctx, input }) => {
			const siteSettings = await getSiteSettings();

			await ctx.prisma.siteSettings.update({
				where: {
					id: SiteSettingId,
				},
				data: {
					companyName: input.companyName
						? input.companyName.trim()
						: siteSettings.companyName,
					filteredWords: input.filteredWords
						? input.filteredWords.map((word) => word.trim())
						: siteSettings.filteredWords,
					whitelistedWords: input.whitelistedWords
						? input.whitelistedWords.map((word) => word.trim())
						: siteSettings.whitelistedWords,
					globalChat:
						typeof input.globalChat === 'boolean'
							? input.globalChat
							: siteSettings.globalChat,
					globalChatBlockProfanity:
						typeof input.globalChatBlockProfanity === 'boolean'
							? input.globalChatBlockProfanity
							: siteSettings.globalChatBlockProfanity,
				},
			});

			await ctx.redis.del(SiteSettingId);
		}),
});
