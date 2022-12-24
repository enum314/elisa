import { Card } from '@components/Card';
import { Button, MultiSelect, Select } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { HandleTRPCError } from '@modules/common/HandleTRPCError';
import { HandleTRPCSuccess } from '@modules/common/HandleTRPCSuccess';
import { IconDeviceFloppy } from '@tabler/icons';
import { trpc } from '@utils/trpc';
import { z } from 'zod';

export function GlobalChatSettings() {
	const utils = trpc.useContext();
	const { data: siteSettings } = trpc.site.settings.useQuery();

	const form = useForm({
		initialValues: {
			filteredWords: siteSettings?.filteredWords ?? [],
			whitelistedWords: siteSettings?.whitelistedWords ?? [],
			globalChat: siteSettings?.globalChat ? 'on' : 'off',
			globalChatBlockProfanity: siteSettings?.globalChatBlockProfanity
				? 'on'
				: 'off',
		},
		validate: zodResolver(
			z
				.object({
					filteredWords: z
						.string()
						.min(
							3,
							'Filtered words should be at least 3 characters.',
						)
						.max(16)
						.array()
						.max(64)
						.optional(),
					whitelistedWords: z
						.string()
						.min(
							3,
							'Whitelisted words should be at least 3 characters.',
						)
						.max(16)
						.array()
						.max(64)
						.optional(),
					globalChat: z.enum(['on', 'off']).optional(),
					globalChatBlockProfanity: z.enum(['on', 'off']).optional(),
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
			<Card title="Global Chat" className="border-green-400">
				<div className="grid gap-5">
					<Select
						withAsterisk
						label="Global Chat"
						description="Whether to turn on or off global chat for users."
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
					<Select
						withAsterisk
						label="Block Profanity"
						description="Whether to block unfriendly words in global chat."
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
						value={form.values.globalChatBlockProfanity}
						onChange={(value) =>
							form.setFieldValue(
								'globalChatBlockProfanity',
								value as string,
							)
						}
					/>
				</div>
				<form
					className="grid place-items-end mt-5 md:mt-10"
					onSubmit={form.onSubmit((values) => {
						if (
							(values.globalChat === 'on' ? true : false) ===
								siteSettings?.globalChat &&
							(values.globalChatBlockProfanity === 'on'
								? true
								: false) ===
								siteSettings?.globalChatBlockProfanity
						) {
							return;
						}

						mutation.mutate({
							globalChat:
								values.globalChat === 'on' ? true : false,
							globalChatBlockProfanity:
								values.globalChatBlockProfanity === 'on'
									? true
									: false,
						});
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
			<Card title="Chat Filter" className="border-green-400">
				<div className="grid gap-5">
					<MultiSelect
						withAsterisk
						maxSelectedValues={64}
						defaultValue={[]}
						data={form.values.filteredWords}
						label="Filtered Words"
						description="Words to be filtered in global chat."
						placeholder="Add a word"
						autoComplete="off"
						creatable
						searchable
						clearable
						maxLength={16}
						onCreate={(query) => {
							const value = query
								.trim()
								.replaceAll(/\s/g, '')
								.toLowerCase()
								.slice(0, 16);

							if (value.length < 3) {
								return null;
							}

							form.setFieldValue(
								'filteredWords',
								[...form.values.filteredWords, value]
									.map((x) => {
										const value = x
											.trim()
											.replaceAll(/\s/g, '')
											.toLowerCase()
											.slice(0, 16);
										return value.length ? value : '';
									})
									.filter((x) => x.length)
									.filter(
										(x, i, self) => self.indexOf(x) === i,
									),
							);

							return value;
						}}
						getCreateLabel={(query) =>
							`+ ${query
								.trim()
								.replaceAll(/\s/g, '')
								.toLowerCase()
								.slice(0, 16)}`
						}
						value={form.values.filteredWords.map((x) =>
							x
								.trim()
								.replaceAll(/\s/g, '')
								.toLowerCase()
								.slice(0, 16),
						)}
						onChange={(values) => {
							form.setFieldValue(
								'filteredWords',
								values
									.map((x) => {
										const value = x
											.trim()
											.replaceAll(/\s/g, '')
											.toLowerCase()
											.slice(0, 16);
										return value.length ? value : '';
									})
									.filter((x) => x.length)
									.filter(
										(x, i, self) => self.indexOf(x) === i,
									),
							);
						}}
					/>
					<MultiSelect
						withAsterisk
						maxSelectedValues={64}
						defaultValue={[]}
						data={form.values.whitelistedWords}
						label="Whitelisted Words"
						description="Blocked words to be whitelisted in global chat."
						placeholder="Add a word"
						autoComplete="off"
						creatable
						searchable
						clearable
						maxLength={16}
						onCreate={(query) => {
							const value = query
								.trim()
								.replaceAll(/\s/g, '')
								.toLowerCase()
								.slice(0, 16);

							if (value.length < 3) {
								return null;
							}

							form.setFieldValue(
								'whitelistedWords',
								[...form.values.whitelistedWords, value]
									.map((x) => {
										const value = x
											.trim()
											.replaceAll(/\s/g, '')
											.toLowerCase()
											.slice(0, 16);
										return value.length ? value : '';
									})
									.filter((x) => x.length)
									.filter(
										(x, i, self) => self.indexOf(x) === i,
									),
							);

							return value;
						}}
						getCreateLabel={(query) =>
							`+ ${query
								.trim()
								.replaceAll(/\s/g, '')
								.toLowerCase()
								.slice(0, 16)}`
						}
						value={form.values.whitelistedWords.map((x) =>
							x
								.trim()
								.replaceAll(/\s/g, '')
								.toLowerCase()
								.slice(0, 16),
						)}
						onChange={(values) => {
							form.setFieldValue(
								'whitelistedWords',
								values
									.map((x) => {
										const value = x
											.trim()
											.replaceAll(/\s/g, '')
											.toLowerCase()
											.slice(0, 16);
										return value.length ? value : '';
									})
									.filter((x) => x.length)
									.filter(
										(x, i, self) => self.indexOf(x) === i,
									),
							);
						}}
					/>
				</div>
				<form
					className="grid place-items-end mt-5 md:mt-10"
					onSubmit={form.onSubmit((values) => {
						const filteredWords = values.filteredWords
							.map((x) => {
								const value = x
									.trim()
									.replaceAll(/\s/g, '')
									.toLowerCase()
									.slice(0, 16);
								return value.length ? value : '';
							})
							.filter((x) => x.length)
							.filter((x, i, self) => self.indexOf(x) === i);

						const whitelistedWords = values.whitelistedWords
							.map((x) => {
								const value = x
									.trim()
									.replaceAll(/\s/g, '')
									.toLowerCase()
									.slice(0, 16);
								return value.length ? value : '';
							})
							.filter((x) => x.length)
							.filter((x, i, self) => self.indexOf(x) === i);

						if (
							filteredWords.length ===
								siteSettings?.filteredWords.length &&
							filteredWords.every(
								(element, index) =>
									element ===
									siteSettings.filteredWords[index],
							) &&
							whitelistedWords.length ===
								siteSettings.whitelistedWords.length &&
							whitelistedWords.every(
								(element, index) =>
									element ===
									siteSettings.whitelistedWords[index],
							)
						) {
							return;
						}

						mutation.mutate({
							filteredWords,
							whitelistedWords,
						});
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
