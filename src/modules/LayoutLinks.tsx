import { MainLinkProps } from '@components/MainLink';
import {
	IconAlertCircle,
	IconArticle,
	IconHome,
	IconShield,
	IconStack2,
	IconTool,
	IconUsers,
} from '@tabler/icons';

export const DashboardLinks: Record<string, MainLinkProps[]> = {
	Main: [
		{
			icon: <IconHome size={16} />,
			label: 'Home',
			to: '/',
		},
		{
			icon: <IconAlertCircle size={16} />,
			label: 'Announcements',
			to: '/announcements',
		},
		{
			icon: <IconStack2 size={16} />,
			label: 'Courses',
			to: '/courses',
		},
		{
			icon: <IconArticle size={16} />,
			label: 'Blogs',
			to: '/blogs',
		},
	],
};

export const AdminDashboardLinks: Record<string, MainLinkProps[]> = {
	Application: [
		{
			icon: <IconHome size={16} />,
			label: 'Overview',
			to: '/admin',
		},
		{
			icon: <IconTool size={16} />,
			label: 'Settings',
			to: '/admin/settings/basic',
		},
	],
	Management: [
		{
			icon: <IconUsers size={16} />,
			label: 'Users',
			to: '/admin/users',
		},
		{
			icon: <IconShield size={16} />,
			label: 'Roles',
			to: '/admin/roles',
		},
	],
	'': [
		{
			icon: <IconHome size={16} />,
			label: 'Go back to home',
			to: '/',
		},
	],
};
