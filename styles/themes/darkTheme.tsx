import { grey, red } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const darkTheme = responsiveFontSizes(
	createTheme({
		palette: {
			mode: "dark",
			primary: {
				main: grey[700],
			},
			secondary: {
				main: red[500],
			},
			success: {
				main: red[500],
			},
		},
	})
);

export default darkTheme;
