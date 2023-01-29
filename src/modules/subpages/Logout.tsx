import { Button, Menu } from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { IconLogout } from '@tabler/icons';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Logout() {
	const [loading, setLoading] = useState(false);

	return (
		<Menu.Item
			color="red"
			icon={<IconLogout size={14} />}
			onClick={() =>
				openModal({
					title: 'Log Out',
					centered: true,
					overlayOpacity: 0.55,
					overlayBlur: 2,
					children: (
						<>
							<p>Are you sure you want to logout?</p>
							<div className="flex items-center justify-end gap-x-5 mt-5">
								<Button
									variant="subtle"
									color="gray"
									className="font-normal"
									loading={loading}
									onClick={() => closeModal('')}
								>
									Cancel
								</Button>
								<Button
									loading={loading}
									onClick={() => {
										setLoading(true);
										signOut().finally(
											() => (window.location.href = '/'),
										);
									}}
									color="red"
									className="font-normal"
								>
									Log Out
								</Button>
							</div>
						</>
					),
				})
			}
		>
			Logout
		</Menu.Item>
	);
}
