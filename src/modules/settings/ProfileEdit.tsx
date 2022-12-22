import { Button, Textarea, TextInput } from '@mantine/core';
import { useShallowEffect } from '@mantine/hooks';
import { HandleTRPCError } from '@modules/common/HandleTRPCError';
import { HandleTRPCSuccess } from '@modules/common/HandleTRPCSuccess';
import { trpc } from '@utils/trpc';
import { useState } from 'react';

export function ProfileEdit() {
	const utils = trpc.useContext();
	const { data: profile } = trpc.profile.self.useQuery();

	const mutation = trpc.profile.editMain.useMutation({
		onSuccess: HandleTRPCSuccess({
			callback() {
				utils.profile.self.invalidate();
			},
		}),
		onError: HandleTRPCError(),
	});

	const [biography, setBiography] = useState('');
	const [nickname, setNickname] = useState('');

	useShallowEffect(() => {
		if (profile) {
			setBiography(profile.biography);
			setNickname(profile.nickname);
		}
	}, [profile]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
			<div className="bg-secondary-800 rounded-md border-t-4 border-yellow-400">
				<h2 className="py-2 px-5 bg-secondary-600">Biography</h2>
				<form className="p-5">
					<Textarea
						label="Tell us something great to describe yourself."
						placeholder="Write something..."
						maxLength={196}
						value={biography}
						onChange={(event) =>
							setBiography(event.currentTarget.value.trimStart())
						}
						onBlur={(event) => {
							setBiography(event.currentTarget.value.trim());
						}}
					/>
				</form>
				<div className="flex items-center justify-end p-5">
					<Button
						color="green"
						className="font-normal"
						disabled={biography.trim() === profile?.biography}
						onClick={() => {
							mutation.mutate({ biography });
						}}
					>
						Save
					</Button>
				</div>
			</div>
			<div className="bg-secondary-800 rounded-md border-t-4 border-yellow-400">
				<h2 className="py-2 px-5 bg-secondary-600">Nickname</h2>
				<form className="p-5">
					<TextInput
						label="What should we call you?"
						placeholder="Write something..."
						maxLength={16}
						value={nickname}
						autoComplete="off"
						onChange={(event) => {
							setNickname(event.currentTarget.value.trimStart());
						}}
						onBlur={(event) => {
							setNickname(event.currentTarget.value.trim());
						}}
					/>
				</form>
				<div className="flex items-center justify-end p-5">
					<Button
						color="green"
						className="font-normal"
						disabled={nickname.trim() === profile?.nickname}
						onClick={() => {
							mutation.mutate({ nickname });
						}}
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
