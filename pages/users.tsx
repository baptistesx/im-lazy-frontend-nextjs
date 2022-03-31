import AdminRoute from "@components/routes/AdminRoute";
import EditUserDialog from "@components/users/EditUserDialog";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useAuth } from "@providers/AuthProvider";
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

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [users, setUsers] = useState<User[] | undefined>(undefined);

	const [isEditUserDialogOpen, setIsEditUserDialogOpen] =
		useState<boolean>(false);

	const [userSelected, setUserSelected] = useState<User | undefined>(undefined);

	const auth = useAuth();
	const authActions = useAuthActions();

	const currentUser = auth?.value.user;

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

	const onRefreshClick = (): void => {
		fetchData();
	};

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

							{users?.length === 0 ? (
								<Typography>{t.users["no-users"]}</Typography>
							) : (
								//TODO: refactor (extract component)
								<TableContainer component={Paper}>
									<Table aria-label="users table">
										<TableHead>
											<TableRow>
												<TableCell align="left">{t.common.name}</TableCell>
												<TableCell align="left">{t.common.email}</TableCell>
												<TableCell align="left">{t.users.admin}</TableCell>
												<TableCell align="left">{t.users.premium}</TableCell>
												<TableCell align="left">
													{t.users["email-verified"]}
												</TableCell>
												<TableCell align="left">{t.common.actions}</TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											{users?.map((user) => (
												<TableRow key={user?.id}>
													<TableCell component="th" scope="row">
														{user?.name}
													</TableCell>
													<TableCell component="th" scope="row">
														{user?.email}
													</TableCell>
													<TableCell align="center" component="th" scope="row">
														{auth?.isAdmin(user) ? (
															<CheckIcon />
														) : (
															<ClearIcon />
														)}
													</TableCell>
													<TableCell align="center" component="th" scope="row">
														{auth?.isPremium(user) ? (
															<CheckIcon />
														) : (
															<ClearIcon />
														)}
													</TableCell>
													<TableCell align="center" component="th" scope="row">
														{user?.isEmailVerified ? (
															<CheckIcon />
														) : (
															<ClearIcon />
														)}
													</TableCell>
													<TableCell align="left">
														<Tooltip title={t.users["edit-user"]}>
															<IconButton
																onClick={(): void => handleOpenUserDialog(user)}
																disabled={isLoading}
															>
																<EditIcon />
															</IconButton>
														</Tooltip>

														<Tooltip title={t.users["delete-user"]}>
															<IconButton
																aria-label="delete"
																onClick={(): Promise<void> =>
																	handleDelete(user.id)
																}
																disabled={
																	user.email === currentUser?.email || isLoading
																}
															>
																<DeleteIcon />
															</IconButton>
														</Tooltip>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
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
				<Box></Box>
			)}
		</AdminRoute>
	);
};

export default Users;
