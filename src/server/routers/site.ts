import { siteSettings } from '@server/stores';
import { procedure, router } from '@server/trpc';
import { SiteSetting } from '@utils/Constants';

export const siteRouter = router({
	companyName: procedure.query(async ({ ctx }) => {
		if (await siteSettings.has(SiteSetting.companyName)) {
			return {
				companyName:
					(await siteSettings.get(SiteSetting.companyName))?.value ??
					'Elisa LMS',
			};
		}

		const data = await ctx.prisma.siteSettings.findUnique({
			where: {
				id: SiteSetting.ID,
			},
			select: {
				companyName: true,
			},
		});

		if (!data) {
			await ctx.prisma.siteSettings.create({
				data: {
					id: SiteSetting.ID,
					companyName: 'Elisa LMS',
				},
			});
		}

		await siteSettings.set(SiteSetting.ID, {
			value: data?.companyName ?? 'Elisa LMS',
		});

		return data;
	}),
});
