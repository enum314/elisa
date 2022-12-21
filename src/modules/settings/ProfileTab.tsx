import Loading from '@components/Loading';
import { Select, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { ProfileEdit } from '@modules/settings/ProfileEdit';
import { SetupProfile } from '@modules/settings/SetupProfile';
import { trpc } from '@utils/trpc';
import { useMemo } from 'react';

export function ProfileTab() {
	const { data, isLoading } = trpc.profile.self.useQuery();
	const profile = useMemo(() => data?.profile, [data]);

	if (isLoading) {
		return <Loading className="mt-52" />;
	}

	if (!profile) {
		return <SetupProfile />;
	}

	return (
		<div className="grid gap-y-5">
			<div className="bg-secondary-800 rounded-md border-t-4 border-blue-400">
				<h2 className="py-2 px-5 bg-secondary-400">Profile</h2>
				<div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
					<TextInput
						label="First Name"
						variant="filled"
						readOnly
						value={profile.firstName}
					/>
					{profile?.middleName.length ? (
						<TextInput
							label="Middle Name"
							variant="filled"
							readOnly
							value={profile.middleName}
						/>
					) : null}
					<TextInput
						label="Last Name"
						variant="filled"
						readOnly
						value={profile.lastName}
					/>
					<Select
						withAsterisk
						label="Gender"
						placeholder="Your gender"
						data={[
							{ label: 'Male', value: 'Male' },
							{ label: 'Female', value: 'Female' },
						]}
						readOnly
						value={profile.gender}
					/>
					<DatePicker
						withAsterisk
						placeholder="Your birthdate"
						label="Birthdate"
						readOnly
						value={new Date(profile.birthdate)}
					/>
				</div>
			</div>
			<ProfileEdit />
		</div>
	);
}
