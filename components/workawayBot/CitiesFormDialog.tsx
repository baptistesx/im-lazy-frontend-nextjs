import {
	Button,
	Dialog,
	DialogActions,
	FormControlLabel,
	Radio,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import RadioGroup from "@mui/material/RadioGroup";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";

type CitiesFormDialogProps = {
	keepMounted: boolean;
	open: boolean;
	onClose: (city: string | undefined) => Promise<void>;
	value: string | undefined;
	cities: string[] | undefined;
};

const CitiesFormDialog = (props: CitiesFormDialogProps): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const { onClose, value: valueProp, open, cities, ...other } = props;

	const [value, setValue] = useState<string | undefined>(valueProp);

	const radioGroupRef = useRef<unknown>(null);

	useEffect(() => {
		if (!open) {
			setValue(valueProp);
		}
	}, [valueProp, open]);

	const handleSubmit = (): void => {
		onClose(value);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setValue(event.target.value);
	};

	return (
		<Dialog
			sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
			maxWidth="xs"
			open={open}
			{...other}
		>
			<DialogTitle>{t.workawayBot["full-city-name"]}</DialogTitle>

			<DialogContent dividers>
				<RadioGroup
					ref={radioGroupRef}
					aria-label="city"
					name="city"
					value={value}
					onChange={handleChange}
				>
					{cities?.map((option) => (
						<FormControlLabel
							value={option}
							key={option}
							control={<Radio />}
							label={option}
						/>
					))}
				</RadioGroup>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleSubmit}>Ok</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CitiesFormDialog;
