import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
} from "@mui/material";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useAuth } from "@providers/AuthProvider";
import updatePasswordFormSchema from "@schemas/updatePasswordFormSchema";
import { updateUserPasswordById } from "@services/userApi";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";

type ChangePasswordFormData = {
	currentPassword: string;
	newPassword: string;
};

const ChangePasswordForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const auth = useAuth();
	const authActions = useAuthActions();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showPasswordNew, setShowPasswordNew] = useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

	const {
		register,
		handleSubmit,
		formState: { isDirty, errors },
		reset,
	} = useForm<ChangePasswordFormData>({
		resolver: yupResolver(updatePasswordFormSchema),
	});

	const handleSavePassword = async (
		data: ChangePasswordFormData
	): Promise<void> => {
		if (auth?.value.user !== undefined) {
			setIsLoading(true);

			updateUserPasswordById(
				{
					id: auth?.value.user?.id,
					currentPassword: data.currentPassword,
					newPassword: data.newPassword,
				},
				() => {
					setIsLoading(false);

					enqueueSnackbar(t.profile["password-well-updated"], {
						variant: "success",
					});

					reset();
				}
			).catch((err) => {
				setIsLoading(false);

				if (err?.response?.status === 401) {
					enqueueSnackbar(t.auth["sign-in-again"], {
						variant: "error",
					});

					authActions.logout();
				} else {
					enqueueSnackbar(t.profile["error-updating-password"], {
						variant: "error",
					});
				}

				reset(data);
			});
		}
	};

	const handleClickShowPassword = (): void => {
		setShowPassword(!showPassword);
	};

	const handleClickShowPasswordNew = (): void => {
		setShowPasswordNew(!showPasswordNew);
	};

	return (
		<Card
			component="form"
			variant="outlined"
			onSubmit={handleSubmit(handleSavePassword)}
		>
			<CardContent>
				<TextField
					fullWidth
					type={showPassword ? "text" : "password"}
					label={t.profile["current-password"]}
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
					{...register("currentPassword")}
					sx={{ mb: 1 }}
					error={errors.currentPassword != null}
					helperText={errors.currentPassword?.message}
				/>

				<TextField
					fullWidth
					type={showPasswordNew ? "text" : "password"}
					label={t.profile["new-password"]}
					InputProps={{
						endAdornment: (
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPasswordNew}
								edge="end"
							>
								{showPasswordNew ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						),
					}}
					{...register("newPassword")}
					sx={{ mb: 1 }}
					error={errors.newPassword != null}
					helperText={errors.newPassword?.message}
				/>
			</CardContent>

			<CardActions>
				<LoadingButton
					type="submit"
					variant="contained"
					disabled={!isDirty}
					loading={isLoading}
					sx={{
						m: 1,
					}}
				>
					{t.common.save}
				</LoadingButton>
			</CardActions>
		</Card>
	);
};

export default ChangePasswordForm;
