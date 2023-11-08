import { LoadingButton } from "@mui/lab";
import { Box, Card, Typography } from "@mui/material";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useAuth } from "@providers/AuthProvider";
import { clearLogs, setCity } from "@services/workawayBotApi";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import CitiesFormDialog from "./CitiesFormDialog";

let botLogsMessageSentIsFirst = true;

type BotLogsProps = {
	setIsRunning: (value: boolean) => void;
};

const BotLogs = (props: BotLogsProps): ReactElement => {
	const { setIsRunning } = props;

	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();
	const auth = useAuth();

	const [socket, setSocket] = useState<Socket | undefined>(undefined);
	const [isSocketInitialized, setIsSocketInitialized] =
		useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

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

			await setCity(city).catch((err) => {
				if (err?.response?.status === 401) {
					enqueueSnackbar(t.auth["sign-in-again"], {
						variant: "error",
					});

					authActions.logout();
				} else {
					enqueueSnackbar(t.workawayBot["error-setting-city"], {
						variant: "error",
					});
				}
			});

			setIsCitiesDialogOpen(false);
		} else {
			enqueueSnackbar(t.workawayBot["no-city-selected"], {
				variant: "error",
			});
		}
	};

	useEffect(() => {
		if (socket === undefined) {
			setSocket(
				socketIOClient(process.env.NEXT_PUBLIC_ENDPOINT, {
					query: { userId: auth?.value?.user?.id },
				})
			);
		}

		if (socket !== undefined && !isSocketInitialized) {
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

			socket?.on("errorLogin", async () => {
				enqueueSnackbar(t.workawayBot["bad-workaway-ids"], {
					variant: "error",
				});

				setIsRunning(false);
			});

			socket?.on("botStopped", async () => {
				enqueueSnackbar(t.workawayBot["bot-stopped"], {
					variant: "info",
				});

				setIsRunning(false);
			});
		}
	}, [socket, isSocketInitialized]);

	const handleClickClearConsole = async (): Promise<void> => {
		setIsClearingLogs(true);

		await clearLogs((status: number) => {
			if (status === 200) {
				setBotLogs(() => []);
			}

			setIsClearingLogs(false);
		}).catch((err) => {
			setIsClearingLogs(false);

			if (err?.response?.status === 401) {
				enqueueSnackbar(t.auth["sign-in-again"], {
					variant: "error",
				});

				authActions.logout();
			} else {
				enqueueSnackbar(t.workawayBot["error-clearing-logs"], {
					variant: "error",
				});
			}
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
				width: { xs: "100%", md: "45%" },
				minHeight: 400,
				maxHeight: "80vh",
				p: 1,
				bgcolor: "#353b48",
				color: "#ffffff",
				display: "flex",
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
