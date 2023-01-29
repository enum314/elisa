export function PageTitle({ children }: { children: string }) {
	return (
		<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
			{children}
		</h1>
	);
}
