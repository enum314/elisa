// Prisma adapter for NextAuth, optional and can be removed
import { env } from '@env/server';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@utils/prisma';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
		// ...add more providers here
	],
	theme: {
		logo: '/favicon.ico',
	},
};

export default NextAuth(authOptions);
