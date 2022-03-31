import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Card,
	CardActions,
	CardContent,
	Checkbox,
	FormControlLabel,
	IconButton,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import infoFormSchema from "@schemas/infoFormSchema";
import { startBot, stopBot } from "@services/workawayBotApi";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormBotParams } from "./workaway.d";

const InfoForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();

	const [isStarting, setIsStarting] = useState<boolean>(false);
	const [isStopping, setIsStopping] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const snackbarsService = useSnackbars();

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<FormBotParams>({
		resolver: yupResolver(infoFormSchema),
	});

	useEffect(() => {
		const subscription = watch(() => {});
		return () => subscription.unsubscribe();
	}, [watch]);

	const handleStartBot = async (data: FormBotParams): Promise<void> => {
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
			(status) => {
				if (status === 200) {
					setIsRunning(true);
				}

				setIsStarting(false);
			}
		).catch((err) => {
			setIsStarting(false);

			if (err.response.status === 401) {
				snackbarsService?.addSnackbar({
					message: t.auth["sign-in-again"],
					severity: "error",
				});
				authActions.logout();
			} else {
				snackbarsService?.addSnackbar({
					message: t.workawayBot["error-starting-bot"],
					severity: "error",
				});
			}
		});
	};

	const handleStopBot = async (): Promise<void> => {
		setIsStopping(true);

		await stopBot((status) => {
			if (status === 200) {
				setIsRunning(false);
			}

			setIsStopping(false);
		}).catch((err) => {
			if (err.response.status === 401) {
				snackbarsService?.addSnackbar({
					message: t.auth["sign-in-again"],
					severity: "error",
				});
				authActions.logout();
			} else {
				snackbarsService?.addSnackbar({
					message: t.workawayBot["error-stopping-bot"],
					severity: "error",
				});
			}
		});
	};

	const handleClickShowPassword = (): void => {
		setShowPassword(!showPassword);
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
					label={t.common.email}
					{...register("email")}
					sx={{ m: 1 }}
					error={errors.email != null}
					helperText={errors.email?.message}
				/>
				<TextField
					fullWidth
					type={showPassword ? "text" : "password"}
					label={t.common.password}
					InputProps={{
						endAdornment: (
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								edge="end"
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						),
					}}
					{...register("password")}
					sx={{ m: 1 }}
					error={errors.password != null}
					helperText={errors.password?.message}
				/>
				<TextField
					fullWidth
					label={t.workawayBot.city}
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
						label={t.workawayBot["minimum-age"]}
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
						label={t.workawayBot["maximum-age"]}
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
					label={t.workawayBot["message-subject"]}
					defaultValue="Let's meet!"
					sx={{ m: 1 }}
					{...register("messageSubject")}
					error={errors.messageSubject != null}
					helperText={errors.messageSubject?.message}
				/>
				<TextField
					fullWidth
					id="outlined-required"
					label={t.workawayBot["english-message"]}
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
					label={t.workawayBot["french-message"]}
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
					{t.workawayBot["start-bot"]}
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
					{t.workawayBot["stop-bot"]}
				</LoadingButton>
			</CardActions>
		</Card>
	);
};

export default InfoForm;
