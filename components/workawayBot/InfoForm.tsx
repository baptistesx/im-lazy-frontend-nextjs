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
import infoFormSchema from "@schemas/infoFormSchema";
import { startBot, stopBot } from "@services/workawayBotApi";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { detectionRadiuses, FormBotParams } from "./workaway.d";

const InfoForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();

	const [isStarting, setIsStarting] = useState<boolean>(false);
	const [isStopping, setIsStopping] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

	const {
		register,
		handleSubmit,
		watch,
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
				enqueueSnackbar(t.auth["sign-in-again"], {
					variant: "error",
				});
				authActions.logout();
			} else {
				enqueueSnackbar(t.workawayBot["error-starting-bot"], {
					variant: "error",
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
				enqueueSnackbar(t.auth["sign-in-again"], {
					variant: "error",
				});
				authActions.logout();
			} else {
				enqueueSnackbar(t.workawayBot["error-stopping-bot"], {
					variant: "error",
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

				<TextField
					fullWidth
					select
					label={t.workawayBot["detection-radius"]}
					{...register("detectionRadius")}
					sx={{ m: 1 }}
					error={errors.detectionRadius != null}
					helperText={errors.detectionRadius?.message}
				>
					{detectionRadiuses.map((distance) => (
						<MenuItem key={distance} value={distance}>
							{distance} km
						</MenuItem>
					))}
				</TextField>

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
