import { getServerAuthSession } from '@server/common/getServerAuthSession';
import { GetServerSideProps } from 'next';

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
			session: await getServerAuthSession(ctx),
		},
	};
};

const guestOnly: GetServerSideProps = async (ctx) => {
	const session = await getServerAuthSession(ctx);

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
	const session = await getServerAuthSession(ctx);

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
	const session = await getServerAuthSession(ctx);

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
