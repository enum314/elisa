import { procedure, router } from '@server/trpc';
import { z } from 'zod';

export const helloRouter = router({
	greet: procedure
		.input(
			z.object({
				text: z.string(),
			}),
		)
		.query(({ input }) => {
			return {
				greeting: `hello ${input.text}`,
			};
		}),
});
