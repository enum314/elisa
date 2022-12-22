import { Loader, MantineTheme } from '@mantine/core';

export default function Loading({
	className,
	variant,
}: {
	className?: string;
	variant?: MantineTheme['loader'];
}) {
	return (
		<div
			className={`grid place-items-center h-full w-full ${
				className ?? ''
			}`}
		>
			<Loader variant={variant} />
		</div>
	);
}
