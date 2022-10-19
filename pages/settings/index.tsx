import { Center } from '@mantine/core';
import Head from 'next/head';
import { HeaderAction, HeaderActionProps } from '@components';

function Settings() {
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
				<h2>Settings</h2>
			</Center>
		</>
	);
}

export default Settings;
