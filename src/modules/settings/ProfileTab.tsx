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
		<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
			<div className="bg-secondary-800 rounded-md border-t-4 border-yellow-400">
				<h2 className="py-2 px-5 bg-secondary-600">
					Basic Information
				</h2>
				<form
					className="p-5"
					onSubmit={form.onSubmit((values) =>
						mutation.mutate(values),
					)}
				>
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
					<div className="pt-5 grid md:place-items-end">
						<Button
							color="green"
							className="font-normal"
							disabled={
								form.values.biography === profile?.biography &&
								form.values.nickname === profile?.nickname
							}
							loading={mutation.isLoading}
							leftIcon={<IconDeviceFloppy />}
							type="submit"
						>
							Save
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
