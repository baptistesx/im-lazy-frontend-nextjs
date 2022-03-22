import { blue, green } from "@mui/material/colors";
import {
	createTheme,
	responsiveFontSizes,
	Theme as MuiTheme,
	ThemeProvider,
} from "@mui/material/styles";
import { ReactNode } from "react";

declare module "@emotion/react" {
	export interface Theme extends MuiTheme {}
}

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
	const theme = responsiveFontSizes(
		createTheme({
			palette: {
				primary: {
					main: blue[900],
				},
				secondary: {
					main: green[500],
				},
				success: {
					main: green[500],
				},
			},
		})
	);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
