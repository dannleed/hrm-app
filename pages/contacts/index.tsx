import {
	Center,
	Group,
	Avatar,
	Text,
	Flex,
	Paper,
	ActionIcon,
	Tabs,
	ScrollArea,
	Title,
	createStyles,
	MANTINE_COLORS,
} from '@mantine/core';
import { IconPhoneCall, IconAt, IconMapPin, IconDownload } from '@tabler/icons';
import { transliterate } from 'helpers';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';

type Contact = {
	'category': string;
	'name': string;
	'position': string;
	'address': string;
	'google_maps_url': string;
	'phone': string;
	'email': string;
	'posX': number | '';
	'posY': number | '';
	'photo': string;
	'parent_name': string;
	'child': Contact[];
	'children': string;
};

interface IContactData {
	[key: string]: Contact[];
}

const useStyles = createStyles((_theme, _params, _getRef) => ({
	navbar: {
		zIndex: 100,
		backdropFilter: 'blur(10px)',
		height: 'auto',
	},
	image: {
		objectFit: 'cover',
	},
	link: {
		textDecoration: 'none',
	},
	actionIcon: {
		backdropFilter: 'blur(1.3px)',
	},
}));

const exportToVCard = (contact: Contact) => {
	const phones = contact?.phone?.split(',');

	const vCard = `BEGIN:VCARD
VERSION:3.0
${contact.name ? `N:${contact.name}` : ''}
${contact.name ? `FN:${contact.name}` : ''}
ORG:Євразія
${contact.position ? `TITLE:${contact.position}` : ''}
${phones.length > 0 ? phones.map((p) => `TEL;TYPE=WORK,VOICE:${p}`).join('\n') : ''}
${contact.address ? `ADR;TYPE=WORK:;;Київ, ${contact.address}` : ''}
${contact.google_maps_url ? `URL;TYPE=Google Maps:${contact.google_maps_url}` : ''}
${contact.email ? `EMAIL;TYPE=PREF,INTERNET:${contact.email}` : ''}
END:VCARD`;

	const blob = new Blob([vCard], { type: 'text/vcard' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `${contact.name}.vcf`;
	link.click();
};

export async function getServerSideProps() {
	const res = await fetch(
		'https://script.google.com/macros/s/AKfycbxFPyaXUCJVJv6Sco2_vfho504HmpCZs3E2H99hGohwNUv55F3rpElSWF9KfLUnsS-0/exec',
	);

	const data: Contact[] = await res.json();

	return {
		props: {
			data,
		},
	};
}

const Contact = ({ data }: { data: Contact }) => {
	const contact = data;

	const { classes } = useStyles();

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		if (/iPhone|iPod|Android/i.test(navigator.userAgent)) {
			setIsMobile(true);
		}
	}, []);

	let imageLink;
	if (contact.photo) {
		const rx = /com\/(.+)/gm;
		imageLink = `https://i.gyazo.com/${rx.exec(contact.photo)![1]}.jpg`;
	}

	const phones = contact.phone?.split(',').map((phone) => {
		if (phone.trim().startsWith('0800')) {
			return phone.replace(/(\d{1})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
		} else {
			return phone.trim().replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
		}
	});

	const isAbleToSave = contact.name && contact.phone && isMobile;

	const posX = contact.posX !== '' ? `${contact.posX}%` : '50%';
	const posY = contact.posY !== '' ? `${contact.posY}%` : '50%';

	const colorByName =
		MANTINE_COLORS[contact.name.split(' ')[0].charCodeAt(0) % MANTINE_COLORS.length ?? 0];

	return (
		<>
			<Group noWrap spacing={10} pos={'relative'}>
				{isAbleToSave && (
					<ActionIcon
						onClick={() => exportToVCard(contact)}
						pos={'absolute'}
						top={-6}
						right={-6}
						bg={'#ffffff70'}
						className={classes.actionIcon}
					>
						<IconDownload size={16} />
					</ActionIcon>
				)}
				{imageLink ? (
					<Avatar size={96} radius="md">
						<Image
							src={imageLink}
							alt={contact.name}
							sizes="192px"
							quality={90}
							loading="lazy"
							className={classes.image}
							style={{ objectPosition: `${posX} ${posY}` }}
							fill
						/>
					</Avatar>
				) : (
					<Avatar size={96} radius="md" color={colorByName}>
						{contact.name.split(' ')[0][0] + contact.name.split(' ')[1][0]}
					</Avatar>
				)}
				<div>
					<Text size="xs" sx={{ textTransform: 'uppercase' }} weight={700} color="dimmed">
						{contact.position}
					</Text>

					<Text size="lg" weight={500}>
						{contact.name}
					</Text>

					{contact.email && (
						<Group noWrap spacing={5} mt={3}>
							<IconAt stroke={1.5} size={16} />
							<Link href={`mailto:${contact.email.toLowerCase()}`} className={classes.link}>
								<Text size="xs" color="dimmed">
									{contact.email.toLowerCase()}
								</Text>
							</Link>
						</Group>
					)}
					{contact.address && (
						<Group noWrap spacing={5} mt={3}>
							<IconMapPin stroke={1.5} size={16} />
							<Link href={`${contact.google_maps_url}`} className={classes.link}>
								<Text size="xs" color="dimmed">
									{contact.address}
								</Text>
							</Link>
						</Group>
					)}

					<Flex align={'center'} justify={'start'} wrap={'wrap'} gap={10} mt={3}>
						{!!phones!.length &&
							phones?.map(
								(phone) =>
									phone && (
										<Group noWrap spacing={5} key={phone}>
											<IconPhoneCall stroke={1.5} size={16} />
											<Link href={`tel:${phone}`} className={classes.link}>
												<Text size="xs" color="dimmed">
													{phone}
												</Text>
											</Link>
										</Group>
									),
							)}
					</Flex>
				</div>
			</Group>
			{contact.children && contact.child.map((c) => <Contact key={c.name} data={c} />)}
		</>
	);
};

const FilterTabs = ({ labels }: { labels: { value: string; label: string }[] }) => {
	const { classes } = useStyles();

	const activeId = useScrollSpy(
		labels.map((el) => el.value),
		80,
	);

	const handleClick = (id: string) => {
		const el = document.getElementById(id) as HTMLElement;
		window.scrollTo({
			top: el.offsetTop,
		});
	};

	useEffect(() => {
		const el = document.querySelector('#tabs_container')?.children as HTMLCollectionOf<HTMLElement>;
		if (el && activeId) {
			const area = [...el].map((el: HTMLElement) => ({
				id: el.id,
				offset: el.offsetLeft,
				width: el.offsetWidth,
			}));

			const vw = window.visualViewport!.width;

			const elementParams = area.filter((el) => el.id === transliterate(activeId))[0];

			document.querySelector('.mantine-ScrollArea-viewport')?.scrollTo({
				left: elementParams.offset - (vw - 20) / 2 + elementParams.width / 2,
				behavior: 'smooth',
			});
		}
	}, [activeId]);

	return (
		<Paper
			shadow={'xs'}
			bg={'transparent'}
			pos={'fixed'}
			w={'100%'}
			top={0}
			p={10}
			pb={5}
			className={classes.navbar}
		>
			<Tabs
				defaultValue={labels[0].value}
				value={activeId}
				unstyled
				styles={(theme) => ({
					tab: {
						...theme.fn.focusStyles(),
						backgroundColor: '#ffffff75',
						color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
						border: `1px solid #f3f3f380`,
						padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
						cursor: 'pointer',
						fontSize: theme.fontSizes.sm,
						display: 'flex',
						alignItems: 'center',
						width: 'max-content',
						whiteSpace: 'nowrap',
						borderRadius: theme.radius.md,
						gap: '10px',

						'&[data-active]': {
							backgroundColor: theme.colors.yellow[7],
							borderColor: theme.colors.yellow[7],
							color: theme.white,
						},
					},

					tabsList: {
						display: 'flex',
						gap: '4px',
						justifyContent: 'center',
					},
				})}
			>
				<ScrollArea offsetScrollbars scrollbarSize={5} type="never">
					<Tabs.List id={'tabs_container'}>
						{labels.map((el) => (
							<div key={el.value} id={transliterate(el.value)}>
								<Tabs.Tab key={el.value} value={el.value} onClick={() => handleClick(el.value)}>
									{el.label}
								</Tabs.Tab>
							</div>
						))}
					</Tabs.List>
				</ScrollArea>
			</Tabs>
		</Paper>
	);
};

function Contacts({ data }: { data: Contact[] }) {
	const contacts = data.filter((el) => {
		if (el.children) {
			el.child = [];
			return data.filter((contact) => {
				if (contact.parent_name === el.name) {
					el.child.push(contact);
					return el;
				}
			});
		}
	});

	const filtered = data.filter((el) => el.parent_name === '' && el.children === '');

	const groupedContacts: IContactData = [...contacts, ...filtered].reduce((group, contact) => {
		const { category } = contact;
		group[category] = group[category] ?? [];
		group[category].push(contact);
		return group;
	}, {} as IContactData);

	const labels = Object.keys(groupedContacts).map((label) => ({
		label,
		value: label.replace(' ', '_'),
	}));

	return (
		<>
			<div>
				<Head>
					<title>Контакт лист</title>
				</Head>
				<FilterTabs labels={labels} />
			</div>
			<div>
				<Center>
					<Flex
						align={'center'}
						justify={'start'}
						wrap={'wrap'}
						maw={600}
						gap={10}
						p={10}
						miw={350}
						id={'group_container'}
					>
						{labels.map((label, i) => {
							return (
								<section
									style={{
										all: 'inherit',
										padding: 0,
										paddingTop: 70,
										marginBottom: -50,
										paddingBottom: i === labels.length - 1 ? 250 : 0,
									}}
									id={label.value}
									key={label.value}
								>
									<Title order={2} key={label.value}>
										{label.label}
									</Title>
									{groupedContacts[label.label].map((contact) => (
										<Paper
											shadow={'lg'}
											p={'xs'}
											withBorder={true}
											radius={'lg'}
											key={contact.name}
											w={'100%'}
											miw={300}
											pos={'relative'}
										>
											<Flex direction={'column'} gap={10}>
												<Contact key={contact.name} data={contact} />
											</Flex>
										</Paper>
									))}
								</section>
							);
						})}
					</Flex>
				</Center>
			</div>
		</>
	);
}

export default Contacts;
