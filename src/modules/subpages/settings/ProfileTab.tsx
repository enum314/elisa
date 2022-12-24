import { Card } from '@components/Card';
import { Button, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { HandleTRPCError } from '@modules/common/HandleTRPCError';
import { HandleTRPCSuccess } from '@modules/common/HandleTRPCSuccess';
import { IconDeviceFloppy } from '@tabler/icons';
import { trpc } from '@utils/trpc';
import { z } from 'zod';

export function ProfileTab() {
	const utils = trpc.useContext();
	const { data: profile } = trpc.profile.self.useQuery();

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
		</div>
	);
}
