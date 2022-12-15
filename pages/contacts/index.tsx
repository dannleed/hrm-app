import { Center, Group, Avatar, Text, Flex, Select, Paper, Box } from '@mantine/core';
import { IconPhoneCall, IconAt, IconMapPin } from '@tabler/icons';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
	const labels = ['Всі', ...new Set(data.map((contact) => contact.category))].map((label) => ({
		label,
		value: label,
	}));

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
				style={{
					zIndex: 100,
					backdropFilter: 'blur(10px)',
					WebkitBackdropFilter: 'blur(10px)',
					height: 'auto',
				}}
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
							>
								<Group noWrap spacing={10}>
									{imageLink ? (
										<Avatar size={96} radius="md">
											<Image
												src={imageLink}
												alt={contact.name}
												fill={true}
												loading="lazy"
												style={{
													objectFit: 'cover',
													objectPosition: `${posX} ${posY}`,
													maxWidth: '100%',
												}}
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
													style={{
														textDecoration: 'none',
													}}
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
												<Link
													href={`${contact.google_maps_url}`}
													style={{
														textDecoration: 'none',
													}}
												>
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
																<Link
																	href={`tel:${phone}`}
																	style={{
																		textDecoration: 'none',
																	}}
																>
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
