import EventEmitter from 'events';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WebSocketEvents {
	test: (data: { test: string }) => void;
}

interface WebSocket {
	on<T extends keyof WebSocketEvents>(
		event: T,
		listener: WebSocketEvents[T],
	): this;
	off<T extends keyof WebSocketEvents>(
		event: T,
		listener: WebSocketEvents[T],
	): this;
	once<T extends keyof WebSocketEvents>(
		event: T,
		listener: WebSocketEvents[T],
	): this;
	emit<T extends keyof WebSocketEvents>(
		event: T,
		...args: Parameters<WebSocketEvents[T]>
	): boolean;
}

class WebSocket extends EventEmitter {
	// TODO: Use Redis soon
}

export const websocket = new WebSocket();
