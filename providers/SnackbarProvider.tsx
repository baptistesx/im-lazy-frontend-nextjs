import { AlertMessage } from "@components/layout/CustomAlert";
import { Alert, Snackbar } from "@mui/material";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface SnackbarContextInterface {
	addAlert: Function;
}

export const SnackbarContext = createContext<
	SnackbarContextInterface | undefined
>(undefined);

const AUTO_DISMISS_MS = 5000;

export function SnackBarProvider({ children }: { children: ReactNode }) {
	const [alerts, setAlerts] = useState<AlertMessage[]>([]);

	const setAlertTimeout = () =>
		setTimeout(
			() => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)),
			AUTO_DISMISS_MS
		);

	useEffect(() => {
		if (alerts.length > 0) {
			const timer = setAlertTimeout();

			return () => clearTimeout(timer);
		}
		return;
	}, [alerts]);

	const addAlert = (alert: AlertMessage) => {
		console.log(alert);
		setAlerts((alerts: AlertMessage[]) => [alert, ...alerts]);
	};

	const snackbarContext: SnackbarContextInterface = {
		addAlert: addAlert,
	};

	return (
		<SnackbarContext.Provider value={snackbarContext}>
			{children}
			{alerts.map((alert, index) => (
				<Snackbar open={true} key={alert.message + index}>
					{/* //TODO: replace with CustomAlert */}
					<Alert severity={alert.severity} sx={{ width: "100%" }}>
						{alert.message}
					</Alert>
				</Snackbar>
			))}
		</SnackbarContext.Provider>
	);
}
export const useSnackbars = () => useContext(SnackbarContext);
