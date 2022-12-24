import { Card } from '@components/Card';
import { Button, Select } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { HandleTRPCError } from '@modules/common/HandleTRPCError';
import { HandleTRPCSuccess } from '@modules/common/HandleTRPCSuccess';
import { IconDeviceFloppy } from '@tabler/icons';
import { trpc } from '@utils/trpc';
import { z } from 'zod';

export function SettingsTab() {
	const utils = trpc.useContext();
	const { data: profile } = trpc.profile.self.useQuery();

	const form = useForm({
		initialValues: {
			allowFriendships: profile?.allowFriendships ? 'allow' : 'deny',
			allowChatRequests: profile?.allowChatRequests ? 'allow' : 'deny',
			globalChat: profile?.globalChat ? 'on' : 'off',
		},
		validate: zodResolver(
			z
				.object({
					allowFriendships: z.enum(['allow', 'deny']),
					allowChatRequests: z.enum(['allow', 'deny']),
					globalChat: z.enum(['on', 'off']),
				})
				.strict(),
		),
	});

	const mutation = trpc.profile.editPrivacy.useMutation({
		onSuccess: HandleTRPCSuccess({
			callback() {
				utils.profile.self.invalidate();
			},
			message: 'Your privacy settings has been updated!',
		}),
		onError: HandleTRPCError(),
	});

	return (
		<div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
			<Card title="Chat Settings" className="border-red-400">
				<div className="grid gap-5">
					<Select
						withAsterisk
						label="Allow Direct Message Requests"
						description="Whether to allow users to send you a direct message request."
						data={[
							{
								value: 'allow',
								label: 'Allow',
							},
							{
								value: 'deny',
								label: 'Deny',
							},
						]}
						value={form.values.allowChatRequests}
						onChange={(value) =>
							form.setFieldValue(
								'allowChatRequests',
								value as string,
							)
						}
					/>
					<Select
						withAsterisk
						label="Global Chat"
						description="Whether to turn on/off global chat. Turning this off will prevent you from joining the global chat and prevents you from sending messages."
						data={[
							{
								value: 'on',
								label: 'On',
							},
							{
								value: 'off',
								label: 'Off',
							},
						]}
						value={form.values.globalChat}
						onChange={(value) =>
							form.setFieldValue('globalChat', value as string)
						}
					/>
				</div>
				<form
					className="grid place-items-end mt-5"
					onSubmit={form.onSubmit((values) => {
						if (
							(form.values.allowChatRequests === 'allow'
								? true
								: false) === profile?.allowChatRequests &&
							(form.values.globalChat === 'on' ? true : false) ===
								profile?.globalChat
						) {
							return;
						}

						mutation.mutate({
							allowChatRequests:
								values.allowChatRequests === 'allow'
									? true
									: false,
							globalChat:
								values.globalChat === 'on' ? true : false,
						});
					})}
				>
					<Button
						color="green"
						className="font-normal"
						loading={mutation.isLoading}
						leftIcon={<IconDeviceFloppy />}
						type="submit"
					>
						Save
					</Button>
				</form>
			</Card>
			<Card title="Privacy Settings" className="border-red-400">
				<div className="grid gap-5">
					<Select
						withAsterisk
						label="Allow Friend Requests"
						description="Whether to allow users to send you a friend request."
						data={[
							{
								value: 'allow',
								label: 'Allow',
							},
							{
								value: 'deny',
								label: 'Deny',
							},
						]}
						value={form.values.allowFriendships}
						onChange={(value) =>
							form.setFieldValue(
								'allowFriendships',
								value as string,
							)
						}
					/>
				</div>
				<form
					className="grid place-items-end mt-5 md:mt-10"
					onSubmit={form.onSubmit((values) => {
						if (
							(values.allowFriendships === 'allow'
								? true
								: false) === profile?.allowFriendships
						) {
							return;
						}

						mutation.mutate({
							allowFriendships:
								values.allowFriendships === 'allow'
									? true
									: false,
						});
					})}
				>
					<Button
						color="green"
						className="font-normal"
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
