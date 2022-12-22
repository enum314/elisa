import { router } from '@server/trpc';

import { messageRouter } from './message';
import { profileRouter } from './profile';
import { siteRouter } from './site';
import { wsRouter } from './ws';

export const appRouter = router({
	site: siteRouter,
	profile: profileRouter,
	message: messageRouter,
	ws: wsRouter,
});

export type AppRouter = typeof appRouter;
