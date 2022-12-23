import { websocket, WebSocketEvents } from '@server/common/websocket';
import { ratelimit } from '@server/middlewares/ratelimit';
import { withProfile } from '@server/middlewares/withProfile';
import { authProcedure, router } from '@server/trpc';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';

export const messageRouter = router({
	send: authProcedure
		.use(ratelimit('message', { points: 5, duration: 15 }))
		.use(withProfile)
		.input(z.object({ content: z.string().min(1).max(100) }).strict())
		.mutation(async ({ input, ctx }) => {
			if (!ctx.profile.globalChat) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}

			const content = input.content.trim();

			// TODO: Admin dashboard, blocking profanity
			// if (ctx.filter.isProfane(content)) {
			// 	throw new TRPCError({
			// 		code: 'BAD_REQUEST',
			// 		message: 'Woah chill, this is a profanity-free environment',
			// 	});
			// }

			const now = new Date();
			websocket.emit('message', {
				id: now.getMilliseconds().toString(),
				author: `${ctx.profile.firstName} ${ctx.profile.lastName}`,
				authorId: ctx.session.user.id,
				content: ctx.filter.clean(content),
				imageURL: ctx.session.user.image ?? '',
				createdAt: now,
				type: 'message',
			});
		}),
	listen: authProcedure.use(withProfile).subscription(({ ctx }) => {
		return observable<WebSocketEvents['message'][0]>((observer) => {
			const listener = (data: WebSocketEvents['message'][0]) =>
				observer.next(data);

			websocket.on('message', listener);

			if (ctx.profile.globalChat) {
				const now = new Date();
				websocket.emit('message', {
					id: now.getMilliseconds().toString(),
					author: `${ctx.profile.firstName} ${ctx.profile.lastName}`,
					authorId: ctx.session.user.id,
					content: '',
					imageURL: ctx.session.user.image ?? '',
					createdAt: now,
					type: 'join',
				});
			}

			return () => {
				websocket.off('message', listener);

				if (ctx.profile.globalChat) {
					const then = new Date();
					websocket.emit('message', {
						id: then.getMilliseconds().toString(),
						author: `${ctx.profile.firstName} ${ctx.profile.lastName}`,
						authorId: ctx.session.user.id,
						content: '',
						imageURL: ctx.session.user.image ?? '',
						createdAt: then,
						type: 'leave',
					});
				}
			};
		});
	}),
});
