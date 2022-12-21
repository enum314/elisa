import { NextApiRequest } from 'next';

export function getIPAddressFromRequest(req: NextApiRequest) {
	const xff = req.headers['x-forwarded-for'] ?? req.headers['x-real-ip'];

	return xff
		? Array.isArray(xff)
			? xff[0].split(',')[0]
			: xff.split(',')[0]
		: '127.0.0.1';
}
