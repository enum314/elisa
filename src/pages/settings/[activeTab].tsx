import { PageTitle } from '@components/PageTitle';
import { Tabs } from '@mantine/core';
import Layout from '@modules/Layout';
import { DashboardLinks } from '@modules/LayoutLinks';
import { GeneralTab } from '@modules/subpages/settings/GeneralTab';
import { ProfileTab } from '@modules/subpages/settings/ProfileTab';
import { SettingsTab } from '@modules/subpages/settings/SettingsTab';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('user');

export default function SettingsPage() {
	const router = useRouter();

	return (
		<Layout links={DashboardLinks}>
			<NextSeo title="Account Settings" />

			<div className="grid gap-y-5">
				<PageTitle>Account Settings</PageTitle>
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
