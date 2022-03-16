import { blue, green } from "@mui/material/colors";
import {
  createTheme,
  responsiveFontSizes,
  Theme as MuiTheme,
  ThemeProvider,
} from "@mui/material/styles";

declare module "@emotion/react" {
  export interface Theme extends MuiTheme {}
}

export const CustomThemeProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  let theme = createTheme({
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
  });
  theme = responsiveFontSizes(theme);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
