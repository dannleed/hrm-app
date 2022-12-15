import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { RouterTransition } from 'components/router-transition';
import Head from 'next/head';

type AppWithAuthProps = AppProps & {
	pageProps: { session: Session };
};

const App = ({ Component, pageProps }: AppWithAuthProps) => {
	return (
		<SessionProvider session={pageProps.session}>
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<RouterTransition />
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
				</Head>
				<Component {...pageProps} />
			</MantineProvider>
		</SessionProvider>
	);
};

export default App;
