export const SiteSettingId = 'elisa:software';

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

export const linkRegex = /^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*/;
