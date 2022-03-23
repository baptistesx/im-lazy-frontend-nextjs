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
import { Role, useAuth, User } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import editUserFormSchema from "@schemas/editUserFormSchema";
import { createUser, updateUserById } from "@services/userApi";
import PropTypes from "prop-types";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface EditUserDialogFormData {
	name: string;
	role: Role;
	email: string;
	password: string;
}

interface EditUserDialogProps {
	keepMounted: boolean;
	open: boolean;
	onClose: ({ modified }: { modified: boolean }) => Promise<void>;
	user?: User | null;
}

const EditUserDialog = (props: EditUserDialogProps): ReactElement => {
	const { onClose, open, user, ...other } = props;

	const auth = useAuth();

	const snackbarsService = useSnackbars();

	const [currentUser, setUser] = useState(user);

	// const radioGroupRef = useRef(null);

	const [isSaving, setIsSaving] = useState(false);

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

	const handleEntering = (): void => {
		// if (radioGroupRef.current != null) {
		//   radioGroupRef.current.focus();
		// }
	};

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

					snackbarsService?.addAlert({
						message: "User well updated",
						severity: "success",
					});

					if (currentUser?.id === auth?.user?.id) {
						auth.fetchCurrentUser();
					}

					reset(data);
				}
			).catch(() => {
				setIsSaving(false);

				snackbarsService?.addAlert({
					message: "An error occurred while updating user",
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

					snackbarsService?.addAlert({
						message: "User well created",
						severity: "success",
					});

					reset(data);
				}
			).catch(() => {
				setIsSaving(false);

				snackbarsService?.addAlert({
					message:
						"An error occurred while creating user, email might be already used.",
					severity: "error",
				});
			});
		}
	};

	return (
		<Dialog
			TransitionProps={{ onEntering: handleEntering }}
			open={open}
			{...other}
			onClose={(): Promise<void> => onClose({ modified: false })}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>{currentUser?.id ? "Edit" : "Create"} user</DialogTitle>

				<DialogContent>
					<TextField
						fullWidth
						placeholder="Name"
						{...register("name")}
						sx={{ mb: 1, textTransform: "capitalize" }}
						defaultValue={currentUser?.name}
						error={errors.name != null}
						helperText={errors.name?.message}
					/>

					<TextField
						fullWidth
						placeholder="Email"
						{...register("email")}
						sx={{ mb: 1 }}
						defaultValue={currentUser?.email}
						error={errors.email != null}
						helperText={errors.email?.message}
					/>

					{/* //TODO: add register to fit in EditUserFormSchema */}
					<Controller
						name="role"
						control={control}
						rules={{ required: "Role needed" }}
						render={({ field: { onChange, value } }): ReactElement => (
							<TextField
								fullWidth
								select
								label="Role"
								value={value}
								onChange={onChange}
								defaultValue={currentUser?.role}
								disabled={currentUser?.id === auth?.user?.id}
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
						Cancel
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
						Save
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditUserDialog;

EditUserDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	user: PropTypes.object,
};
