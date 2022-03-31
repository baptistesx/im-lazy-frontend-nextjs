import { AuthActionsProvider } from "@providers/AuthActionsProvider";
import { AuthProvider } from "@providers/AuthProvider";
import { CustomThemeProvider } from "@providers/CustomThemeProvider";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";
import { CookiesProvider } from "react-cookie";
import { Offline, Online } from "react-detect-offline";
import NotSignedInLayout from "../components/layout/NotSignInedLayout";
import "../styles/globals.css";
const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<CookiesProvider>
			<CustomThemeProvider>
				<SnackbarProvider maxSnack={3}>
					<AuthProvider>
						<AuthActionsProvider>
							<Online>
								<Component {...pageProps} />
							</Online>

							<Offline>
								<NotSignedInLayout
									isOffline
									title={t.common["no-internet-connection"]}
								>
									<Component {...pageProps} />
								</NotSignedInLayout>
							</Offline>
						</AuthActionsProvider>
					</AuthProvider>
				</SnackbarProvider>
			</CustomThemeProvider>
		</CookiesProvider>
	);
};

export default MyApp;
