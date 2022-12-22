import MainLink from '@components/MainLink';
import { Divider, Navbar } from '@mantine/core';
import { LayoutProps } from '@modules/Layout';
import { useMemo, useState } from 'react';

export function NavbarComponent({ links }: Exclude<LayoutProps, 'children'>) {
	const [opened, setOpened] = useState(false);
	const keys = useMemo(() => Object.keys(links), [links]);

	return (
		<Navbar
			className="bg-secondary-800 text-white h-full"
			hiddenBreakpoint="sm"
			py="xs"
			hidden={!opened}
			width={{ sm: 200, md: 250 }}
		>
			{keys.map((section) => {
				return (
					<div key={section}>
						<Navbar.Section px="xs">
							<h2 className="text-base tracking-wide mb-1">
								{section}
							</h2>
							{links[section].map((link) => (
								<MainLink
									{...link}
									key={link.label}
									onClick={() => setOpened(false)}
								/>
							))}
						</Navbar.Section>
						<Divider className="my-3" />
					</div>
				);
			})}
		</Navbar>
	);
}
