import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, TextField } from "@mui/material";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useAuth } from "@providers/AuthProvider";
import editProfileFormSchema from "@schemas/editProfileFormSchema";
import { updateUserById } from "@services/userApi";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import GetLicenceButton from "./GetLicenceButton";

type ProfileFormData = {
	email: string;
	name: string;
};

const ProfileForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const auth = useAuth();
	const authActions = useAuthActions();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

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
					enqueueSnackbar(t.profile["user-well-updated"], {
						variant: "success",
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
					enqueueSnackbar(t.auth["sign-in-again"], {
						variant: "error",
					});

					authActions.logout();
				} else {
					enqueueSnackbar(t.profile["error-updating-profile"], {
						variant: "error",
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
