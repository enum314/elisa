import { getSiteSettings } from '@server/common/getSiteSettings';
import { websocket, WebSocketEvents } from '@server/common/websocket';
import { ratelimit } from '@server/middlewares/ratelimit';
import { withProfile } from '@server/middlewares/withProfile';
import { authProcedure, router } from '@server/trpc';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import Filter from 'bad-words';
import { z } from 'zod';

export const messageRouter = router({
	send: authProcedure
		.use(
			ratelimit('message', {
				points: 5,
				duration: 15,
				message: 'Woah chill, slow down sending messages.',
			}),
		)
		.use(withProfile)
		.input(
			z
				.object({
					content: z.string().min(1).max(100),
				})
				.strict(),
		)
		.mutation(async ({ input, ctx }) => {
			const siteSettings = await getSiteSettings();

			if (!siteSettings.globalChat) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'It seems an administrator disabled global chat.',
				});
			}

			if (!ctx.profile.globalChat) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message:
						'It seems you have global chat turned off. You can turn it back on at Account Settings',
				});
			}

			const content = input.content.trim();

			const blocker = new Filter();

			blocker.removeWords(...siteSettings.whitelistedWords);

			if (
				siteSettings.globalChatBlockProfanity &&
				blocker.isProfane(content)
			) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message:
						'Woah chill, this is a family friendly environment.',
				});
			}

			const filter = new Filter({ emptyList: true });

			filter.addWords(...siteSettings.filteredWords);

			const now = new Date();
			websocket.emit('message', {
				id: now.getMilliseconds().toString(),
				author: `${ctx.profile.firstName} ${ctx.profile.lastName}`,
				authorId: ctx.session.user.id,
				content: filter.clean(content),
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
						createdAt: then,
						type: 'leave',
					});
				}
			};
		});
	}),
});
