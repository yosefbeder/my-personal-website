import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import {
	FaGithub as GithubIcon,
	FaLinkedin as LinkedIn,
	FaEnvelope as MailIcon,
} from 'react-icons/fa';
import { FiCodesandbox as CodeSandbox } from 'react-icons/fi';
import userData from '../public/user-data.json';
import styled from 'styled-components';
import breakPoints from '../constants/break-points';
import { H3, P1, P2 } from '@yosefbeder/design-system/typography';
import { NavLink } from '@yosefbeder/design-system/components';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { fade } from '../constants/variants';
import { useAppSelector } from '../hooks/react-redux';

const routes = [
	{ href: '/', name: 'Home' },
	{ href: '/articles', name: 'Articles' },
];

const Container = styled(motion.aside)`
	--gap: var(--space-lg);

	padding: var(--gap);
	border-bottom: 1px solid var(--color-gray-200);

	@media (min-width: ${breakPoints.sm}px) {
		flex: 0 0 20rem;
		border-bottom: 0;
		border-right: 1px solid var(--color-gray-200);
		align-self: flex-start;
	}

	& ${H3},& ${P1},& ${P2} {
		margin: var(--gap) 0;
	}
`;

const Avatar = styled(Image)`
	border-radius: var(--rounded-full);
`;

const Nav = styled(motion.nav)`
	margin: var(--gap) 0;

	& > ${NavLink} {
		display: inline-block;
	}

	& > ${NavLink}:not(:last-child) {
		margin-right: var(--gap);
	}
`;

const ContactInfo = styled(motion.section)`
	--color-github: #333;
	--color-linkedIn: #0077b5;
	--color-codeSandbox: #242424;
	--color-mail: #ea4335;

	margin: var(--gap) 0;

	& > *:not(:last-child) {
		margin-right: var(--gap);
	}
`;

const ContactCard = styled.a<{
	theme: 'github' | 'linkedIn' | 'codeSandbox' | 'mail';
}>`
	& > svg {
		color: var(--color-gray-500);
		width: 2.2rem;
		height: 2.2rem;

		transition: color 100ms;
	}

	&:hover > svg {
		color: var(--color-${props => props.theme});
	}
`;

const Header = styled(NavLink)<{ depth: number }>`
	display: block;
	margin-left: calc(${props => props.depth - 2} * var(--space-lg));
	font-size: var(--font-sm);
`;

const TOC = styled(motion.section)`
	border: 1px solid var(--color-gray-200);
	padding: var(--space-sm);
	border-radius: var(--rounded-sm);
	margin: var(--gap) 0;
`;

const Sidebar = () => {
	const { route } = useRouter();
	const tocState = useAppSelector(state => state.toc);

	const state = tocState ? (tocState.activeHeader ? 'toc' : 'info') : 'info';

	const {
		name,
		bio,
		avatarUrl,
		githubUrl,
		linkedInUrl,
		codeSandboxUrl,
		email,
	} = userData;

	return (
		<Container>
			<AnimateSharedLayout>
				<AnimatePresence initial={false}>
					{state === 'info' && (
						<motion.section
							variants={fade}
							initial="hidden"
							animate="visible"
							exit="hidden"
						>
							<motion.div variants={fade}>
								<Avatar
									src={avatarUrl}
									alt="My Personal Image"
									width={100}
									height={100}
								/>
							</motion.div>
							<H3 as={motion.h3} variants={fade}>
								{name}
							</H3>
							<P1 as={motion.p} variants={fade}>
								{bio}
							</P1>
						</motion.section>
					)}
				</AnimatePresence>
				<Nav layout>
					{routes.map(({ href, name }) => (
						<Link key={href} href={href} scroll={false} passHref>
							<NavLink
								isNavigatedTo={
									href.length === 1 ? route === href : route.startsWith(href)
								}
							>
								{name}
							</NavLink>
						</Link>
					))}
				</Nav>
				<AnimatePresence initial={false}>
					{state === 'info' ? (
						<ContactInfo
							variants={fade}
							initial="hidden"
							animate="visible"
							exit="hidden"
						>
							<Link href={githubUrl} passHref>
								<ContactCard target="_blank" theme="github">
									<GithubIcon />
								</ContactCard>
							</Link>
							<Link href={linkedInUrl} passHref>
								<ContactCard target="_blank" theme="linkedIn">
									<LinkedIn />
								</ContactCard>
							</Link>
							<Link href={codeSandboxUrl} passHref>
								<ContactCard target="_blank" theme="codeSandbox">
									<CodeSandbox />
								</ContactCard>
							</Link>
							<Link href={`mailto:${email}`} passHref>
								<ContactCard theme="mail">
									<MailIcon />
								</ContactCard>
							</Link>
						</ContactInfo>
					) : (
						<TOC
							variants={fade}
							initial="hidden"
							animate="visible"
							exit="hidden"
							transition={{ delay: 0.25 }}
						>
							{tocState!.headers.map(({ id, depth, content }) => (
								<Header
									key={content}
									depth={depth}
									href={`#${id}`}
									isNavigatedTo={id === tocState!.activeHeader}
								>
									{content}
								</Header>
							))}
						</TOC>
					)}
				</AnimatePresence>
				<P2 as={motion.p} layout>
					© All rights reserved
				</P2>
			</AnimateSharedLayout>
		</Container>
	);
};

export default Sidebar;
