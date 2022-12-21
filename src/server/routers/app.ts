import { router } from '@server/trpc';

import { profileRouter } from './profile';
import { siteRouter } from './site';

export const appRouter = router({
	site: siteRouter,
	profile: profileRouter,
});

export type AppRouter = typeof appRouter;
