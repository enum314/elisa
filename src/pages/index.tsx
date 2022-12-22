import { GlobalChat } from '@modules/GlobalChat';
import Layout from '@modules/Layout';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { DashboardLinks } from '@utils/DashboardLinks';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('user');

export default function IndexPage() {
	return (
		<Layout links={DashboardLinks}>
			<NextSeo title="Overview" />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
				<GlobalChat />
			</div>
		</Layout>
	);
}
