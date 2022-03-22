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
import { useAuth, User } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import { deleteUserById, getUsers } from "@services/userApi";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

function Users() {
	const snackbarsService = useSnackbars();

	const router = useRouter();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [users, setUsers] = useState<User[]>([]);

	const [isEditUserDialogOpen, setIsEditUserDialogOpen] =
		useState<boolean>(false);

	const [userSelected, setUserSelected] = useState<User | null>();
	const auth = useAuth();

	const currentUser = auth?.user;

	const fetchData = useCallback(() => {
		setIsLoading(true);

		getUsers((users: User[]) => {
			setUsers([...users]);

			// Sort users on name property
			users.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

			setIsLoading(false);
		}).catch(() => {
			snackbarsService?.addAlert({
				message: "An error occurred while getting users",
				severity: "error",
			});
		});
	}, [snackbarsService]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const onRefreshClick = () => {
		fetchData();
	};

	const handleDelete = async (userId: string) => {
		setIsLoading(true);

		deleteUserById(userId, () => {
			fetchData();

			setIsLoading(false);

			snackbarsService?.addAlert({
				message: "User well deleted",
				severity: "success",
			});
		}).catch((err: Error) => {
			snackbarsService?.addAlert({
				message: "An error occurred while deleting user",
				severity: "error",
			});
		});
	};

	const handleOpenUserDialog = (userToEdit?: User) => {
		setUserSelected(userToEdit ?? null);

		setIsEditUserDialogOpen(true);
	};

	const handleCloseUserDialog = async (res: { modified: boolean }) => {
		setIsEditUserDialogOpen(false);
		setUserSelected(null);

		if (res?.modified) {
			fetchData();
		}
	};

	return (
		<AdminRoute>
			<Typography variant="h1">Users</Typography>

			<Card>
				<CardContent>
					{users.length === 0 && isLoading ? (
						<Box />
					) : (
						<Box>
							<Typography variant="body1">
								{`${users.length} Available users`}
							</Typography>

							{users.length === 0 ? (
								<Typography>No users</Typography>
							) : (
								//TODO: refactor (extract component)
								<TableContainer component={Paper}>
									<Table aria-label="users table">
										<TableHead>
											<TableRow>
												<TableCell align="left">Name</TableCell>
												<TableCell align="left">Email</TableCell>
												<TableCell align="left">Admin</TableCell>
												<TableCell align="left">Premium</TableCell>
												<TableCell align="left">Email verified</TableCell>
												<TableCell align="left">Actions</TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											{users.map((user) => (
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
														<Tooltip title="Edit user">
															<IconButton
																onClick={() => handleOpenUserDialog(user)}
																disabled={isLoading}
															>
																<EditIcon />
															</IconButton>
														</Tooltip>

														<Tooltip title="Delete user">
															<IconButton
																aria-label="delete"
																onClick={() => handleDelete(user.id)}
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
					)}
				</CardContent>

				<CardActions>
					<Button variant="contained" onClick={() => handleOpenUserDialog()}>
						Create a user
					</Button>

					<LoadingButton
						loading={isLoading}
						onClick={onRefreshClick}
						sx={{
							m: 1,
						}}
					>
						Refresh
					</LoadingButton>
				</CardActions>
			</Card>

			{userSelected || isEditUserDialogOpen ? (
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
}

export default Users;
