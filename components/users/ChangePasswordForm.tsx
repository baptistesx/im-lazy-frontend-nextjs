import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, TextField } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import updatePasswordFormSchema from "@schemas/updatePasswordFormSchema";
import { updateUserPasswordById } from "@services/userApi";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import GetLicenceButton from "./GetLicenceButton";

type ChangePasswordFormData = {
	currentPassword: string;
	newPassword: string;
};

const ChangePasswordForm = (): ReactElement => {
	const { t } = useTranslation("profile");

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
						message: t("password-well-updated"),
						severity: "success",
					});

					reset();
				}
			).catch(() => {
				setIsLoading(false);

				snackbarsService?.addSnackbar({
					message: t("error-updating-password"),
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
					placeholder={t("current-password")}
					{...register("currentPassword")}
					sx={{ mb: 1 }}
					error={errors.currentPassword != null}
					helperText={errors.currentPassword?.message}
				/>

				<TextField
					fullWidth
					placeholder={t("new-password")}
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
					{t("save")}
				</LoadingButton>

				{!auth?.isPremium(auth?.value.user) ? <GetLicenceButton /> : <Box />}
			</CardActions>
		</Card>
	);
};

export const getStaticProps = async ({
	locale,
}: {
	locale: string;
}): Promise<{ props: unknown }> => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "profile"])),
		},
	};
};

export default ChangePasswordForm;
