import '../styles/globals.css';

import { trpc } from '@utils/trpc';
import type { AppType } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

const App: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
	);
};

export default trpc.withTRPC(App);
