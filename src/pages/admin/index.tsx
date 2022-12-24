import { Card } from '@components/Card';
import { PageTitle } from '@components/PageTitle';
import { Button, Code } from '@mantine/core';
import Layout from '@modules/Layout';
import { AdminDashboardLinks } from '@modules/LayoutLinks';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { IconBrandDiscord, IconBrandGithub, IconCash } from '@tabler/icons';
import { trpc } from '@utils/trpc';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('admin');

export default function AdminApplicationOverview() {
	const { data: overview } = trpc.admin.application.useQuery();

	return (
		<Layout links={AdminDashboardLinks}>
			<NextSeo title="Application Overview" />
			<div className="grid gap-y-5">
				<PageTitle>Application Overview</PageTitle>

				<Card title="System Information" className="border-green-400">
					<p className="p-5">
						You are running Elisa LMS version{' '}
						<Code>{overview?.version}</Code> with{' '}
						<Code>{overview?.runtime.name}</Code>{' '}
						<Code>{overview?.runtime.version}</Code> on{' '}
						<Code>{overview?.runtime.platform}</Code>{' '}
						<Code>{overview?.runtime.arch}</Code>.
					</p>
				</Card>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
					<Button
						leftIcon={<IconBrandDiscord size={16} />}
						color="blue"
					>
						Get Help
					</Button>
					<Button
						leftIcon={<IconBrandGithub size={16} />}
						color="gray"
					>
						Github
					</Button>
					<Button leftIcon={<IconCash size={16} />} color="red">
						Support the Project
					</Button>
				</div>
			</div>
		</Layout>
	);
}
