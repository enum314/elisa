import { Button, Select, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { HandleTRPCError } from '@modules/common/HandleTRPCError';
import { HandleTRPCSuccess } from '@modules/common/HandleTRPCSuccess';
import { Gender } from '@utils/Constants';
import { trpc } from '@utils/trpc';
import { NextSeo } from 'next-seo';
import { z } from 'zod';

export function SetupProfile() {
	const isMobile = useMediaQuery('(max-width: 640px)');
	const utils = trpc.useContext();

	const mutation = trpc.profile.setup.useMutation({
		onSuccess: HandleTRPCSuccess({
			callback() {
				utils.profile.self.invalidate();
			},
			message: 'Your profile has been created!',
		}),
		onError: HandleTRPCError(),
	});

	const form = useForm({
		initialValues: {
			firstName: '',
			middleName: '',
			lastName: '',
			birthdate: null,
			gender: null,
		},
		validate: zodResolver(
			z.object({
				firstName: z
					.string()
					.min(3, {
						message:
							'first name must contain at least 3 characters long',
					})
					.max(24),
				middleName: z.string().min(0).max(24),
				lastName: z
					.string()
					.min(3, {
						message:
							'last name must contain at least 3 characters long',
					})
					.max(24),
				birthdate: z.date(),
				gender: z.nativeEnum(Gender),
			}),
		),
	});

	return (
		<div className="bg-secondary-800 rounded-md border-t-4 border-blue-400">
			<NextSeo title="Create your profile" />
			<h2 className="py-2 px-5 bg-secondary-400">Create your profile</h2>
			<form
				onSubmit={form.onSubmit((values) =>
					mutation.mutate({
						...values,
						gender: values.gender ?? Gender.Male,
						birthdate: values.birthdate ?? new Date(),
					}),
				)}
				className="p-5"
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
					<TextInput
						withAsterisk
						label="First Name"
						placeholder="Your first name"
						variant="filled"
						autoComplete="off"
						maxLength={24}
						{...form.getInputProps('firstName')}
					/>
					<TextInput
						label="Middle Name"
						placeholder="Your middle name (optional)."
						variant="filled"
						autoComplete="off"
						maxLength={24}
						{...form.getInputProps('middleName')}
					/>
					<TextInput
						withAsterisk
						label="Last Name"
						placeholder="Your last name"
						variant="filled"
						autoComplete="off"
						maxLength={24}
						{...form.getInputProps('lastName')}
					/>
					<Select
						withAsterisk
						label="Gender"
						placeholder="Your gender"
						data={[
							{ label: 'Male', value: 'Male' },
							{ label: 'Female', value: 'Female' },
						]}
						{...form.getInputProps('gender')}
					/>
					<DatePicker
						withAsterisk
						dropdownType={isMobile ? 'modal' : 'popover'}
						placeholder="Your birthdate"
						label="Birthdate"
						{...form.getInputProps('birthdate')}
					/>
				</div>
				<div className="pt-5 grid md:place-items-end">
					<Button color="green" className="font-normal" type="submit">
						Create my profile
					</Button>
				</div>
			</form>
		</div>
	);
}
