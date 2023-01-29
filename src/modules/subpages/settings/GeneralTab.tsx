import { Card } from '@components/Card';
import Loading from '@components/Loading';
import { Select, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { trpc } from '@utils/trpc';
import { useSession } from 'next-auth/react';

export function GeneralTab() {
	const session = useSession();

	const { data: profile, isLoading } = trpc.profile.self.useQuery();

	if (isLoading || !profile) {
		return <Loading className="mt-52" />;
	}

	return (
		<div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
			<Card title="General" className="border-green-400">
				<div className="grid gap-5">
					<TextInput
						withAsterisk
						label="Account ID"
						description="This is your account ID used for identification."
						variant="filled"
						readOnly
						value={session.data?.user?.id}
					/>
					<TextInput
						withAsterisk
						label="Email Address"
						description="This is your email address used in the application."
						variant="filled"
						readOnly
						value={session.data?.user?.email ?? ''}
					/>
					<TextInput
						withAsterisk
						label="Account Username"
						description="This is your username used in the application."
						variant="filled"
						readOnly
						value={session.data?.user?.name ?? ''}
					/>
				</div>
			</Card>
			<Card title="User Information" className="border-green-400">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<TextInput
						withAsterisk
						label="First Name"
						description="Your first name."
						variant="filled"
						readOnly
						value={profile.firstName}
					/>
					<TextInput
						withAsterisk
						label="Middle Name"
						description="Your middle name."
						variant="filled"
						readOnly
						value={profile.middleName}
					/>
					<TextInput
						withAsterisk
						label="Last Name"
						description="Your last name."
						variant="filled"
						readOnly
						value={profile.lastName}
					/>
					<Select
						withAsterisk
						label="Gender"
						description="Your gender."
						data={[
							{ label: 'Male', value: 'Male' },
							{ label: 'Female', value: 'Female' },
						]}
						readOnly
						value={profile.gender}
					/>
					<DatePicker
						withAsterisk
						label="Birthdate"
						description="Your birthdate."
						readOnly
						value={new Date(profile.birthdate)}
					/>
				</div>
			</Card>
		</div>
	);
}
