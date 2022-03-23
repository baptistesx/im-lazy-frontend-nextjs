import { AuthProvider } from "@providers/AuthProvider";
import { CustomThemeProvider } from "@providers/CustomThemeProvider";
import { SnackBarProvider } from "@providers/SnackbarProvider";
import type { AppProps } from "next/app";
import { ReactNode } from "react";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps): ReactNode => {
	return (
		<CustomThemeProvider>
			<SnackBarProvider>
				<AuthProvider>
					<Component {...pageProps} />
				</AuthProvider>
			</SnackBarProvider>
		</CustomThemeProvider>
	);
};

export default MyApp;
