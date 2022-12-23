import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconHandStop } from '@tabler/icons';
import { Maybe } from '@trpc/server';
import { DefaultErrorData } from '@trpc/server/dist/error/formatter';

export function HandleTRPCError() {
	return (ctx: { message: string; data: Maybe<DefaultErrorData> }) => {
		switch (ctx.data?.code) {
			case 'TOO_MANY_REQUESTS': {
				return showNotification({
					color: 'red',
					title: 'Slow down!',
					message: ctx.message,
					icon: <IconHandStop />,
				});
			}
			default: {
				showNotification({
					color: 'red',
					title: 'Error!',
					icon: <IconAlertTriangle />,
					message: ctx.message ?? 'Unknown error occured',
				});

				if (!ctx.message) {
					console.error(ctx);
				}
			}
		}
	};
}
