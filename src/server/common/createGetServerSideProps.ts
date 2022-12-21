import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

type ForWho = 'guest' | 'guestOnly' | 'user' | 'admin';

export function createGetServerSideProps(forWho: ForWho) {
	switch (forWho) {
		case 'guest': {
			return guest;
		}
		case 'guestOnly': {
			return guestOnly;
		}
		case 'user': {
			return user;
		}
		case 'admin': {
			return admin;
		}
	}
}

const guest: GetServerSideProps = async (ctx) => {
	return {
		props: {
			session: await getSession(ctx),
		},
	};
};

const guestOnly: GetServerSideProps = async (ctx) => {
	const session = await getSession(ctx);

	if (session?.user) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
};

const user: GetServerSideProps = async (ctx) => {
	const session = await getSession(ctx);

	if (!session?.user) {
		return {
			redirect: {
				destination: '/auth/login',
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
};

const admin: GetServerSideProps = async (ctx) => {
	const session = await getSession(ctx);

	if (!session?.user) {
		return {
			redirect: {
				destination: '/auth/login',
				permanent: false,
			},
		};
	}

	if (!session.user.isAdmin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
};
