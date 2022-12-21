import { SiteSetting } from '@utils/Constants';
import Store from '@utils/Store';

export const siteSettings = new Store<{ value: string }>(SiteSetting.ID, 300);
