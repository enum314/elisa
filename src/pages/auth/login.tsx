import { Button, Image } from '@mantine/core';
import { createGetServerSideProps } from '@server/common/createServerSideProps';
import { IconBrandDiscord } from '@tabler/icons';
import { trpc } from '@utils/trpc';
import { signIn } from 'next-auth/react';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('guestOnly');

export default function Login() {
	const { data: site } = trpc.site.companyName.useQuery();

	return (
		<>
			<NextSeo title={`Login to ${site?.companyName}`} />
			<div className="select-none grid place-items-center h-full w-full bg-gradient-to-br from-accent to-primary font-sans">
				<div className="w-full grid place-items-center gap-y-5 -mt-10">
					<h1 className="text-3xl text-white">Login to Continue</h1>
					<div className="bg-white w-full sm:w-1/3 sm:rounded-lg p-5 grid grid-cols-1 shadow-lg">
						<div className="select-none">
							<Image
								className="mx-auto"
								src="/android-chrome-512x512.png"
								alt=""
								height={216}
								width={216}
							/>
						</div>
						<div>
							<Button
								fullWidth
								leftIcon={<IconBrandDiscord />}
								onClick={() => signIn('discord')}
							>
								Login with Discord
							</Button>
						</div>
					</div>
					<h2 className="text-md text-gray-100">
						Copyright &copy; 2022 Astzoid Elisa LMS Software
					</h2>
				</div>
			</div>
		</>
	);
}
