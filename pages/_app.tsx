import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { RouterTransition } from 'components/router-transition';
import Head from 'next/head';
import './index.css';

type AppWithAuthProps = AppProps & {
	pageProps: { session: Session };
};

const myTheme: MantineThemeOverride = {
	primaryColor: 'yellow',
};

const App = ({ Component, pageProps }: AppWithAuthProps) => {
	return (
		<SessionProvider session={pageProps.session}>
			<MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
				<RouterTransition />
				<Head>
					<meta
						name="viewport"
						content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
					/>
				</Head>
				<Component {...pageProps} />
			</MantineProvider>
		</SessionProvider>
	);
};

export default App;
