import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { LoadingButton } from "@mui/lab";
import {
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
	Typography,
} from "@mui/material";
import { useSnackbars } from "@providers/SnackbarProvider";
import {
	deleteFileByName,
	downloadFileByName,
	getFilesName,
} from "@services/workawayBotApi";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useCallback, useEffect, useState } from "react";

const FilesSection = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

	const [filesName, setFilesName] = useState<string[] | undefined>(undefined);

	const snackbarsService = useSnackbars();

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);

		await getFilesName((data) => {
			setFilesName([...data]);

			setIsRefreshing(false);
		}).catch(() => {
			setIsRefreshing(false);

			snackbarsService?.addSnackbar({
				message: t.workawayBot["error-getting-filesname"],
				severity: "error",
			});
		});
	}, [snackbarsService, t.workawayBot]);

	useEffect(() => {
		handleRefresh();
	}, [handleRefresh]);

	const handleDownloadFile = async (name: string): Promise<void> => {
		await downloadFileByName(name, (data) => {
			// Create a blob with the data we want to download as a file
			const blob = new Blob([data], { type: "text/json" });
			// Create an anchor element and dispatch a click event on it
			// to trigger a download
			const a = document.createElement("a");
			a.download = name;
			a.href = window.URL.createObjectURL(blob);

			const clickEvt = new MouseEvent("click", {
				view: window,
				bubbles: true,
				cancelable: true,
			});

			a.dispatchEvent(clickEvt);

			a.remove();
		}).catch(() => {
			snackbarsService?.addSnackbar({
				message: t.workawayBot["error-downloading-file"],
				severity: "error",
			});
		});
	};

	const handleDeleteFile = async (name: string): Promise<void> => {
		await deleteFileByName(name, () => handleRefresh()).catch(() => {
			snackbarsService?.addSnackbar({
				message: t.workawayBot["error-deleting-file"],
				severity: "error",
			});
		});
	};

	return (
		<Card
			sx={{
				m: 1,
				p: 1,
				display: "flex",
				flexWrap: "wrap",
			}}
		>
			<CardContent>
				<Typography variant="h2">{t.workawayBot["available-files"]}</Typography>

				{filesName?.length === 0 ? (
					<Typography>{t.workawayBot["no-file-available"]}</Typography>
				) : (
					<TableContainer component={Paper}>
						<Table aria-label="files table">
							<TableHead>
								<TableRow>
									<TableCell align="left">{t.common.name}</TableCell>

									<TableCell align="left">{t.common.actions}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filesName?.map((name) => (
									<TableRow
										key={name}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell component="th" scope="row">
											{name}
										</TableCell>

										<TableCell align="left">
											<IconButton
												aria-label="download"
												onClick={(): Promise<void> => handleDownloadFile(name)}
											>
												<DownloadIcon />
											</IconButton>

											<IconButton
												aria-label="delete"
												onClick={(): Promise<void> => handleDeleteFile(name)}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</CardContent>

			<CardActions>
				<LoadingButton
					variant="contained"
					loading={isRefreshing}
					onClick={handleRefresh}
					sx={{
						m: 1,
					}}
				>
					{t.common.refresh}
				</LoadingButton>
			</CardActions>
		</Card>
	);
};

export default FilesSection;
