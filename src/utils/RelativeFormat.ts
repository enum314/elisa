export function RelativeFormat(date: Date) {
	const now = new Date(Date.now());

	const diff = now.getDate() - date.getDate();

	if (diff === -1) {
		return `Tomorrow at ${date.toLocaleTimeString()}`;
	} else if (diff === 0) {
		return `Today at ${date.toLocaleTimeString()}`;
	} else if (diff === 1) {
		return `Yesterday at ${date.toLocaleTimeString()}`;
	} else {
		return `${date.toLocaleDateString()}`;
	}
}
