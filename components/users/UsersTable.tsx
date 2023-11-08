import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useAuth } from "@providers/AuthProvider";
import { deleteUserById, getUsers } from "@services/userApi";
import { format } from "date-fns";
import { enUS as enFns, fr as frFns } from "date-fns/locale";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import {
	ChangeEvent,
	MouseEvent,
	ReactElement,
	useCallback,
	useEffect,
	useState,
} from "react";
import EditUserDialog, { Role, User } from "./EditUserDialog";

const createData = (
	id: string,
	name: string,
	email: string,
	role: Role,
	isEmailVerified: boolean,
	lastLogin: Date
): User => {
	return {
		id,
		name,
		email,
		role,
		isEmailVerified,
		lastLogin,
	};
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof User>(
	order: Order,
	orderBy: Key
): (a: User, b: User) => number {
	if (order === "desc") {
		return (a, b) => descendingComparator(a, b, orderBy);
	} else {
		return (a, b) => -descendingComparator(a, b, orderBy);
	}
}

type HeadCell = {
	disablePadding: boolean;
	id: keyof User | "actions";
	label: string;
	numeric: boolean;
};

type UsersTableProps = {
	// numSelected: number;
	onRequestSort: (event: MouseEvent<unknown>, property: keyof User) => void;
	// onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
	headCells: readonly HeadCell[];
};

function UsersTableHead(props: UsersTableProps): ReactElement {
	const { order, orderBy, headCells, onRequestSort } = props;

	const createSortHandler =
		(property: keyof User) => (event: MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						padding={headCell.disablePadding ? "none" : "normal"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						{headCell.id === "actions" ? (
							headCell.label
						) : (
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : "asc"}
								onClick={createSortHandler(headCell.id)}
							>
								{headCell.label}
							</TableSortLabel>
						)}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

type UsersTableToolbarProps = {
	handleDelete: (userId: string) => void;
	handleOpenUserDialog: () => void;
	handleRefresh: () => void;
};

const UsersTableToolbar = (props: UsersTableToolbarProps): ReactElement => {
	const { handleRefresh, handleOpenUserDialog } = props;
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
			}}
		>
			<Typography
				sx={{ flex: "1 1 100%" }}
				variant="h6"
				id="tableTitle"
				component="div"
			>
				Utilisateurs
			</Typography>

			<Tooltip title={t.common.refresh}>
				<IconButton onClick={handleRefresh}>
					<RefreshIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title={t.common.refresh}>
				<IconButton onClick={(): void => handleOpenUserDialog()}>
					<PersonAddAltIcon />
				</IconButton>
			</Tooltip>
		</Toolbar>
	);
};

export default function UsersTable(): ReactElement {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();
	const auth = useAuth();

	const [users, setUsers] = useState<User[] | undefined>(undefined);

	const { enqueueSnackbar } = useSnackbar();

	const handleRefresh = useCallback(async () => {
		getUsers((users: User[]) => {
			setUsers([...users]);

			// Sort users on name property
			users.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

			// setIsLoading(false);
		}).catch((err) => {
			// setIsLoading(false);

			if (err?.response?.status === 401) {
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
		handleRefresh();
	}, [handleRefresh]);

	const [order, setOrder] = useState<Order>("asc");
	const [orderBy, setOrderBy] = useState<keyof User>("name");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const rows =
		users?.map((user) =>
			createData(
				user.id,
				user.name,
				user.email,
				user.role,
				user.isEmailVerified,
				user.lastLogin
			)
		) ?? [];

	const headCells: readonly HeadCell[] = [
		{
			id: "name",
			numeric: false,
			disablePadding: true,
			label: "Name",
		},
		{
			id: "email",
			numeric: false,
			disablePadding: false,
			label: "Email",
		},
		{
			id: "role",
			numeric: false,
			disablePadding: false,
			label: "Role",
		},
		{
			id: "isEmailVerified",
			numeric: false,
			disablePadding: false,
			label: "Email verified",
		},
		{
			id: "lastLogin",
			numeric: false,
			disablePadding: false,
			label: "Last login",
		},
		{
			id: "actions",
			numeric: false,
			disablePadding: false,
			label: "Actions",
		},
	];

	const handleRequestSort = (
		_event: MouseEvent<unknown>,
		property: keyof User
	): void => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (_event: unknown, newPage: number): void => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: ChangeEvent<HTMLInputElement>
	): void => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const [isEditUserDialogOpen, setIsEditUserDialogOpen] =
		useState<boolean>(false);

	const [userSelected, setUserSelected] = useState<User | undefined>(undefined);

	const handleDelete = async (userId: string): Promise<void> => {
		// setIsLoading(true);

		deleteUserById(userId, () => {
			handleRefresh(); //TODO

			// setIsLoading(false);

			enqueueSnackbar(t.users["user-well-deleted"], {
				variant: "success",
			});
		}).catch((err) => {
			if (err?.response?.status === 401) {
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
	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
	const handleCloseUserDialog = async (res: {
		modified: boolean;
	}): Promise<void> => {
		setIsEditUserDialogOpen(false);
		setUserSelected(undefined);

		if (res?.modified) {
			handleRefresh();
		}
	};
	return (
		<Card>
			<CardContent>
				<UsersTableToolbar
					handleDelete={handleDelete}
					handleOpenUserDialog={handleOpenUserDialog}
					handleRefresh={handleRefresh}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
						<UsersTableHead
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={rows?.length ?? 0}
							headCells={headCells}
						/>
						<TableBody>
							{rows
								?.slice()
								.sort(getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									// const isItemSelected = isSelected(row.id);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											// onClick={(event): void => handleClick(event, row.id)}
											role="checkbox"
											// aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.id}
											// selected={isItemSelected}
										>
											<TableCell
												component="th"
												id={labelId}
												scope="row"
												padding="none"
											>
												{row.name}
											</TableCell>
											<TableCell>{row.email}</TableCell>
											<TableCell>{row.role}</TableCell>
											<TableCell>
												{row.isEmailVerified ? <CheckIcon /> : <ClearIcon />}
											</TableCell>

											<TableCell>
												{row.lastLogin === null
													? ""
													: format(new Date(row.lastLogin), "Pp", {
															locale: locale === "en" ? enFns : frFns,
													  })}
											</TableCell>
											<TableCell>
												<Tooltip title={t.users["edit-user"]}>
													<span>
														<IconButton
															onClick={(): void => handleOpenUserDialog(row)}
															// disabled={isLoading}
														>
															<EditIcon />
														</IconButton>
													</span>
												</Tooltip>

												<Tooltip title={t.users["delete-user"]}>
													<span>
														<IconButton
															aria-label="delete"
															onClick={(): Promise<void> =>
																handleDelete(row.id)
															}
															disabled={row.id === auth?.value?.user?.id}
														>
															<DeleteIcon />
														</IconButton>
													</span>
												</Tooltip>
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 53 * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows?.length ?? 0}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>

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
			</CardContent>
		</Card>
	);
}
