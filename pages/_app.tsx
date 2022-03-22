import { AuthProvider } from "@providers/AuthProvider";
import { CustomThemeProvider } from "@providers/CustomThemeProvider";
import { SnackBarProvider } from "@providers/SnackbarProvider";
import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CustomThemeProvider>
			<SnackBarProvider>
				<AuthProvider>
					<Component {...pageProps} />
				</AuthProvider>
			</SnackBarProvider>
		</CustomThemeProvider>
	);
}

export default MyApp;
