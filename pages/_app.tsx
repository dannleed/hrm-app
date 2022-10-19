import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

type AppWithAuthProps = AppProps & {
	pageProps: { session: Session };
};

const App = ({ Component, pageProps }: AppWithAuthProps) => {
	return (
		<SessionProvider session={pageProps.session}>
			<Component {...pageProps} />
		</SessionProvider>
	);
};

export default App;
