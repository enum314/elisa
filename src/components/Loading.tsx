import { Loader } from '@mantine/core';

export default function Loading({ className }: { className?: string }) {
	return (
		<div
			className={`grid place-items-center h-full w-full ${
				className ?? ''
			}`}
		>
			<Loader />
		</div>
	);
}
