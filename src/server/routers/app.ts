import { websocket } from '@server/common/websocket';
import { authProcedure, router } from '@server/trpc';
import { observable } from '@trpc/server/observable';

import { profileRouter } from './profile';
import { siteRouter } from './site';

const interval = setInterval(() => {
	websocket.emit('test', {
		test: Math.floor(Math.random() * 100).toString(),
	});
}, 10000);

process.on('SIGTERM', () => clearInterval(interval));

export const appRouter = router({
	test: authProcedure.subscription(() => {
		return observable<{ test: string }>((observer) => {
			const test = (data: { test: string }) => observer.next(data);
			websocket.on('test', test);
			return () => {
				websocket.off('test', test);
			};
		});
	}),
	site: siteRouter,
	profile: profileRouter,
});

export type AppRouter = typeof appRouter;
