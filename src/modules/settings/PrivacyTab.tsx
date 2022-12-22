import Loading from '@components/Loading';
import { Switch } from '@mantine/core';
import { useShallowEffect } from '@mantine/hooks';
import { HandleTRPCError } from '@modules/common/HandleTRPCError';
import { HandleTRPCSuccess } from '@modules/common/HandleTRPCSuccess';
import { trpc } from '@utils/trpc';
import { useState } from 'react';

export function PrivacyTab() {
	const utils = trpc.useContext();
	const { data: profile, isLoading } = trpc.profile.self.useQuery();

	const [allowFriendships, setAllowFriendships] = useState(true);
	const [allowChatRequests, setAllowChatRequests] = useState(true);

	const mutation = trpc.profile.editPrivacy.useMutation({
		onSuccess: HandleTRPCSuccess({
			callback() {
				utils.profile.self.invalidate();
			},
			message: 'Your privacy settings has been updated!',
		}),
		onError: HandleTRPCError(),
	});

	useShallowEffect(() => {
		if (profile) {
			setAllowFriendships(profile.allowFriendships);
			setAllowChatRequests(profile.allowChatRequests);
		}
	}, [profile]);

	if (isLoading) {
		return <Loading className="mt-52" />;
	}

	return (
		<div className="bg-secondary-800 rounded-md border-t-4 border-red-400">
			<h2 className="py-2 px-5 bg-secondary-400">Privacy Settings</h2>
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2 p-5 relative">
				<form className="grid gap-2">
					<Switch
						label="Allow Friend Requests"
						checked={allowFriendships}
						onChange={(event) => {
							mutation.mutate({
								allowFriendships: event.currentTarget.checked,
							});
						}}
					/>
					<Switch
						label="Allow Chat Requests"
						checked={allowChatRequests}
						onChange={(event) => {
							mutation.mutate({
								allowChatRequests: event.currentTarget.checked,
							});
						}}
					/>
				</form>
			</div>
		</div>
	);
}
