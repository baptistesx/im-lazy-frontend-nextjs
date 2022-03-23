import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, TextField } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import editProfileFormSchema from "@schemas/editProfileFormSchema";
import { updateUserById } from "@services/userApi";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import GetLicenceButton from "./GetLicenceButton";

type ProfileFormData = {
	email: string;
	name: string;
};

const ProfileForm = (): ReactElement => {
	const auth = useAuth();

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
		setIsLoading(true);

		updateUserById(
			{
				id: auth?.user?.id,
				email: data.email,
				role: auth?.user?.role, //TODO security issue => pass this param optional
				name: data.name,
			},
			() => {
				setIsLoading(false);

				snackbarsService?.addAlert({
					message: "User well updated",
					severity: "success",
				});

				auth?.fetchCurrentUser();

				reset(data);
			}
		).catch(() => {
			snackbarsService?.addAlert({
				message: "Error while updating profile.",
				severity: "error",
			});
			reset(data);
		});
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
					placeholder="Name"
					{...register("name")}
					sx={{ mb: 1, textTransform: "capitalize" }}
					defaultValue={auth?.user?.name}
					error={errors.name != null}
					helperText={errors.name?.message}
				/>

				<TextField
					fullWidth
					placeholder="Email"
					{...register("email")}
					sx={{ mb: 1 }}
					defaultValue={auth?.user?.email}
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
					Save
				</LoadingButton>

				{!auth?.isPremium(auth?.user) ? <GetLicenceButton /> : <Box />}
			</CardActions>
		</Card>
	);
};

export default ProfileForm;
