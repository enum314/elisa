import { router } from '@server/trpc';

import { adminRouter } from './admin';
import { avatarRouter } from './avatar';
import { messageRouter } from './message';
import { profileRouter } from './profile';
import { siteRouter } from './site';
import { wsRouter } from './ws';

export const appRouter = router({
	admin: adminRouter,
	avatar: avatarRouter,
	message: messageRouter,
	profile: profileRouter,
	site: siteRouter,
	ws: wsRouter,
});

export type AppRouter = typeof appRouter;
