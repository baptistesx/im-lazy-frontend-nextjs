import { Box, Button, Menu, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Flags from "country-flag-icons/react/3x2";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { MouseEvent, ReactElement, useState } from "react";

const LanguageMenu = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const languages = [
		{
			name: t.settings.french,
			locale: "fr",
			flag: <Flags.FR title="France" />,
		},
		{
			name: t.settings.english,
			locale: "en",
			flag: <Flags.US title="United States" />,
		},
	];

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: MouseEvent<HTMLElement>): void => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (): void => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ maxWidth: 200 }}>
			<Button
				id="demo-positioned-button"
				aria-controls={open ? "demo-positioned-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				Language
			</Button>

			<Menu
				id="language-menu"
				aria-labelledby="language-menu-button"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				{languages.map((language) => (
					<MenuItem
						value={language.locale}
						key={language.locale}
						onClick={handleClose}
					>
						<Link passHref href="/settings" locale={language.locale}>
							<Box sx={{ display: "flex", gap: 6 }}>
								<Typography>{language.name}</Typography>

								<Box sx={{ width: 30, display: "flex" }}>{language.flag}</Box>
							</Box>
						</Link>
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
};

export default LanguageMenu;
