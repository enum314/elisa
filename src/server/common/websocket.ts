import { OnlineUser } from '@server/stores';
import EventEmitter from 'events';

export interface WebSocketEvents {
	message: [
		message: {
			id: string;
			author: string;
			authorId: string;
			content: string;
			imageURL: string;
			createdAt: Date;
			type: 'message' | 'join' | 'leave';
		},
	];
	'online-users': [users: OnlineUser[]];
}

type Listener<K extends keyof WebSocketEvents> = (
	...args: WebSocketEvents[K]
) => void;

interface WebSocket {
	on<T extends keyof WebSocketEvents>(event: T, listener: Listener<T>): this;
	off<T extends keyof WebSocketEvents>(event: T, listener: Listener<T>): this;
	once<T extends keyof WebSocketEvents>(
		event: T,
		listener: Listener<T>,
	): this;
	emit<T extends keyof WebSocketEvents>(
		event: T,
		...args: WebSocketEvents[T]
	): boolean;
}

class WebSocket extends EventEmitter {
	// TODO: Use Redis soon
}

export const websocket = new WebSocket();
