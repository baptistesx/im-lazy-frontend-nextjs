import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
	Button,
	Dialog,
	DialogActions,
	MenuItem,
	TextField,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import { User } from "@providers/user.d";
import editUserFormSchema from "@schemas/editUserFormSchema";
import { createUser, updateUserById } from "@services/userApi";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EditUserDialogFormData, EditUserDialogProps } from "./users.d";

const EditUserDialog = (props: EditUserDialogProps): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const { onClose, open, user, ...other } = props;

	const auth = useAuth();

	const snackbarsService = useSnackbars();

	const [currentUser, setUser] = useState<User | undefined>(user);

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { isDirty, errors },
		reset,
	} = useForm<EditUserDialogFormData>({
		resolver: yupResolver(editUserFormSchema),
	});

	useEffect(() => {
		const subscription = watch(() => {});
		return () => subscription.unsubscribe();
	}, [watch]);

	useEffect(() => {
		if (!open) {
			setUser(user);
		}
	}, [user, open]);

	const onSubmit = async (data: EditUserDialogFormData): Promise<void> => {
		setIsSaving(true);

		// If updating user
		if (currentUser?.id) {
			updateUserById(
				{
					id: currentUser.id,
					email: data.email,
					role: data.role,
					name: data.name,
				},
				() => {
					setIsSaving(false);

					onClose({ modified: true });

					snackbarsService?.addSnackbar({
						message: t.profile["user-well-updated"],
						severity: "success",
					});

					if (currentUser?.id === auth?.value.user?.id) {
						auth.setValue({
							user: {
								...auth.value.user,
								email: data.email,
								name: data.name,
							},
							status: "connected",
						});
					}

					reset(data);
				}
			).catch(() => {
				setIsSaving(false);

				snackbarsService?.addSnackbar({
					message: t.profile["error-updating-profile"],
					severity: "error",
				});
			});
		} else {
			// If creating user
			createUser(
				{
					email: data.email,
					role: data.role,
					name: data.name,
				},
				() => {
					setIsSaving(false);

					onClose({ modified: true });

					snackbarsService?.addSnackbar({
						message: t.profile["user-well-created"],
						severity: "success",
					});

					reset(data);
				}
			).catch(() => {
				setIsSaving(false);

				snackbarsService?.addSnackbar({
					message: t.auth["error-creating-user"],
					severity: "error",
				});
			});
		}
	};

	return (
		<Dialog
			open={open}
			{...other}
			onClose={(): Promise<void> => onClose({ modified: false })}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>
					{currentUser?.id !== undefined ? t.common.edit : t.common.create}{" "}
					{t.common.user}
				</DialogTitle>

				<DialogContent>
					<TextField
						fullWidth
						label={t.common.name}
						{...register("name")}
						sx={{ mb: 1, mt: 1, textTransform: "capitalize" }}
						defaultValue={currentUser?.name}
						error={errors.name != null}
						helperText={errors.name?.message}
					/>

					<TextField
						fullWidth
						label={t.common.email}
						{...register("email")}
						sx={{ mb: 1, mt: 1 }}
						defaultValue={currentUser?.email}
						error={errors.email != null}
						helperText={errors.email?.message}
					/>

					{/* //TODO: add register to fit in EditUserFormSchema */}
					<Controller
						name="role"
						control={control}
						rules={{ required: t.profile["role-needed"] }}
						render={({ field: { onChange, value } }): ReactElement => (
							<TextField
								fullWidth
								select
								label={t.common.role}
								value={value}
								onChange={onChange}
								sx={{ mt: 1 }}
								defaultValue={currentUser?.role}
								disabled={currentUser?.id === auth?.value.user?.id}
							>
								{["admin", "premium", "classic"].map((role) => (
									<MenuItem
										key={role}
										value={role}
										sx={{ textTransform: "capitalize" }}
									>
										{role}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
				</DialogContent>

				<DialogActions>
					<Button onClick={(): Promise<void> => onClose({ modified: false })}>
						{t.common.cancel}
					</Button>

					<LoadingButton
						type="submit"
						variant="contained"
						disabled={!isDirty}
						loading={isSaving}
						sx={{
							m: 1,
						}}
					>
						{t.common.save}
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditUserDialog;
