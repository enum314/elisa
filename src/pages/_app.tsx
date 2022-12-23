import '../styles/globals.css';

import { Comfortaa } from '@next/font/google';
import { trpc } from '@utils/trpc';
import type { AppType } from 'next/app';
import Head from 'next/head';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

const font = Comfortaa({ weight: '300', subsets: ['latin'] });

const App: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			{/* eslint-disable-next-line react/no-unknown-property */}
			<style jsx global>
				{`
					:root {
						--primary-font: ${font.style.fontFamily};
					}
				`}
			</style>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
};

export default trpc.withTRPC(App);
