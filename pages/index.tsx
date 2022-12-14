import { Center } from '@mantine/core';
import Head from 'next/head';
import { HeaderAction, HeaderActionProps } from '@components';
import Image from 'next/image';

function Home() {
	const { links }: HeaderActionProps = {
		links: [
			{
				link: '/',
				label: 'Features',
				links: [
					{
						link: '/',
						label: 'Feature 1',
					},
					{
						link: '/',
						label: 'Feature 2',
					},
				],
			},
			{
				link: '/',
				label: 'Pricing',
			},
			{
				link: '/',
				label: 'About',
			},
			{
				link: '/settings',
				label: 'Settings',
			},
		],
	};

	return (
		<>
			<Head>
				<title>HRMS</title>
			</Head>
			<HeaderAction links={links} />
			<Center>
				<h2>Home</h2>
			</Center>
			<Center>
				<Image
					src="https://upload.wikimedia.org/wikipedia/commons/3/3d/LARGE_elevation.jpg"
					alt="hero"
					width={1280}
					height={720}
				/>
			</Center>
		</>
	);
}

export default Home;
