import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

interface HandleMutationSuccessOptions {
	callback?: () => Promise<void> | void;
	message?: string;
}

export function HandleMutationSuccess(options?: HandleMutationSuccessOptions) {
	return async () => {
		if (options) {
			showNotification({
				color: 'green',
				title: 'Success!',
				message: options?.message
					? options.message
					: 'Your changes has been applied.',
				icon: <IconCheck />,
			});

			if (options.callback) await options.callback();
		}
	};
}
