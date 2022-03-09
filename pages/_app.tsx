import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CustomThemeProvider } from "../providers/CustomThemeProvider";
import { SnackBarProvider } from "../providers/SnackbarProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CustomThemeProvider>
      <SnackBarProvider>
        <Component {...pageProps} />
      </SnackBarProvider>
    </CustomThemeProvider>
  );
}

export default MyApp;
