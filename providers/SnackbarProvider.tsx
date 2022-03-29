import { SnackbarMessage } from "@components/layout/CustomSnackbar";
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
	addSnackbar: (snackbar: SnackbarMessage) => void;
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
	const [snackbars, setSnackbars] = useState<SnackbarMessage[] | undefined>(
		undefined
	);

	useEffect(() => {
		if (snackbars !== undefined && snackbars.length > 0) {
			const timer = setTimeout(
				() =>
					setSnackbars((snackbars) =>
						snackbars?.slice(0, snackbars.length - 1)
					),
				AUTO_DISMISS_MS
			);
			return () => clearTimeout(timer);
		}
		return;
	}, [snackbars]);

	// TODO: replace useEffect with useTimeout, but how?
	// useTimeout(() => {
	// 	setSnackbars((snackbars) => snackbars?.slice(-1));
	// }, AUTO_DISMISS_MS);

	const addSnackbar = (snackbar: SnackbarMessage): void => {
		setSnackbars((snackbars: SnackbarMessage[] | undefined) =>
			snackbars === undefined ? [snackbar] : [snackbar, ...snackbars]
		);
	};

	const snackbarContext: SnackbarContextInterface = {
		addSnackbar: addSnackbar,
	};

	return (
		<SnackbarContext.Provider value={snackbarContext}>
			{children}

			{snackbars?.map((snackbar, index) => (
				<Snackbar open={true} key={snackbar.message + index}>
					<Alert severity={snackbar.severity} sx={{ width: "100%" }}>
						{snackbar.message}
					</Alert>
				</Snackbar>
			))}
		</SnackbarContext.Provider>
	);
};

export const useSnackbars = (): SnackbarContextInterface => {
	const context = useContext(SnackbarContext);

	if (context === undefined) {
		throw new Error("useSnackbars must be used withing a SnackbarProvider");
	}

	return context;
};
