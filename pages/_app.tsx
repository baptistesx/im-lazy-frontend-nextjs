import { AuthActionsProvider } from "@providers/AuthActionsProvider";
import { AuthProvider } from "@providers/AuthProvider";
import { CustomThemeProvider } from "@providers/CustomThemeProvider";
import { SnackBarProvider } from "@providers/SnackbarProvider";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { CookiesProvider } from "react-cookie";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
	return (
		<CookiesProvider>
			<CustomThemeProvider>
				<SnackBarProvider>
					<AuthProvider>
						<AuthActionsProvider>
							<Component {...pageProps} />
						</AuthActionsProvider>
					</AuthProvider>
				</SnackBarProvider>
			</CustomThemeProvider>
		</CookiesProvider>
	);
};

export default MyApp;
