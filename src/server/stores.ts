import { SiteSettingId } from '@utils/Constants';
import Store from '@utils/Store';

export const siteSettings = new Store<{ value: string }>(SiteSettingId, 300);

export interface OnlineUser {
	id: string;
	name: string;
	image: string;
}

export const onlineUsers = new Map<string, OnlineUser>();

export const avatarUrls = new Store<{ value: string }>(
	`${SiteSettingId}|avatars`,
	60,
);
