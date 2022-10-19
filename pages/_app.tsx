import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { RouterTransition } from 'components/router-transition';

type AppWithAuthProps = AppProps & {
	pageProps: { session: Session };
};

const App = ({ Component, pageProps }: AppWithAuthProps) => {
	return (
		<SessionProvider session={pageProps.session}>
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<RouterTransition />
				<Component {...pageProps} />
			</MantineProvider>
		</SessionProvider>
	);
};

export default App;
