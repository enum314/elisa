import TextParser from '@components/TextParser';
import { Avatar, ScrollArea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import type { WebSocketEvents } from '@server/common/websocket';
import { RelativeFormat } from '@utils/RelativeFormat';
import { trpc } from '@utils/trpc';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

import { HandleTRPCError } from './common/HandleTRPCError';

export function GlobalChat() {
	const scrollTargetRef = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<WebSocketEvents['message'][0][]>(
		[],
	);

	const form = useForm({
		initialValues: {
			content: '',
		},
		validate: zodResolver(
			z
				.object({
					content: z
						.string()
						.min(1, 'Message should not be empty')
						.max(100),
				})
				.strict(),
		),
	});

	const scroll = useCallback(() => {
		scrollTargetRef?.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		});
	}, [scrollTargetRef]);

	const sender = trpc.message.send.useMutation({
		onMutate() {
			setLoading(true);
		},
		onSuccess() {
			form.reset();
		},
		onError: HandleTRPCError({
			messages: [
				['TOO_MANY_REQUESTS', 'Hey there. Slow down sending messages!'],
				[
					'FORBIDDEN',
					'Hello there. It seems you have global chat turned off. You can turn it back on at Account Settings',
				],
			],
		}),
		onSettled() {
			setLoading(false);
		},
	});

	const addMessage = useCallback(
		(incomingMessage: WebSocketEvents['message'][0]) => {
			setMessages((current) => {
				const msgs = current.filter(
					({ id }) => id !== incomingMessage.id,
				);

				msgs.push(incomingMessage);

				return msgs.sort(
					(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
				);
			});
		},
		[],
	);

	useEffect(() => {
		scroll();
	}, [scroll, messages]);

	trpc.message.listen.useSubscription(undefined, {
		onData(incomingMessage) {
			addMessage(incomingMessage);
			scroll();
		},
		onError(err) {
			console.error('Subscription error:', err);
		},
	});

	return (
		<div className="col-span-2 bg-secondary-800 rounded-md border-t-4 border-cyan-400">
			<h2 className="py-2 px-5 bg-secondary-400">Global Chat</h2>
			<ScrollArea style={{ height: 305 }} type="scroll">
				<div className="p-5 grid gap-3" ref={scrollTargetRef}>
					{messages.map((message) => (
						<GlobalMessageComponent
							key={message.id + message.authorId}
							message={message}
						/>
					))}
				</div>
			</ScrollArea>
			<form
				onSubmit={form.onSubmit((values) => {
					if (!loading) {
						sender.mutate(values);
					}
				})}
				className="p-5 border-t border-gray-600"
			>
				<TextInput
					placeholder="Type a message..."
					autoComplete="off"
					maxLength={100}
					{...form.getInputProps('content')}
				/>
			</form>
		</div>
	);
}

function GlobalMessageComponent({
	message,
}: {
	message: WebSocketEvents['message'][0];
}): JSX.Element {
	return (
		<div className="flex select-none">
			<Avatar src={message.imageURL} alt={message.authorId} size={48} />
			{message.type === 'join' ? (
				<div className="ml-5 flex items-center">
					<h3 className="text-lg sm:text-xl text-green-400">
						{message.author}{' '}
						<span className="text-sm sm:text-base text-gray-400">
							joined the chat
						</span>
					</h3>
				</div>
			) : null}
			{message.type === 'leave' ? (
				<div className="ml-5 flex items-center">
					<h3 className="text-lg sm:text-xl text-rose-400">
						{message.author}{' '}
						<span className="text-sm sm:text-base text-gray-400">
							left the chat
						</span>
					</h3>
				</div>
			) : null}
			{message.type === 'message' ? (
				<div className="ml-5">
					<h3 className="text-base md:text-lg text-white">
						{message.author}{' '}
						<span className="text-xs text-gray-400 block sm:inline">
							{RelativeFormat(message.createdAt)}
						</span>
					</h3>
					<p className="text-sm sm:text-base text-gray-300 select-text">
						<TextParser>{message.content}</TextParser>
					</p>
				</div>
			) : null}
		</div>
	);
}
