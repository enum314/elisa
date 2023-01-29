import { ratelimit } from '@server/middlewares/ratelimit';
import { withProfile } from '@server/middlewares/withProfile';
import { avatarUrls } from '@server/stores';
import { authProcedure, router } from '@server/trpc';
import { z } from 'zod';

export const avatarRouter = router({
	get: authProcedure
		.input(
			z
				.object({
					userId: z.string(),
				})
				.strict(),
		)
		.use(withProfile)
		.query(async ({ ctx, input }) => {
			const { userId } = input;

			if (userId === 'null') return;

			const exists = await avatarUrls.get(userId);

			if (exists) {
				return { url: exists.value };
			}

			try {
				await ctx.storage
					.headObject({
						Bucket: 'avatars',
						Key: userId,
					})
					.promise();

				const signed = await ctx.storage.getSignedUrlPromise(
					'getObject',
					{
						Bucket: 'avatars',
						Key: userId,
						Expires: 60,
					},
				);

				await avatarUrls.set(userId, { value: signed });

				return { url: signed };
			} catch (err) {
				return { url: '' };
			}
		}),
	upload: authProcedure
		.use(
			ratelimit('avatar.hash', {
				points: 5,
				duration: 300,
				message:
					'You can only change your avatar 5 times every 5 minutes.',
			}),
		)
		.use(withProfile)
		.input(
			z
				.object({
					reset: z.boolean(),
				})
				.strict(),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.reset) {
				try {
					await ctx.storage
						.deleteObject({
							Bucket: 'avatars',
							Key: ctx.session.user.id,
						})
						.promise();
				} catch (err) {
					//
				}

				avatarUrls.del(ctx.session.user.id);

				return;
			}

			const signed = ctx.storage.createPresignedPost({
				Fields: {
					key: ctx.session.user.id,
				},
				Bucket: 'avatars',
				Conditions: [
					['starts-with', '$Content-Type', 'image/'],
					['content-length-range', 0, 5000000],
				],
				Expires: 30,
			});

			try {
				await ctx.storage
					.deleteObject({
						Bucket: 'avatars',
						Key: ctx.session.user.id,
					})
					.promise();
			} catch (err) {
				//
			}

			avatarUrls.del(ctx.session.user.id);

			return { signed };
		}),
});
