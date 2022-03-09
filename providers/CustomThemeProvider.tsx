import { blue, green } from "@mui/material/colors";
import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import React from "react";
import { Theme as MuiTheme } from "@mui/material/styles";

declare module "@emotion/react" {
  export interface Theme extends MuiTheme {}
}

export const CustomThemeProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: blue[900],
      },
      secondary: {
        main: green[500],
      },
      success: {
        main: green[500],
      }
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
