import { websocket, WebSocketEvents } from '@server/common/websocket';
import { withProfile } from '@server/middlewares/withProfile';
import { authProcedure, router } from '@server/trpc';
import { observable } from '@trpc/server/observable';

export const wsRouter = router({
	onlineUsers: authProcedure.use(withProfile).subscription(() => {
		return observable<WebSocketEvents['online-users'][0]>((observer) => {
			const listener = (data: WebSocketEvents['online-users'][0]) =>
				observer.next(data);

			websocket.on('online-users', listener);

			return () => {
				websocket.off('online-users', listener);
			};
		});
	}),
});
