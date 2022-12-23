interface CardProps {
	title: string;
	className: string;
	children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, className, children }) => {
	return (
		<div
			className={`bg-secondary-800 rounded-md border-t-4 ${className} pb-1`}
		>
			<h2 className="py-2 px-5 bg-secondary-400 select-none text-xl md:text-2xl font-medium">
				{title}
			</h2>
			{children}
		</div>
	);
};
