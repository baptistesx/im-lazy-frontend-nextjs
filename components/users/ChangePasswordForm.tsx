import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, TextField } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import updatePasswordFormSchema from "@schemas/updatePasswordFormSchema";
import { updateUserPasswordById } from "@services/userApi";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import GetLicenceButton from "./GetLicenceButton";

type ChangePasswordFormData = {
	currentPassword: string;
	newPassword: string;
};

const ChangePasswordForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const auth = useAuth();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const snackbarsService = useSnackbars();

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

					snackbarsService?.addSnackbar({
						message: t.profile["password-well-updated"],
						severity: "success",
					});

					reset();
				}
			).catch(() => {
				setIsLoading(false);

				snackbarsService?.addSnackbar({
					message: t.profile["error-updating-password"],
					severity: "error",
				});
				reset(data);
			});
		}
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
					placeholder={t.profile["current-password"]}
					{...register("currentPassword")}
					sx={{ mb: 1 }}
					error={errors.currentPassword != null}
					helperText={errors.currentPassword?.message}
				/>

				<TextField
					fullWidth
					placeholder={t.profile["new-password"]}
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

				{!auth?.isPremium(auth?.value.user) ? <GetLicenceButton /> : <Box />}
			</CardActions>
		</Card>
	);
};

export default ChangePasswordForm;
