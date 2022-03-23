import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
	Card,
	CardActions,
	CardContent,
	Checkbox,
	FormControlLabel,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbars } from "@providers/SnackbarProvider";
import infoFormSchema from "@schemas/infoFormSchema";
import { startBot, stopBot } from "@services/workawayBotApi";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface InfoSubmitFormData {
	developmentMode: boolean;
	headless: boolean;
	email: string;
	password: string;
	city: string;
	detectionRadius: number;
	minimumAge: number;
	maximumAge: number;
	messageSubject: number;
	frenchMessage: number;
	englishMessage: number;
}

const InfoForm = (): ReactElement => {
	const [isStarting, setIsStarting] = useState<boolean>(false);
	const [isStopping, setIsStopping] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	const snackbarsService = useSnackbars();

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<InfoSubmitFormData>({
		resolver: yupResolver(infoFormSchema),
	});

	useEffect(() => {
		const subscription = watch(() => {});
		return () => subscription.unsubscribe();
	}, [watch]);

	const handleStartBot = async (data: InfoSubmitFormData): Promise<void> => {
		if (process.env.NODE_ENV === "production") {
			data = { ...data, headless: true, developmentMode: false };
		} else {
			data = { ...data, developmentMode: data.developmentMode === true };
		}

		setIsStarting(true);

		await startBot(
			{
				...data,
			},
			(res) => {
				if (res.status === 200) {
					setIsRunning(true);
				}

				setIsStarting(false);
			}
		).catch(() => {
			snackbarsService?.addAlert({
				message:
					"An error occurred while starting bot, are you a premium member?",
				severity: "error",
			});
		});
	};

	const handleStopBot = async (): Promise<void> => {
		setIsStopping(true);

		await stopBot((res) => {
			if (res.status === 200) {
				setIsRunning(false);
			}

			setIsStopping(false);
		}).catch(() => {
			snackbarsService?.addAlert({
				message:
					"An error occurred while stopping bot, are you a premium member?",
				severity: "error",
			});
		});
	};

	return (
		<Card
			component="form"
			onSubmit={handleSubmit(handleStartBot)}
			sx={{ width: "45%", minWidth: "320px", m: 1, p: 1 }}
		>
			<CardContent>
				<Typography variant="h2">Info</Typography>
				{process.env.NODE_ENV === "development" ? (
					<>
						<FormControlLabel
							control={<Checkbox defaultChecked />}
							label="Dev mode (don't send messages)"
							{...register("developmentMode")}
							sx={{ m: 1 }}
							value
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="Headless"
							{...register("headless")}
							sx={{ m: 1 }}
						/>
					</>
				) : (
					<Box />
				)}
				<TextField
					fullWidth
					placeholder="Email"
					{...register("email")}
					sx={{ m: 1 }}
					error={errors.email != null}
					helperText={errors.email?.message}
				/>
				<TextField
					fullWidth
					type={"password"}
					placeholder="Password"
					{...register("password")}
					sx={{ m: 1 }}
					error={errors.password != null}
					helperText={errors.password?.message}
				/>
				<TextField
					fullWidth
					placeholder="City"
					{...register("city")}
					sx={{ m: 1 }}
					error={errors.city != null}
					helperText={errors.city?.message}
				/>
				{/* //TODO: add register to fit in infoFormSchema */}
				<Controller
					name="detectionRadius"
					control={control}
					rules={{ required: "Detection radius needed" }}
					render={({ field: { onChange, value } }): ReactElement => (
						<TextField
							fullWidth
							select
							label="Detection radius"
							value={value}
							onChange={onChange}
							sx={{ m: 1 }}
						>
							{[5, 10, 20, 50, 100, 250, 500].map((distance) => (
								<MenuItem key={distance} value={distance}>
									{distance} km
								</MenuItem>
							))}
						</TextField>
					)}
				/>
				<Box sx={{ minWidth: 180 }}>
					<TextField
						fullWidth
						id="minimimAge"
						label="Minimum age"
						type="number"
						InputLabelProps={{
							shrink: true,
						}}
						sx={{ m: 1 }}
						{...register("minimumAge")}
						defaultValue="20"
						error={errors.minimumAge != null}
						helperText={errors.minimumAge?.message}
					/>

					<TextField
						fullWidth
						id="maximumAge"
						label="Maximum age"
						type="number"
						InputLabelProps={{
							shrink: true,
						}}
						sx={{ m: 1 }}
						{...register("maximumAge")}
						defaultValue="30"
						error={errors.maximumAge != null}
						helperText={errors.maximumAge?.message}
					/>
				</Box>

				<TextField
					fullWidth
					id="outlined-required"
					label="Message subject"
					defaultValue="Let's meet!"
					sx={{ m: 1 }}
					{...register("messageSubject")}
					error={errors.messageSubject != null}
					helperText={errors.messageSubject?.message}
				/>
				<TextField
					fullWidth
					id="outlined-required"
					label="English message"
					defaultValue="Hey! I'm in the area until next week, let's meet?!"
					multiline
					rows={4}
					sx={{ m: 1 }}
					{...register("englishMessage")}
					error={errors.englishMessage != null}
					helperText={errors.englishMessage?.message}
				/>

				<TextField
					fullWidth
					id="outlined-required"
					label="French message"
					defaultValue="Saluut! Je suis dans le coin jusqu'à la semaine prochaine, t'es chaud de faire un tour en ville?!"
					multiline
					rows={4}
					sx={{ m: 1 }}
					{...register("frenchMessage")}
					error={errors.frenchMessage != null}
					helperText={errors.frenchMessage?.message}
				/>
			</CardContent>

			<CardActions>
				<LoadingButton
					type="submit"
					variant="contained"
					loading={isStarting}
					sx={{
						m: 1,
					}}
					disabled={isRunning}
				>
					Start the bot !
				</LoadingButton>

				<LoadingButton
					variant="contained"
					loading={isStopping}
					sx={{
						m: 1,
					}}
					disabled={!isRunning}
					onClick={handleStopBot}
				>
					Stop the bot !
				</LoadingButton>
			</CardActions>
		</Card>
	);
};

export default InfoForm;
