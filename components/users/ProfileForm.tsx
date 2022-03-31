import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, TextField } from "@mui/material";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import editProfileFormSchema from "@schemas/editProfileFormSchema";
import { updateUserById } from "@services/userApi";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import GetLicenceButton from "./GetLicenceButton";
import { ProfileFormData } from "./users.d";

const ProfileForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const auth = useAuth();
	const authActions = useAuthActions();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const snackbarsService = useSnackbars();

	const {
		register,
		handleSubmit,
		formState: { isDirty, errors },
		reset,
	} = useForm<ProfileFormData>({
		resolver: yupResolver(editProfileFormSchema),
	});

	const handleSaveProfile = async (data: ProfileFormData): Promise<void> => {
		if (auth?.value.user !== undefined) {
			setIsLoading(true);

			updateUserById(
				{
					id: auth?.value.user?.id,
					email: data.email,
					name: data.name,
				},
				() => {
					setIsLoading(false);

					snackbarsService?.addSnackbar({
						message: t.profile["user-well-updated"],
						severity: "success",
					});

					if (auth.value.status === "connected") {
						auth.setValue({
							user: { ...auth.value.user, email: data.email, name: data.name },
							status: "connected",
						});
					}

					reset(data);
				}
			).catch((err) => {
				setIsLoading(false);

				if (err.response.status === 401) {
					snackbarsService?.addSnackbar({
						message: t.auth["sign-in-again"],
						severity: "error",
					});
					authActions.logout();
				} else {
					snackbarsService?.addSnackbar({
						message: t.profile["error-updating-profile"],
						severity: "error",
					});
				}

				reset(data);
			});
		}
	};

	return (
		<Card
			component="form"
			variant="outlined"
			onSubmit={handleSubmit(handleSaveProfile)}
		>
			<CardContent>
				<TextField
					fullWidth
					label={t.common.name}
					{...register("name")}
					sx={{ mb: 1, textTransform: "capitalize" }}
					defaultValue={auth?.value.user?.name}
					error={errors.name != null}
					helperText={errors.name?.message}
				/>

				<TextField
					fullWidth
					label={t.common.email}
					{...register("email")}
					sx={{ mb: 1 }}
					defaultValue={auth?.value.user?.email}
					error={errors.email != null}
					helperText={errors.email?.message}
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

				{!auth?.isPremium(auth?.value.user) ? <GetLicenceButton /> : <Box />}
			</CardActions>
		</Card>
	);
};

export default ProfileForm;
