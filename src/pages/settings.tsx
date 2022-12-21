import { Tabs } from '@mantine/core';
import Layout from '@modules/Layout';
import { GeneralTab } from '@modules/settings/GeneralTab';
import { PrivacyTab } from '@modules/settings/PrivacyTab';
import { ProfileTab } from '@modules/settings/ProfileTab';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { DashboardLinks } from '@utils/Constants';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('user');

export default function SettingsPage() {
	return (
		<Layout links={DashboardLinks}>
			<NextSeo title="Account Settings" />

			<div className="grid gap-y-5">
				<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
					Account Settings
				</h1>
				<Tabs color="green" defaultValue="general">
					<Tabs.List>
						<Tabs.Tab value="general">General</Tabs.Tab>
						<Tabs.Tab value="profile" color="blue">
							Profile
						</Tabs.Tab>
						<Tabs.Tab value="privacy" color="red">
							Privacy
						</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="general" pt="lg">
						<GeneralTab />
					</Tabs.Panel>
					<Tabs.Panel value="profile" pt="lg">
						<ProfileTab />
					</Tabs.Panel>
					<Tabs.Panel value="privacy" pt="lg">
						<PrivacyTab />
					</Tabs.Panel>
				</Tabs>
			</div>
		</Layout>
	);
}
