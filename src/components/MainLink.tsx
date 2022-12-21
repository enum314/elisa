import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export interface MainLinkProps {
	icon: React.ReactNode;
	label: string;
	to: string;
}

function MainLink({
	icon,
	label,
	to,
	onClick,
}: MainLinkProps & { onClick: () => void }) {
	const router = useRouter();

	const background = useMemo(() => {
		return router.asPath === to ? 'bg-secondary-700' : 'bg-secondary-900';
	}, [router.asPath, to]);

	return (
		<UnstyledButton
			className={`transition-colors ease duration-100 ${background} hover:bg-secondary-600 mb-1`}
			sx={(theme) => ({
				display: 'block',
				width: '100%',
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				color: theme.colors.dark[0],
			})}
			onClick={() => {
				router.push(to);
				onClick();
			}}
		>
			<Group>
				<ThemeIcon color="gray" variant="filled">
					{icon}
				</ThemeIcon>

				<Text size="sm">{label}</Text>
			</Group>
		</UnstyledButton>
	);
}

export default MainLink;
