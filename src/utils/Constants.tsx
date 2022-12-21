import type { MainLinkProps } from '@components/MainLink';
import {
	IconAlertCircle,
	IconArticle,
	IconHome,
	IconStack2,
} from '@tabler/icons';

export enum SiteSetting {
	ID = 'elisa:software',
	companyName = 'companyName',
}

export enum Permission {
	AnnouncementView = 'announcement.view',
	AnnouncementCreate = 'announcement.create',
	AnnouncementEdit = 'announcement.edit',
	AnnouncementDelete = 'announcement.delete',
}

export enum Gender {
	Male = 'Male',
	Female = 'Female',
}

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
