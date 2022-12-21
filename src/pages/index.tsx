import Layout from '@modules/Layout';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { DashboardLinks } from '@utils/DashboardLinks';
import { trpc } from '@utils/trpc';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('user');

export default function IndexPage() {
	trpc.test.useSubscription(undefined, {
		onData(data) {
			console.log(data);
		},
		onError(err) {
			console.error('Subscription error:', err);
		},
	});

	return (
		<Layout links={DashboardLinks}>
			<NextSeo title="Overview" />
		</Layout>
	);
}
