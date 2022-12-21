import { SiteSettingId } from '@utils/Constants';
import Store from '@utils/Store';

export const siteSettings = new Store<{ value: string }>(SiteSettingId, 300);
