import Loading from '@components/Loading';
import MainLink, { MainLinkProps } from '@components/MainLink';
import {
	AppShell,
	Avatar,
	Burger,
	Divider,
	Header,
	Image,
	MantineProvider,
	MediaQuery,
	Menu,
	Navbar,
	ScrollArea,
	UnstyledButton,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { Roboto } from '@next/font/google';
import {
	IconLayoutDashboard,
	IconMessageCircle,
	IconSettings,
	IconUserCircle,
} from '@tabler/icons';
import { trpc } from '@utils/trpc';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';

import Logout from './Logout';
import { SetupProfile } from './SetupProfile';

interface LayoutProps {
	links: Record<string, MainLinkProps[]>;
	children?: React.ReactNode;
}

const roboto = Roboto({ weight: '400', subsets: ['latin'] });

const Layout: React.FC<LayoutProps> = ({ links, children }) => {
	const router = useRouter();
	const session = useSession();

	const [opened, setOpened] = useState(false);
	const keys = useMemo(() => Object.keys(links), [links]);

	const { data: companyName } = trpc.site.companyName.useQuery();
	const { data: profile, isLoading } = trpc.profile.self.useQuery();

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<MantineProvider
				theme={{
					colorScheme: 'dark',
					breakpoints: {
						sm: 640,
						md: 768,
						lg: 1024,
						xl: 1280,
					},
					components: {
						Input: {
							styles: {
								input: {
									'&:focus': {
										borderColor: '#08090C',
									},
								},
							},
						},
					},
				}}
				withNormalizeCSS
				withGlobalStyles
			>
				<ModalsProvider>
					<NotificationsProvider>
						<ScrollArea.Autosize maxHeight={'100%'}>
							{profile && !isLoading ? (
								<AppShell
									classNames={{
										root: `text-white ${roboto.className}`,
										main: 'bg-secondary-700',
									}}
									navbar={
										<Navbar
											className="bg-secondary-800 text-white h-full"
											hiddenBreakpoint="sm"
											py="xs"
											hidden={!opened}
											width={{ sm: 200, md: 250 }}
										>
											{keys.map((section) => {
												return (
													<div key={section}>
														<Navbar.Section px="xs">
															<h2 className="text-base tracking-wide mb-1">
																{section}
															</h2>
															{links[section].map(
																(link) => (
																	<MainLink
																		{...link}
																		key={
																			link.label
																		}
																		onClick={() =>
																			setOpened(
																				false,
																			)
																		}
																	/>
																),
															)}
														</Navbar.Section>
														<Divider className="my-3" />
													</div>
												);
											})}
										</Navbar>
									}
									header={
										<Header
											height={70}
											p="md"
											className="bg-secondary-900 text-white border-b-2 border-gray-900"
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													height: '100%',
												}}
											>
												<MediaQuery
													largerThan="sm"
													styles={{ display: 'none' }}
												>
													<Burger
														opened={opened}
														color="white"
														onClick={() =>
															setOpened((o) => !o)
														}
														size="sm"
														mr="lg"
													/>
												</MediaQuery>
												<div className="flex items-center">
													<Image
														src="/android-chrome-192x192.png"
														alt={companyName}
														width={64}
														height={64}
													/>
													<MediaQuery
														smallerThan={'sm'}
														styles={{
															display: 'none',
														}}
													>
														<h1 className="text-3xl font-base">
															{companyName ??
																'Elisa LMS'}
														</h1>
													</MediaQuery>
												</div>
												<div className="ml-auto flex items-center mr-5">
													<Menu
														openDelay={100}
														closeDelay={400}
														shadow="lg"
														withArrow
														width={200}
													>
														<Menu.Target>
															<UnstyledButton className="bg-secondary-700 flex items-center sm:px-3 sm:py-2 rounded-md gap-x-2">
																<Avatar
																	src={
																		session
																			.data
																			?.user
																			?.image
																	}
																	alt="your avatar"
																/>
																<MediaQuery
																	smallerThan="sm"
																	styles={{
																		display:
																			'none',
																	}}
																>
																	<p>
																		{profile
																			? `${profile.firstName} ${profile.lastName}`
																			: session
																					.data
																					?.user
																					?.name}
																	</p>
																</MediaQuery>
															</UnstyledButton>
														</Menu.Target>

														<Menu.Dropdown className="-ml-5">
															<Menu.Label>
																{
																	session.data
																		?.user
																		?.email
																}
															</Menu.Label>
															<Menu.Item
																icon={
																	<IconUserCircle
																		size={
																			14
																		}
																	/>
																}
																onClick={() =>
																	router.push(
																		`/profile/${session.data?.user?.id}`,
																	)
																}
															>
																My Profile
															</Menu.Item>
															<Menu.Item
																icon={
																	<IconMessageCircle
																		size={
																			14
																		}
																	/>
																}
																onClick={() =>
																	router.push(
																		`/messages`,
																	)
																}
															>
																Messages
															</Menu.Item>
															<Menu.Item
																icon={
																	<IconSettings
																		size={
																			14
																		}
																	/>
																}
																onClick={() =>
																	router.push(
																		'/settings/general',
																	)
																}
															>
																Account Settings
															</Menu.Item>

															{session.data?.user
																?.isAdmin ? (
																<>
																	<Menu.Divider />

																	<Menu.Label>
																		Administration
																	</Menu.Label>
																	<Menu.Item
																		icon={
																			<IconLayoutDashboard
																				color="white"
																				size={
																					14
																				}
																			/>
																		}
																		onClick={() =>
																			router.push(
																				'/admin',
																			)
																		}
																	>
																		Dashboard
																	</Menu.Item>
																</>
															) : null}
															<Menu.Divider />
															<Logout />
														</Menu.Dropdown>
													</Menu>
												</div>
											</div>
										</Header>
									}
								>
									{children}
								</AppShell>
							) : null}
							{!profile && !isLoading ? (
								<div
									className={`text-white p-5 sm:p-10 md:p-20 lg:p-40 ${roboto.className} bg-secondary-700`}
								>
									<SetupProfile />
								</div>
							) : null}
						</ScrollArea.Autosize>
						{isLoading ? <Loading variant="dots" /> : null}
					</NotificationsProvider>
				</ModalsProvider>
			</MantineProvider>
		</>
	);
};

export default Layout;
