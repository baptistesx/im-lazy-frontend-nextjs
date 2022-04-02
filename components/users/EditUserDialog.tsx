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
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useAuth } from "@providers/AuthProvider";
import editUserFormSchema from "@schemas/editUserFormSchema";
import { createUser, updateUserById } from "@services/userApi";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Role = "admin" | "premium" | "classic";

export type User = {
	id: string;
	name: string;
	email: string;
	role: Role;
	isEmailVerified: boolean;
	lastLogin: Date;
};

type EditUserDialogFormData = {
	name: string;
	role: Role;
	email: string;
	password: string;
};

type EditUserDialogProps = {
	keepMounted: boolean;
	open: boolean;
	onClose: ({ modified }: { modified: boolean }) => Promise<void>;
	user?: User | undefined;
};

const EditUserDialog = (props: EditUserDialogProps): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const { onClose, open, user, ...other } = props;

	const auth = useAuth();
	const authActions = useAuthActions();

	const { enqueueSnackbar } = useSnackbar();

	const [currentUser, setUser] = useState<User | undefined>(user);

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		watch,
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

					enqueueSnackbar(t.profile["user-well-updated"], {
						variant: "success",
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
			).catch((err) => {
				setIsSaving(false);

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

					enqueueSnackbar(t.profile["user-well-created"], {
						variant: "success",
					});

					reset(data);
				}
			).catch((err) => {
				setIsSaving(false);

				if (err.response.status === 401) {
					enqueueSnackbar(t.auth["sign-in-again"], {
						variant: "error",
					});

					authActions.logout();
				} else {
					enqueueSnackbar(t.auth["error-creating-user"], {
						variant: "error",
					});
				}
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

					<TextField
						fullWidth
						select
						label={t.common.role}
						{...register("role")}
						sx={{ mt: 1 }}
						defaultValue={currentUser?.role}
						disabled={currentUser?.id === auth?.value.user?.id}
						error={errors.role != null}
						helperText={errors.role?.message}
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
