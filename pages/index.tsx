import { useRef } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Head from 'next/head';
import components from '../constants/components';
import styled from 'styled-components';
import useAutoScrolling from '../hooks/useAutoScrolling';
import { mainSharedStyles, routeTransitions } from './_app';
import { motion } from 'framer-motion';
import { GetStaticProps } from 'next';
import { H1, H2, H3, H4 } from '@yosefbeder/design-system/typography';

const HomeMain = styled(motion.main)`
	${mainSharedStyles}
	padding-top: 0.005px;
`;

export const getStaticProps: GetStaticProps = async () => {
	const content = await fetch(
		'https://raw.githubusercontent.com/yosefbeder/yosefbeder/main/README.md',
	)
		.then(res => res.text())
		.then(text => text);

	return {
		props: {
			children: await serialize(content),
		},
	};
};

const Home: React.FC<{
	children: MDXRemoteSerializeResult<Record<string, unknown>>;
}> = ({ children }) => {
	const mainRef = useRef<HTMLDivElement>(null);
	useAutoScrolling(mainRef);

	return (
		<>
			<Head>
				<title>Home</title>
			</Head>
			<HomeMain
				ref={mainRef}
				variants={routeTransitions}
				initial="hidden"
				animate="enter"
				exit="exit"
			>
				<H1>Home</H1>
				<MDXRemote
					{...children}
					components={{ ...components, h2: H2, h3: H3, h4: H4 }}
				/>
			</HomeMain>
		</>
	);
};

export default Home;
