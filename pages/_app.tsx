import { AuthActionsProvider } from "@providers/AuthActionsProvider";
import { AuthProvider } from "@providers/AuthProvider";
import { CustomThemeProvider } from "@providers/CustomThemeProvider";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import { ReactElement } from "react";
import { CookiesProvider } from "react-cookie";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
	return (
		<CookiesProvider>
			<CustomThemeProvider>
				<SnackbarProvider maxSnack={3}>
					<AuthProvider>
						<AuthActionsProvider>
							<Component {...pageProps} />
						</AuthActionsProvider>
					</AuthProvider>
				</SnackbarProvider>
			</CustomThemeProvider>
		</CookiesProvider>
	);
};

export default MyApp;
