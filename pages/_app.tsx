import { AuthActionsProvider } from "@providers/AuthActionsProvider";
import { AuthProvider } from "@providers/AuthProvider";
import { CustomThemeProvider } from "@providers/CustomThemeProvider";
import { SnackBarProvider } from "@providers/SnackbarProvider";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
	return (
		<CustomThemeProvider>
			<SnackBarProvider>
				<AuthProvider>
					<AuthActionsProvider>
						<Component {...pageProps} />
					</AuthActionsProvider>
				</AuthProvider>
			</SnackBarProvider>
		</CustomThemeProvider>
	);
};

export default appWithTranslation(MyApp);
