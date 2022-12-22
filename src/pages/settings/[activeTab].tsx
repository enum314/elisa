import { Tabs } from '@mantine/core';
import Layout from '@modules/Layout';
import { GeneralTab } from '@modules/settings/GeneralTab';
import { ProfileTab } from '@modules/settings/ProfileTab';
import { SettingsTab } from '@modules/settings/SettingsTab';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { DashboardLinks } from '@utils/DashboardLinks';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('user');

export default function SettingsPage() {
	const router = useRouter();

	return (
		<Layout links={DashboardLinks}>
			<NextSeo title="Account Settings" />

			<div className="grid gap-y-5">
				<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
					Account Settings
				</h1>
				<Tabs
					value={router.query.activeTab as string}
					onTabChange={(value) => router.push(`/settings/${value}`)}
					color="green"
					defaultValue="general"
				>
					<Tabs.List>
						<Tabs.Tab value="general">General</Tabs.Tab>
						<Tabs.Tab value="profile" color="yellow">
							Profile
						</Tabs.Tab>
						<Tabs.Tab value="settings" color="red">
							Settings
						</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="general" pt="lg">
						<GeneralTab />
					</Tabs.Panel>
					<Tabs.Panel value="profile" pt="lg">
						<ProfileTab />
					</Tabs.Panel>
					<Tabs.Panel value="settings" pt="lg">
						<SettingsTab />
					</Tabs.Panel>
				</Tabs>
			</div>
		</Layout>
	);
}
