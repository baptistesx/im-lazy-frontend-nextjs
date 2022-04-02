import { useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { ThemeActions } from "./theme.d";

const ThemeActionsContext = createContext({ toggleColorMode: () => {} });

export const CustomThemeProvider = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	const [mode, setMode] = useState<"light" | "dark" | undefined>(undefined);

	const colorMode = useMemo(
		() => ({
			toggleColorMode: (): void => {
				setMode((prevMode) => {
					localStorage.setItem(
						"theme",
						prevMode === "light" ? "dark" : "light"
					);

					return prevMode === "light" ? "dark" : "light";
				});
			},
		}),
		[]
	);

	useEffect(() => {
		if (prefersDarkMode || localStorage.getItem("theme") === "dark") {
			localStorage.setItem("theme", "dark");
			setMode("dark");
		} else {
			localStorage.setItem("theme", "light");
			setMode("light");
		}
	}, []);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);

	return (
		<ThemeActionsContext.Provider value={colorMode}>
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
