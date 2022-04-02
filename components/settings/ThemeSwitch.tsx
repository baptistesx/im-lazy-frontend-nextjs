import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/";
import { useThemeActions } from "@providers/CustomThemeProvider";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const ThemeSwitch = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const themeActions = useThemeActions();
	const theme = useTheme();

	return (
		<Box sx={{ m: 1 }}>
			{theme.palette.mode === "dark"
				? t.common["dark-mode"]
				: t.common["light-mode"]}
			<IconButton
				sx={{ ml: 1 }}
				onClick={themeActions.toggleColorMode}
				color="inherit"
			>
				{theme.palette.mode === "dark" ? (
					<Brightness7Icon />
				) : (
					<Brightness4Icon />
				)}
			</IconButton>
		</Box>
	);
};

export default ThemeSwitch;
