import { blue, green } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const lightTheme = responsiveFontSizes(
	createTheme({
		palette: {
			mode: "light",
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

export default lightTheme;
