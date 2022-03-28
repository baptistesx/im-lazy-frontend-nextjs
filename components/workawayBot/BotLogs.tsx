import { LoadingButton } from "@mui/lab";
import { Box, Card, Typography } from "@mui/material";
import { useSnackbars } from "@providers/SnackbarProvider";
import { clearLogs, setCity } from "@services/workawayBotApi";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import CitiesFormDialog from "./CitiesFormDialog";

let botLogsMessageSentIsFirst = true;

const BotLogs = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const [socket, setSocket] = useState<Socket | undefined>(undefined);
	const [isSocketInitialized, setIsSocketInitialized] =
		useState<boolean>(false);

	const snackbarsService = useSnackbars();

	const [botLogs, setBotLogs] = useState<string[] | undefined>(undefined);

	const [isClearingLogs, setIsClearingLogs] = useState<boolean>(false);

	const [isCitiesDialogOpen, setIsCitiesDialogOpen] = useState<boolean>(false);

	const [fullCitySelected, setFullCitySelected] = useState<string | undefined>(
		undefined
	);

	const [cities, setCities] = useState<string[] | undefined>(undefined);

	const handleOpenCitiesDialog = (citiesArray: string[]): void => {
		setCities(citiesArray);

		setIsCitiesDialogOpen(true);
	};

	const handleCloseCitiesDialog = async (
		city: string | undefined
	): Promise<void> => {
		if (city) {
			setFullCitySelected(city);

			await setCity(city).catch(() => {
				snackbarsService?.addSnackbar({
					message: t.workawayBot["error-setting-city"],
					severity: "error",
				});
			});

			setIsCitiesDialogOpen(false);
		} else {
			snackbarsService?.addSnackbar({
				message: t.workawayBot["no-city-selected"],
				severity: "error",
			});
		}
	};

	useEffect(() => {
		if (socket === null) {
			setSocket(socketIOClient(process.env.NEXT_PUBLIC_ENDPOINT));
		}

		if (socket !== null && !isSocketInitialized) {
			setIsSocketInitialized(true);

			socket?.on("connection", (log: string) => {
				setBotLogs((logs: string[] | undefined) =>
					logs === undefined ? [log] : [...logs, log]
				);

				scrollLogsDown();
			});

			socket?.on("botLogs", (log: string) => {
				if (log.constructor === Array) {
					setBotLogs((logs) =>
						logs === undefined ? [...log] : [logs[0], ...log]
					);
				} else {
					setBotLogs((logs) =>
						logs === undefined ? [...log] : [...logs, log]
					);
				}

				scrollLogsDown();
			});

			socket?.on("botLogsMessageSent", (log: string) => {
				if (botLogsMessageSentIsFirst) {
					setBotLogs((logs) => (logs === undefined ? [log] : [...logs, log]));
					botLogsMessageSentIsFirst = false;
				} else {
					setBotLogs((logs) =>
						logs === undefined ? [log] : [...logs.slice(0, -1), log]
					);
				}

				scrollLogsDown();
			});

			socket?.on("citiesList", async (cities: string[]) =>
				handleOpenCitiesDialog(cities)
			);
		}
	}, [socket, isSocketInitialized]);

	const handleClickClearConsole = async (): Promise<void> => {
		setIsClearingLogs(true);

		await clearLogs((status: number) => {
			if (status === 200) {
				setBotLogs(() => []);
			}

			setIsClearingLogs(false);
		}).catch(() => {
			setIsClearingLogs(false);

			snackbarsService?.addSnackbar({
				message: t.workawayBot["error-clearing-logs"],
				severity: "error",
			});
		});
	};

	const scrollLogsDown = (): void => {
		var elem = document.querySelector("#logs");

		if (elem) {
			elem.scrollTop = elem?.scrollHeight;
		}
	};

	return (
		<Card
			id="logs"
			sx={{
				width: "45%",
				minWidth: 320,
				minHeight: 400,
				maxHeight: "80vh",
				m: 1,
				p: 1,
				bgcolor: "#353b48",
				color: "#ffffff",
				display: "flex",
				flexGrow: 1,
				justifyContent: "space-between",
				flexDirection: "column",
				overflow: "auto",
			}}
		>
			<Box>
				{botLogs?.map((log, index) => (
					<Typography key={log + index}>{log}</Typography>
				))}
			</Box>

			<LoadingButton
				variant="contained"
				loading={isClearingLogs}
				sx={{
					m: 1,
				}}
				disabled={false}
				onClick={handleClickClearConsole}
			>
				{t.workawayBot["clear-logs"]}
			</LoadingButton>

			<CitiesFormDialog
				keepMounted
				open={isCitiesDialogOpen}
				onClose={handleCloseCitiesDialog}
				value={fullCitySelected}
				cities={cities}
			/>
		</Card>
	);
};

export default BotLogs;
