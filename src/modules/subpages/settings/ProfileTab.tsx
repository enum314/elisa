import { Card } from '@components/Card';
import { Avatar, Button, FileButton, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { HandleTRPCError } from '@modules/common/HandleTRPCError';
import { HandleTRPCSuccess } from '@modules/common/HandleTRPCSuccess';
import { IconDeviceFloppy } from '@tabler/icons';
import { trpc } from '@utils/trpc';
import { useState } from 'react';
import { z } from 'zod';

export function ProfileTab() {
	const utils = trpc.useContext();
	const { data: profile } = trpc.profile.self.useQuery();
	const { data: avatar } = trpc.avatar.get.useQuery({
		userId: profile?.userId ?? '',
	});

	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	const form = useForm({
		initialValues: {
			biography: profile?.biography ?? '',
			nickname: profile?.nickname ?? '',
		},
		validate: zodResolver(
			z
				.object({
					biography: z.string().max(196),
					nickname: z.string().max(16),
				})
				.strict(),
		),
	});

	const mutation = trpc.profile.editMain.useMutation({
		onSuccess: HandleTRPCSuccess({
			callback() {
				utils.profile.self.invalidate();
			},
		}),
		onError: HandleTRPCError(),
	});

	const avatarMutation = trpc.avatar.upload.useMutation({
		onSuccess: (output) => {
			HandleTRPCSuccess({
				async callback() {
					if (!avatarFile || !output) {
						utils.avatar.invalidate();

						return;
					}

					const formData = new FormData();

					const { signed } = output;

					const data = {
						...signed.fields,
						'Content-Type': avatarFile.type,
						file: avatarFile,
					};

					for (const name in data) {
						formData.append(name, data[name as keyof typeof data]);
					}

					await fetch(signed.url, {
						method: 'POST',
						body: formData,
					});

					utils.avatar.invalidate();
					setAvatarFile(null);
				},
				message: 'Your new avatar has been applied!',
			})();
		},
		onError: HandleTRPCError(),
	});

	return (
		<div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
			<Card title="Basic Information" className="border-yellow-400">
				<div className="grid gap-5">
					<Textarea
						withAsterisk
						label="Biography"
						description="Tell us something great to describe yourself."
						placeholder="Write something..."
						maxLength={196}
						{...form.getInputProps('biography')}
					/>
					<TextInput
						withAsterisk
						label="Nickname"
						description="What should we call you?"
						placeholder="Write something..."
						maxLength={16}
						autoComplete="off"
						{...form.getInputProps('nickname')}
					/>
				</div>
				<form
					className="grid place-items-end mt-5 md:mt-10"
					onSubmit={form.onSubmit((values) => {
						if (
							values.biography.trim() === profile?.biography &&
							values.nickname.trim() === profile?.nickname
						) {
							return;
						}

						mutation.mutate(values);
					})}
				>
					<Button
						color="green"
						loading={mutation.isLoading}
						leftIcon={<IconDeviceFloppy />}
						type="submit"
					>
						Save
					</Button>
				</form>
			</Card>
			<Card title="Avatar" className="border-yellow-400">
				<div className="grid place-items-center">
					<Avatar
						className="h-32 w-32 ring-4 ring-black"
						src={
							avatarFile
								? URL.createObjectURL(avatarFile)
								: avatar?.url
						}
						alt={profile?.avatar ?? ''}
					/>
				</div>
				<div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
					<Button
						className={!avatar?.url ? 'invisible' : ''}
						color="red"
						onClick={async () => {
							avatarMutation.mutate({ reset: true });
						}}
					>
						Reset
					</Button>
					<FileButton
						onChange={setAvatarFile}
						accept="image/png,image/jpeg"
					>
						{(props) => <Button {...props}>Upload</Button>}
					</FileButton>
					<Button
						className={!avatarFile ? 'invisible' : ''}
						color="green"
						onClick={async () => {
							avatarMutation.mutate({ reset: false });
						}}
					>
						Save
					</Button>
				</div>
			</Card>
		</div>
	);
}
