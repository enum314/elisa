import { PageTitle } from '@components/PageTitle';
import { Tabs } from '@mantine/core';
import Layout from '@modules/Layout';
import { AdminDashboardLinks } from '@modules/LayoutLinks';
import { Basic } from '@modules/subpages/admin/settings/Basic';
import { GlobalChatSettings } from '@modules/subpages/admin/settings/GlobalChatSettings';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { trpc } from '@utils/trpc';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('admin');

export default function SettingsPage() {
	const router = useRouter();

	const { isLoading } = trpc.site.settings.useQuery();

	return (
		<Layout links={AdminDashboardLinks}>
			<NextSeo title="Application Settings" />

			<div className="grid gap-y-5">
				<PageTitle>Application Settings</PageTitle>
				<Tabs
					value={router.query.activeTab as string}
					onTabChange={(value) =>
						router.push(`/admin/settings/${value}`)
					}
					color="green"
					defaultValue="basic"
				>
					<Tabs.List>
						<Tabs.Tab value="basic">Basic Settings</Tabs.Tab>
						<Tabs.Tab value="globalChat">Global Chat</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="basic" pt="lg">
						{!isLoading ? <Basic /> : null}
					</Tabs.Panel>
					<Tabs.Panel value="globalChat" pt="lg">
						{!isLoading ? <GlobalChatSettings /> : null}
					</Tabs.Panel>
				</Tabs>
			</div>
		</Layout>
	);
}
