import { Center, Group, Avatar, Text, Flex, Select, Paper, ActionIcon } from '@mantine/core';
import { IconPhoneCall, IconAt, IconMapPin, IconDownload } from '@tabler/icons';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createStyles } from '@mantine/core';

type Contact = {
	'category': string;
	'name': string;
	'position': string | null;
	'address': string | null;
	'google_maps_url': string | null;
	'phone': string | null;
	'email': string | null;
	'posX': number | '';
	'posY': number | '';
	'photo': string | null;
};

const useStyles = createStyles((_theme, _params, getRef) => ({
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
	const vCard = `BEGIN:VCARD
VERSION:3.0
${contact.name ? `N:${contact.name}` : ''}
${contact.name ? `FN:${contact.name}` : ''}
ORG:Євразія
${contact.position ? `TITLE:${contact.position}` : ''}
${contact.phone ? `TEL;TYPE=WORK,VOICE:${contact.phone}` : ''}
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

function Contacts({ data }: { data: Contact[] }) {
	const { classes } = useStyles();

	const labels = ['Всі', ...new Set(data.map((contact) => contact.category))].map((label) => ({
		label,
		value: label,
	}));

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			setIsMobile(true);
		}
	}, []);

	const [filteredData, setFilteredData] = useState(data);

	const handleSelect = (value: string) => {
		if (value === 'Всі') {
			setFilteredData(data);
		} else {
			setFilteredData(data.filter((contact) => contact.category === value));
		}
	};

	return (
		<>
			<Head>
				<title>Контакт лист</title>
			</Head>
			<Paper
				shadow={'xs'}
				bg={'transparent'}
				pos={'sticky'}
				w={'100%'}
				top={0}
				p={10}
				className={classes.navbar}
			>
				<Flex align={'center'} justify={'center'} wrap={'nowrap'} gap={10} m={'auto'}>
					<Text weight={'bold'}>Контакт-лист </Text>
					<Select
						data={labels}
						defaultValue={'Всі'}
						onChange={handleSelect}
						variant="unstyled"
						radius="xl"
						size="md"
						iconWidth={20}
					/>
				</Flex>
			</Paper>
			<Center>
				<Flex align={'center'} justify={'start'} wrap={'wrap'} maw={600} gap={10} p={10} miw={350}>
					{filteredData.map((contact) => {
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

						return (
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
								{isAbleToSave && (
									<ActionIcon
										onClick={() => exportToVCard(contact)}
										pos={'absolute'}
										top={4}
										right={4}
										bg={'#ffffff70'}
										className={classes.actionIcon}
									>
										<IconDownload size={16} />
									</ActionIcon>
								)}
								<Group noWrap spacing={10}>
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
										<Avatar size={96} radius="md"></Avatar>
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
												<Link
													href={`mailto:${contact.email.toLowerCase()}`}
													className={classes.link}
												>
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
							</Paper>
						);
					})}
				</Flex>
			</Center>
		</>
	);
}

export default Contacts;
