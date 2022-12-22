import { publicProcedure, router } from '@server/trpc';

export const siteRouter = router({
	companyName: publicProcedure.query(async ({ ctx }) => {
		return ctx.siteSettings.companyName;
	}),
});
