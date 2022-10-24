import {
	createStyles,
	Menu,
	Center,
	Header,
	Container,
	Group,
	Button,
	Burger,
	Loader,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NextLink } from '@mantine/next';
import { IconChevronDown, IconLogin, IconLogout } from '@tabler/icons';
import { signIn, signOut, useSession } from 'next-auth/react';

const HEADER_HEIGHT = 60;
const useStyles = createStyles((theme) => ({
	inner: {
		height: HEADER_HEIGHT,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	links: {
		[theme.fn.smallerThan('sm')]: {
			display: 'none',
		},
	},

	burger: {
		[theme.fn.largerThan('sm')]: {
			display: 'none',
		},
	},

	link: {
		display: 'block',
		lineHeight: 1,
		padding: '8px 12px',
		borderRadius: theme.radius.sm,
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	linkLabel: {
		marginRight: 5,
	},
}));
type Link = {
	label: string;
	link: string;
	links?: { label: string; link: string }[];
};
export type HeaderActionProps = {
	links: Link[];
};
export function HeaderAction({ links }: HeaderActionProps) {
	const { status } = useSession();
	const { classes } = useStyles();
	const [opened, { toggle }] = useDisclosure(false);
	const items = links.map((link) => {
		const menuItems = link.links?.map((item) => (
			<Menu.Item key={item.link}>{item.label}</Menu.Item>
		));

		if (menuItems) {
			return (
				<Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
					<Menu.Target>
						<NextLink href={link.link} className={classes.link} passHref>
							<Center>
								<span className={classes.linkLabel}>{link.label}</span>
								<IconChevronDown size={12} stroke={1.5} />
							</Center>
						</NextLink>
					</Menu.Target>
					<Menu.Dropdown>{menuItems}</Menu.Dropdown>
				</Menu>
			);
		}

		return (
			<NextLink key={link.label} href={link.link} className={classes.link} passHref>
				{link.label}
			</NextLink>
		);
	});

	return (
		<>
			<Header
				style={{
					position: 'sticky',
				}}
				height={HEADER_HEIGHT}
				sx={{ borderBottom: 0 }}
				mb={120}
			>
				<Container className={classes.inner} fluid>
					<Group>
						<Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
						<NextLink
							href={'/'}
							style={{
								color: 'inherit',
								textDecoration: 'none',
							}}
							passHref
						>
							<h2>HRMS</h2>
						</NextLink>
					</Group>
					<Group spacing={5} className={classes.links}>
						{items}
					</Group>
					{status === 'loading' && <Loader />}
					{status === 'unauthenticated' && (
						<Button
							leftIcon={<IconLogin size={20} />}
							radius="md"
							sx={{ height: 30 }}
							onClick={() => signIn()}
						>
							Log in
						</Button>
					)}
					{status === 'authenticated' && (
						<Button
							leftIcon={<IconLogout size={20} />}
							radius="md"
							sx={{ height: 30 }}
							onClick={() =>
								signOut({
									redirect: false,
								})
							}
						>
							Log out
						</Button>
					)}
				</Container>
			</Header>
		</>
	);
}
