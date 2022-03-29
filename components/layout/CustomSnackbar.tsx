import { Alert, AlertColor } from "@mui/material";
import { ReactElement, ReactNode } from "react";

export type SnackbarMessage = {
	message: string;
	severity: AlertColor;
};

export const CustomSnackbar = ({
	snackbarMessage,
	children,
}: {
	snackbarMessage: SnackbarMessage;
	children: ReactNode;
}): ReactElement => {
	return (
		<Alert
			severity={snackbarMessage.severity}
			action={{ children }}
			sx={{
				width: "100%",
				display: "flex",
				justifyContent: "space-between",
				alignContent: "center",
			}}
		>
			{snackbarMessage.message}
		</Alert>
	);
};
