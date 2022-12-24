import { SiteSettings } from '@prisma/client';
import { SiteSettingId } from '@utils/Constants';
import { prisma } from '@utils/prisma';
import { redis } from '@utils/redis';

export async function getSiteSettings() {
	const cache = await redis.get(SiteSettingId);

	if (!cache) {
		let data = await prisma.siteSettings.findUnique({
			where: {
				id: SiteSettingId,
			},
		});

		if (!data) {
			data = await prisma.siteSettings.create({
				data: {
					id: SiteSettingId,
				},
			});
		}

		await redis.set(SiteSettingId, JSON.stringify(data));
	}

	return JSON.parse(
		(await redis.get(SiteSettingId)) as string,
	) as SiteSettings;
}
