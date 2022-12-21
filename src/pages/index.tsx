import Layout from '@modules/Layout';
import { createGetServerSideProps } from '@server/common/createGetServerSideProps';
import { DashboardLinks } from '@utils/Constants';
import { NextSeo } from 'next-seo';

export const getServerSideProps = createGetServerSideProps('user');

export default function Home() {
	return (
		<Layout links={DashboardLinks}>
			<NextSeo title="Overview" />
		</Layout>
	);
}
