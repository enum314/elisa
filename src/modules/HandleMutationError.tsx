import { showNotification } from '@mantine/notifications';
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconHandStop,
} from '@tabler/icons';
import { Maybe } from '@trpc/server';
import { DefaultErrorData } from '@trpc/server/dist/error/formatter';
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';

interface HandleMutationErrorOptions {
	messages: [TRPC_ERROR_CODE_KEY, string][];
}

export function HandleMutationError(options?: HandleMutationErrorOptions) {
	return (ctx: { message: string; data: Maybe<DefaultErrorData> }) => {
		if (options?.messages) {
			for (const [status, message] of options.messages) {
				if (ctx.data?.code === status) {
					return showNotification({
						color: 'red',
						title: 'Error!',
						icon: <IconAlertCircle />,
						message: message,
					});
				}
			}
		}

		switch (ctx.data?.code) {
			case 'BAD_REQUEST': {
				return showNotification({
					color: 'red',
					title: 'Error!',
					icon: <IconAlertTriangle />,
					message: ctx.message,
				});
			}
			case 'TOO_MANY_REQUESTS': {
				return showNotification({
					color: 'red',
					title: 'Slow down!',
					message: 'You are being rate limited.',
					icon: <IconHandStop />,
				});
			}
		}

		console.error(ctx);
	};
}
