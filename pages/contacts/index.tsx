import { Center, Group, Avatar, Text, Flex } from '@mantine/core';
import { IconPhoneCall, IconAt } from '@tabler/icons';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

	console.log(data);

	return {
		props: {
			data,
		},
	};
}

function Contacts({ data }: { data: Contact[] }) {
	const router = useRouter();

	if (router.query.id !== '1eppyAZOqPhCEO7ouPNX1jWUVNmurj6hQipx4mxvmeBY') {
		return (
			<>
				<Head>
					<title>Контакт лист</title>
				</Head>
				<Center>
					<h2>Немає доступу</h2>
				</Center>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>Контакт лист</title>
			</Head>
			<Center
				pos={'sticky'}
				w={'100%'}
				top={0}
				style={{
					zIndex: 100,
					backdropFilter: 'blur(10px)',
					WebkitBackdropFilter: 'blur(10px)',
					height: 60,
				}}
			>
				<h2>Контакт лист</h2>
			</Center>
			<Center>
				<Flex align={'center'} justify={'start'} wrap={'wrap'} maw={500} gap={20} p={20}>
					{data.map((contact) => {
						let imageLink;
						if (contact.photo) {
							const rx = /com\/(.+)/gm;
							imageLink = `https://i.gyazo.com/${rx.exec(contact.photo)![1]}.jpg`;
						}

						const posX = contact.posX !== '' ? `${contact.posX}%` : '50%';
						const posY = contact.posY !== '' ? `${contact.posY}%` : '50%';

						return (
							<div key={contact.name}>
								<Group noWrap>
									{imageLink ? (
										<Avatar size={100} radius="md">
											<Image
												src={imageLink}
												alt={contact.name}
												width={100}
												height={100}
												style={{
													objectFit: 'cover',
													objectPosition: `50% ${contact.posY !== '' ? `${contact.posY}%` : '50%'}`,
												}}
											/>
										</Avatar>
									) : (
										<Avatar size={100} radius="md"></Avatar>
									)}
									<div>
										<Text size="xs" sx={{ textTransform: 'uppercase' }} weight={700} color="dimmed">
											{contact.position}
										</Text>

										<Text size="lg" weight={500}>
											{contact.name}
										</Text>

										{contact.email && (
											<Group noWrap spacing={10} mt={3}>
												<IconAt stroke={1.5} size={16} />
												<Link
													href={`mailto:${contact.email}`}
													style={{
														textDecoration: 'none',
													}}
												>
													<Text size="xs" color="dimmed">
														{contact.email}
													</Text>
												</Link>
											</Group>
										)}

										{contact.phone && (
											<Group noWrap spacing={10} mt={5}>
												<IconPhoneCall stroke={1.5} size={16} />
												<Link
													href={`tel:${contact.phone}`}
													style={{
														textDecoration: 'none',
													}}
												>
													<Text size="xs" color="dimmed">
														{contact.phone}
													</Text>
												</Link>
											</Group>
										)}
									</div>
								</Group>
							</div>
						);
					})}
				</Flex>
			</Center>
		</>
	);
}

export default Contacts;
