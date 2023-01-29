import Layout from '@modules/Layout';
import { DashboardLinks } from '@modules/LayoutLinks';
import { GlobalChat } from '@modules/subpages/GlobalChat';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('user');

export default function IndexPage() {
	return (
		<Layout links={DashboardLinks}>
			<NextSeo title="Overview" />
			<div className="grid grid-cols-1 sm:grid-cols-[2fr,1fr] lg:grid-cols-[2fr,1fr,1fr] gap-5">
				<GlobalChat />
			</div>
		</Layout>
	);
}
