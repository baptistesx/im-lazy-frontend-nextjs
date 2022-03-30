import {
	Box,
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Flags from "country-flag-icons/react/3x2";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useState } from "react";

const LanguageMenu = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const [language, setLanguage] = useState(locale);

	const handleChange = (event: SelectChangeEvent): void => {
		setLanguage(event.target.value as string);
	};

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

	return (
		<Box sx={{ maxWidth: 200 }}>
			<FormControl fullWidth>
				<InputLabel id="language-select-label">Language</InputLabel>

				<Select
					labelId="language-select-label"
					id="language-select"
					value={language}
					label="Language"
					onChange={handleChange}
				>
					{languages.map((language) => (
						<MenuItem
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								maxWidth: 200,
							}}
							value={language.locale}
							key={language.locale}
						>
							<Link passHref href="/settings" locale={language.locale}>
								<Box sx={{ display: "flex", justifyContent: "space-between" }}>
									<Typography>{language.name}</Typography>

									<Box sx={{ width: 30, display: "flex" }}>{language.flag}</Box>
								</Box>
							</Link>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};

export default LanguageMenu;
