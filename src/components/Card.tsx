interface CardProps {
	title: string;
	className: string;
	children: React.ReactNode;
	noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
	title,
	className,
	children,
	noPadding,
}) => {
	return (
		<div
			className={`bg-secondary-800 shadow-md rounded-md border-t-4 ${className}`}
		>
			<h2 className="py-2 px-5 bg-secondary-400 select-none text-xl md:text-2xl font-medium">
				{title}
			</h2>
			<div className={`${noPadding ? '' : 'p-5 md:p-10'}`}>
				{children}
			</div>
		</div>
	);
};
