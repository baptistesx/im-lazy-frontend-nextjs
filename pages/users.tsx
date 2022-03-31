import AdminRoute from "@components/routes/AdminRoute";
import EditUserDialog from "@components/users/EditUserDialog";
import UsersTable from "@components/users/UsersTable";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Typography,
} from "@mui/material";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { User } from "@providers/user.d";
import { deleteUserById, getUsers } from "@services/userApi";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useCallback, useEffect, useState } from "react";

const Users = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const { enqueueSnackbar } = useSnackbar();

	const authActions = useAuthActions();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [users, setUsers] = useState<User[] | undefined>(undefined);

	const [isEditUserDialogOpen, setIsEditUserDialogOpen] =
		useState<boolean>(false);

	const [userSelected, setUserSelected] = useState<User | undefined>(undefined);

	const fetchData = useCallback(() => {
		setIsLoading(true);

		getUsers((users: User[]) => {
			setUsers([...users]);

			// Sort users on name property
			users.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

			setIsLoading(false);
		}).catch((err) => {
			setIsLoading(false);

			if (err.response.status === 401) {
				enqueueSnackbar(t.auth["sign-in-again"], {
					variant: "error",
				});
				authActions.logout();
			} else {
				enqueueSnackbar(t.users["error-getting-users"], {
					variant: "error",
				});
			}
		});
	}, []);

	useEffect(() => {
		fetchData();
	}, []);

	const handleDelete = async (userId: string): Promise<void> => {
		setIsLoading(true);

		deleteUserById(userId, () => {
			fetchData();

			setIsLoading(false);

			enqueueSnackbar(t.users["user-well-deleted"], {
				variant: "success",
			});
		}).catch((err) => {
			if (err.response.status === 401) {
				enqueueSnackbar(t.auth["sign-in-again"], {
					variant: "error",
				});
				authActions.logout();
			} else {
				enqueueSnackbar(t.users["error-deleting-user"], {
					variant: "error",
				});
			}
		});
	};

	const onRefreshClick = (): void => {
		fetchData();
	};

	const handleOpenUserDialog = (userToEdit?: User): void => {
		setUserSelected(userToEdit ?? undefined);

		setIsEditUserDialogOpen(true);
	};

	const handleCloseUserDialog = async (res: {
		modified: boolean;
	}): Promise<void> => {
		setIsEditUserDialogOpen(false);
		setUserSelected(undefined);

		if (res?.modified) {
			fetchData();
		}
	};

	return (
		<AdminRoute title={t.users.title}>
			{isLoading ? (
				<CircularProgress />
			) : users === undefined ? (
				<Typography>{t.users["no-users"]}</Typography>
			) : (
				<Card>
					<CardContent>
						<Box>
							<Typography variant="body1">
								{`${users?.length} ${t.common.users}`}
							</Typography>

							{users === undefined ? (
								<Typography>{t.users["no-users"]}</Typography>
							) : (
								<UsersTable
									users={users}
									isLoading={isLoading}
									handleOpenUserDialog={handleOpenUserDialog}
									handleDelete={handleDelete}
								/>
							)}
						</Box>
					</CardContent>

					<CardActions>
						<Button
							variant="contained"
							onClick={(): void => handleOpenUserDialog()}
						>
							{t.users["create-user"]}
						</Button>

						<LoadingButton
							loading={isLoading}
							onClick={onRefreshClick}
							sx={{
								m: 1,
							}}
						>
							{t.common.refresh}
						</LoadingButton>
					</CardActions>
				</Card>
			)}

			{(userSelected !== null && userSelected !== undefined) ||
			isEditUserDialogOpen ? (
				<EditUserDialog
					keepMounted
					open={isEditUserDialogOpen}
					onClose={handleCloseUserDialog}
					user={userSelected}
				/>
			) : (
				<Box />
			)}
		</AdminRoute>
	);
};

export default Users;
