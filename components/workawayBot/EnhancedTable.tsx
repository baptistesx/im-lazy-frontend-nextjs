import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
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
import { visuallyHidden } from "@mui/utils";
import { useAuthActions } from "@providers/AuthActionsProvider";
import {
	deleteFileById,
	downloadFileById,
	getFilesInfo,
} from "@services/workawayBotApi";
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

interface FileInfo {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

function createData(
	id: number,
	name: string,
	createdAt: Date,
	updatedAt: Date
): FileInfo {
	return {
		id,
		name,
		createdAt,
		updatedAt,
	};
}

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

function getComparator<Key extends keyof FileInfo>(
	order: Order,
	orderBy: Key
): (a: FileInfo, b: FileInfo) => number {
	if (order === "desc") {
		return (a, b) => descendingComparator(a, b, orderBy);
	} else {
		return (a, b) => -descendingComparator(a, b, orderBy);
	}
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof FileInfo;
	label: string;
	numeric: boolean;
}

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: MouseEvent<unknown>, property: keyof FileInfo) => void;
	onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
	headCells: readonly HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps): ReactElement {
	const {
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		headCells,
		onRequestSort,
	} = props;

	const createSortHandler =
		(property: keyof FileInfo) => (event: MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							"aria-label": "select all desserts",
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						padding={headCell.disablePadding ? "none" : "normal"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface EnhancedTableToolbarProps {
	numSelected: number;
	handleDeleteFiles: () => void;
	handleDownloadFiles: () => void;
	handleRefresh: () => void;
}

const EnhancedTableToolbar = (
	props: EnhancedTableToolbarProps
): ReactElement => {
	const { numSelected, handleDeleteFiles, handleDownloadFiles, handleRefresh } =
		props;
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(
							theme.palette.primary.main,
							theme.palette.action.activatedOpacity
						),
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography
					sx={{ flex: "1 1 100%" }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					sx={{ flex: "1 1 100%" }}
					variant="h6"
					id="tableTitle"
					component="div"
				>
					Fichiers disponibles
				</Typography>
			)}
			{numSelected > 0 ? (
				<Box sx={{ display: "flex" }}>
					<Tooltip title={t.common.download}>
						<IconButton onClick={handleDownloadFiles}>
							<DownloadIcon />
						</IconButton>
					</Tooltip>

					<Tooltip title={t.common.delete}>
						<IconButton onClick={handleDeleteFiles}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</Box>
			) : (
				<Tooltip title={t.common.refresh}>
					<IconButton onClick={handleRefresh}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};

export default function EnhancedTable(): ReactElement {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();

	const [files, setFiles] = useState<FileInfo[] | undefined>(undefined);

	const { enqueueSnackbar } = useSnackbar();

	const handleRefresh = useCallback(async () => {
		await getFilesInfo((files) => {
			setFiles([...files]);
		}).catch((err) => {
			if (err.response.status === 401) {
				enqueueSnackbar(t.auth["sign-in-again"], {
					variant: "error",
				});

				authActions.logout();
			} else {
				enqueueSnackbar(t.workawayBot["error-getting-filesname"], {
					variant: "error",
				});
			}
		});
	}, [t.workawayBot]);

	useEffect(() => {
		handleRefresh();
	}, [handleRefresh]);

	const [order, setOrder] = useState<Order>("asc");
	const [orderBy, setOrderBy] = useState<keyof FileInfo>("updatedAt");
	const [selected, setSelected] = useState<readonly number[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const rows =
		files?.map((file) =>
			createData(file.id, file.name, file.createdAt, file.updatedAt)
		) ?? [];

	const headCells: readonly HeadCell[] = [
		{
			id: "name",
			numeric: false,
			disablePadding: true,
			label: "Name",
		},
		{
			id: "createdAt",
			numeric: false,
			disablePadding: false,
			label: "Created at",
		},
		{
			id: "updatedAt",
			numeric: false,
			disablePadding: false,
			label: "Updated at",
		},
	];

	const handleRequestSort = (
		event: MouseEvent<unknown>,
		property: keyof FileInfo
	): void => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>): void => {
		if (event.target.checked) {
			const newSelecteds = rows?.map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event: MouseEvent<unknown>, id: number): void => {
		const selectedIndex = selected.indexOf(id);
		let newSelected: readonly number[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event: unknown, newPage: number): void => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: ChangeEvent<HTMLInputElement>
	): void => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (id: number): boolean => selected.indexOf(id) !== -1;

	const handleDeleteFiles = (): void => {
		selected.forEach((fileId) => {
			deleteFileById(fileId, (): Promise<void> => {
				enqueueSnackbar(t.workawayBot["file-well-deleted"], {
					variant: "success",
				});

				setFiles((prev) => prev?.filter((file) => file.id !== fileId));
				setSelected((prev) => prev?.filter((id) => id !== fileId));

				return Promise.resolve();
			}).catch((err) => {
				if (err.response.status === 401) {
					enqueueSnackbar(t.auth["sign-in-again"], {
						variant: "error",
					});

					authActions.logout();
				} else {
					enqueueSnackbar(t.workawayBot["error-deleting-file"], {
						variant: "error",
					});
				}
			});
		});
	};

	const handleDownloadFiles = async (): Promise<void> => {
		selected.forEach(async (fileId) => {
			await downloadFileById(fileId, (file) => {
				console.log("download ", fileId);
				// Create a blob with the data we want to download as a file
				const blob = new Blob([JSON.parse(JSON.stringify(file.content))], {
					type: "text/json",
				});

				// Create an anchor element and dispatch a click event on it
				// to trigger a download
				const a = document.createElement("a");
				a.download = file.name;
				a.href = window.URL.createObjectURL(blob);

				// Append to html link element page
				document.body.appendChild(a);

				// Start download
				a.click();

				// Clean up and remove the link
				a.remove();
			}).catch((err) => {
				console.log(err);
				if (err.response.status === 401) {
					enqueueSnackbar(t.auth["sign-in-again"], {
						variant: "error",
					});

					authActions.logout();
				} else {
					enqueueSnackbar(t.workawayBot["error-downloading-file"], {
						variant: "error",
					});
				}
			});
		});
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<Box sx={{ p: 1, minWidth: "320px", flexGrow: 1 }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					numSelected={selected.length}
					handleDeleteFiles={handleDeleteFiles}
					handleDownloadFiles={handleDownloadFiles}
					handleRefresh={handleRefresh}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
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
									const isItemSelected = isSelected(row.id);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											onClick={(event): void => handleClick(event, row.id)}
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.id}
											selected={isItemSelected}
										>
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													checked={isItemSelected}
													inputProps={{
														"aria-labelledby": labelId,
													}}
												/>
											</TableCell>
											<TableCell
												component="th"
												id={labelId}
												scope="row"
												padding="none"
											>
												{row.name}
											</TableCell>
											<TableCell>
												{format(new Date(row.createdAt), "Pp", {
													locale: locale === "en" ? enFns : frFns,
												})}
											</TableCell>
											<TableCell>
												{format(new Date(row.updatedAt), "Pp", {
													locale: locale === "en" ? enFns : frFns,
												})}
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
			</Paper>
		</Box>
	);
}
