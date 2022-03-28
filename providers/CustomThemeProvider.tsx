import { useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";
import { useCookies } from "react-cookie";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

type ColorMode = {
	toggleColorMode: () => void;
};

export const CustomThemeProvider = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
	const [cookies, setCookie] = useCookies(["theme"]);
	console.log(cookies["theme"]);
	// It seems it doesn't work when mode is set automatically as system in browser
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	const [mode, setMode] = useState<"light" | "dark">(
		cookies["theme"] !== undefined
			? cookies["theme"]
			: prefersDarkMode
			? "dark"
			: "light"
	);
	const colorMode = useMemo<ColorMode>(
		() => ({
			toggleColorMode: (): void => {
				return setMode((prevMode) => {
					setCookie("theme", prevMode === "light" ? "dark" : "light", {
						expires: new Date(2030, 1, 1),
					});

					return prevMode === "light" ? "dark" : "light";
				});
			},
		}),
		[]
	);

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
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export const useColorMode = (): ColorMode => {
	const context = useContext(ColorModeContext);

	if (context === undefined) {
		throw new Error("useColorMode must be used withing a ThemeProvider");
	}

	return context;
};
