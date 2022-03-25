import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, TextField } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import editProfileFormSchema from "@schemas/editProfileFormSchema";
import { updateUserById } from "@services/userApi";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthActions } from "../../providers/AuthActionsProvider";
import GetLicenceButton from "./GetLicenceButton";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type ProfileFormData = {
	email: string;
	name: string;
};

const ProfileForm = (): ReactElement => {
	const { t } = useTranslation("profile");

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
						message: t("user-well-updated"),
						severity: "success",
					});

					authActions?.fetchCurrentUser();

					reset(data);
				}
			).catch(() => {
				snackbarsService?.addSnackbar({
					message: t("error-updating-profile"),
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
			onSubmit={handleSubmit(handleSaveProfile)}
		>
			<CardContent>
				<TextField
					fullWidth
					placeholder={t("name")}
					{...register("name")}
					sx={{ mb: 1, textTransform: "capitalize" }}
					defaultValue={auth?.value.user?.name}
					error={errors.name != null}
					helperText={errors.name?.message}
				/>

				<TextField
					fullWidth
					placeholder={t("email")}
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

export default ProfileForm;
