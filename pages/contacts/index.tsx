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
		}, // will be passed to the page component as props
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
				w={'100vw'}
				top={0}
				style={{
					zIndex: 100,
					backdropFilter: 'blur(10px)',
					height: 60,
				}}
			>
				<h2>Контакт лист</h2>
			</Center>
			<Center>
				<Flex align={'center'} justify={'start'} wrap={'wrap'} maw={500} gap={20} p={20}>
					{data.map((contact) => {
						let imageLink = '';
						if (contact.photo) {
							const rx = /\/d\/(.+)\//gm;
							imageLink = `https://drive.google.com/uc?id=${rx.exec(contact.photo)[1]}`;
						}

						return (
							<div key={contact.name}>
								<Group noWrap>
									<Avatar size={94} radius="md">
										{imageLink ? (
											<Image src={imageLink} alt={contact.name} width={94} height={94} />
										) : null}
									</Avatar>
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
