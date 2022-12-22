import { TextInput } from '@mantine/core';
import { useSession } from 'next-auth/react';

export function GeneralTab() {
	const session = useSession();

	return (
		<div className="bg-secondary-800 rounded-md border-t-4 border-green-400">
			<h2 className="py-2 px-5 bg-secondary-400">General</h2>
			<form className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
				<TextInput
					label="Account ID"
					description="This is your account ID used for identification."
					variant="filled"
					readOnly
					value={session.data?.user?.id}
				/>
				<TextInput
					label="Email Address"
					description="This is your email address used in the application."
					variant="filled"
					readOnly
					value={session.data?.user?.email ?? ''}
				/>
				<TextInput
					label="Account Username"
					description="This is your username used in the application."
					variant="filled"
					readOnly
					value={session.data?.user?.name ?? ''}
				/>
			</form>
		</div>
	);
}
