import { blue, green } from "@mui/material/colors";
import {
	createTheme,
	responsiveFontSizes,
	ThemeProvider,
} from "@mui/material/styles";
import { ReactElement, ReactNode } from "react";

export const CustomThemeProvider = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
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
