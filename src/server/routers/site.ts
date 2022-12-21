import { siteSettings } from '@server/stores';
import { publicProcedure, router } from '@server/trpc';
import { SiteSettingId } from '@utils/Constants';

export const siteRouter = router({
	companyName: publicProcedure.query(async ({ ctx }) => {
		if (await siteSettings.has('companyName')) {
			return {
				companyName:
					(await siteSettings.get('companyName'))?.value ??
					'Elisa LMS',
			};
		}

		const data = await ctx.prisma.siteSettings.findUnique({
			where: {
				id: SiteSettingId,
			},
			select: {
				companyName: true,
			},
		});

		if (!data) {
			await ctx.prisma.siteSettings.create({
				data: {
					id: SiteSettingId,
					companyName: 'Elisa LMS',
				},
			});
		}

		await siteSettings.set('companyName', {
			value: data?.companyName ?? 'Elisa LMS',
		});

		return data;
	}),
});
