import { router } from '@server/trpc';

import { adminRouter } from './admin';
import { messageRouter } from './message';
import { profileRouter } from './profile';
import { siteRouter } from './site';
import { wsRouter } from './ws';

export const appRouter = router({
	admin: adminRouter,
	message: messageRouter,
	profile: profileRouter,
	site: siteRouter,
	ws: wsRouter,
});

export type AppRouter = typeof appRouter;
