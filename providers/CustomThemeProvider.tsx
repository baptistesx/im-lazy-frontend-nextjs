import { useMediaQuery } from "@mui/material";
import {
	createTheme,
	responsiveFontSizes,
	ThemeProvider,
} from "@mui/material/styles";
import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";
import { useCookies } from "react-cookie";
import { ThemeActions } from "./theme.d";

const ThemeActionsContext = createContext({ toggleThemeActions: () => {} });

const lightTheme = responsiveFontSizes(
	createTheme({
		palette: {
			mode: "light",
		},
	})
);
const darkTheme = responsiveFontSizes(
	createTheme({
		palette: {
			mode: "dark",
		},
	})
);

export const CustomThemeProvider = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
	const [cookies, setCookie] = useCookies(["theme"]);
	// It seems it doesn't work when mode is set automatically as system in browser
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	const [mode, setMode] = useState<"light" | "dark">(
		cookies["theme"] !== undefined
			? cookies["theme"]
			: prefersDarkMode
			? "dark"
			: "light"
	);

	const [theme, setTheme] = useState(mode === "light" ? lightTheme : darkTheme);

	const themeActions = useMemo<ThemeActions>(
		() => ({
			toggleThemeActions: (): void => {
				return setMode((prevMode) => {
					console.log("toogle", prevMode);
					setCookie("theme", prevMode === "light" ? "dark" : "light", {
						expires: new Date(2030, 1, 1),
						path: "/",
					});

					setTheme(prevMode === "light" ? darkTheme : lightTheme);

					return prevMode === "light" ? "dark" : "light";
				});
			},
		}),
		[setCookie]
	);

	return (
		<ThemeActionsContext.Provider value={themeActions}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeActionsContext.Provider>
	);
};

export const useThemeActions = (): ThemeActions => {
	const context = useContext(ThemeActionsContext);

	if (context === undefined) {
		throw new Error("useThemeActions must be used withing a ThemeProvider");
	}

	return context;
};
