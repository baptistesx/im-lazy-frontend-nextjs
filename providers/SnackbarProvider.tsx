import { AlertMessage } from "@components/layout/CustomAlert";
import { Alert, Snackbar } from "@mui/material";
import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface SnackbarContextInterface {
	addAlert: (alert: AlertMessage) => void;
}

export const SnackbarContext = createContext<
	SnackbarContextInterface | undefined
>(undefined);

const AUTO_DISMISS_MS = 5000;

export const SnackBarProvider = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
	const [alerts, setAlerts] = useState<AlertMessage[] | undefined>(undefined);

	const setAlertTimeout = (): NodeJS.Timeout =>
		setTimeout(
			() => setAlerts((alerts) => alerts?.slice(0, alerts.length - 1)),
			AUTO_DISMISS_MS
		);

	useEffect(() => {
		if (alerts !== undefined && alerts?.length > 0) {
			const timer = setAlertTimeout();

			return () => clearTimeout(timer);
		}
		return;
	}, [alerts]);

	const addAlert = (alert: AlertMessage): void => {
		setAlerts((alerts: AlertMessage[] | undefined) =>
			alerts === undefined ? [alert] : [alert, ...alerts]
		);
	};

	const snackbarContext: SnackbarContextInterface = {
		addAlert: addAlert,
	};

	return (
		<SnackbarContext.Provider value={snackbarContext}>
			{children}
			{alerts?.map((alert, index) => (
				<Snackbar open={true} key={alert.message + index}>
					{/* //TODO: replace with CustomAlert */}
					<Alert severity={alert.severity} sx={{ width: "100%" }}>
						{alert.message}
					</Alert>
				</Snackbar>
			))}
		</SnackbarContext.Provider>
	);
};
export const useSnackbars = (): SnackbarContextInterface | undefined =>
	useContext(SnackbarContext);
