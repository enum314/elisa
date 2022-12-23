import { HyperLink } from '@components/HyperLink';
import { linkRegex } from '@utils/Constants';
import React from 'react';

interface TextParserProps {
	children: string;
}

const TextParser: React.FC<TextParserProps> = ({ children }) => {
	return (
		<>
			{children.split(/(?=[ ,\n])|(?<=[ ,\n])/g).map((text, i) => {
				if (new RegExp(linkRegex).test(text)) {
					return <HyperLink key={i} href={text} />;
				}

				return text;
			})}
		</>
	);
};

export default TextParser;
