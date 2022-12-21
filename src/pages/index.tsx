import { getServerAuthSession } from '@server/common/getServerAuthSession';
import { trpc } from '@utils/trpc';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
	const session = useSession();
	const hello = trpc.hello.greet.useQuery({ text: 'next-trpc' });

	return (
		<>
			<Head>
				<title>Next.js + Tailwind + tRPC + NextAuth</title>
			</Head>

			<h1 className="text-3xl font-bold">Hello World</h1>
			<p>{hello.data?.greeting}</p>

			<h3>{session.status}</h3>
			{session.status === 'authenticated' ? (
				<button
					className="px-2 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
					onClick={() => signOut()}
				>
					Sign Out
				</button>
			) : session.status === 'unauthenticated' ? (
				<button
					className="px-2 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
					onClick={() => signIn('discord')}
				>
					Sign In
				</button>
			) : null}
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			session: await getServerAuthSession(context),
		},
	};
};
