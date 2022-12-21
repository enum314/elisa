import type { AppRouter } from '@server/routers/app';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

function getBaseUrl() {
	if (typeof window !== 'undefined') return '';

	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

	if (process.env.RENDER_INTERNAL_HOSTNAME)
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
	config({ ctx }) {
		if (typeof window !== 'undefined') {
			// during client requests
			return {
				transformer: superjson,
				links: [
					httpBatchLink({
						url: `${getBaseUrl()}/api/trpc`,
					}),
				],
				/**
				 * @link https://tanstack.com/query/v4/docs/reference/QueryClient
				 **/
				// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
			};
		}

		return {
			transformer: superjson,
			links: [
				httpBatchLink({
					/**
					 * If you want to use SSR, you need to use the server's full URL
					 * @link https://trpc.io/docs/ssr
					 **/
					// The server needs to know your app's full url
					url: `${getBaseUrl()}/api/trpc`,
					/**
					 * Set custom request headers on every request from tRPC
					 * @link https://trpc.io/docs/v10/header
					 */
					headers() {
						if (ctx?.req) {
							// To use SSR properly, you need to forward the client's headers to the server
							// This is so you can pass through things like cookies when we're server-side rendering
							// If you're using Node 18, omit the "connection" header
							const {
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								connection: _connection,
								...headers
							} = ctx.req.headers;
							return {
								...headers,
								// Optional: inform server that it's an SSR request
								// 'x-ssr': '1',
							};
						}

						return {};
					},
				}),
			],
			/**
			 * @link https://tanstack.com/query/v4/docs/reference/QueryClient
			 **/
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 * @link https://github.com/trpc/trpc/issues/596
	 **/
	ssr: false,
});
