import { Card } from '@components/Card';
import { Button, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { HandleTRPCError } from '@modules/common/HandleTRPCError';
import { HandleTRPCSuccess } from '@modules/common/HandleTRPCSuccess';
import { IconDeviceFloppy } from '@tabler/icons';
import { trpc } from '@utils/trpc';
import { z } from 'zod';

export function Basic() {
	const utils = trpc.useContext();
	const { data: siteSettings } = trpc.site.settings.useQuery();

	const form = useForm({
		initialValues: {
			companyName: siteSettings?.companyName ?? '',
		},
		validate: zodResolver(
			z
				.object({
					companyName: z
						.string()
						.min(
							3,
							'Company name should be at least 3 characters long',
						)
						.max(24),
				})
				.strict(),
		),
	});

	const mutation = trpc.site.edit.useMutation({
		onSuccess: HandleTRPCSuccess({
			callback() {
				utils.site.invalidate();
			},
		}),
		onError: HandleTRPCError(),
	});

	return (
		<div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
			<Card title="Basic Settings" className="border-green-400">
				<div className="grid gap-5">
					<TextInput
						withAsterisk
						label="Company Name"
						description="The name that is used throughout the application."
						autoComplete="off"
						maxLength={24}
						{...form.getInputProps('companyName')}
					/>
				</div>
				<form
					className="grid place-items-end mt-5 md:mt-10"
					onSubmit={form.onSubmit((values) => {
						if (
							form.values.companyName.trim() ===
							siteSettings?.companyName
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
